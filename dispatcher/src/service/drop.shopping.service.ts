import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TokenDataUtil } from "../util/token.data.util";
import {firstValueFrom} from "rxjs";
import {ShoppingUrl} from "../util/shopping.url";
import {RabbitService} from "./rabbit.service";
import {CreateOrderDto} from "../dto/create.order.dto";
import {FreightCalculateDto} from "../dto/freight.calculate.dto";

@Injectable()
export class DropShoppingService {
    constructor(private readonly httpService: HttpService,
                private readonly rabbitService: RabbitService) {}



    async processImport() {
        await this.importCategories();
        await new Promise(resolve => setTimeout(resolve, 60000));
        await this.importProducts();
    }




    private async importCategories(){
        try {
            const accessToken = TokenDataUtil.tokenData.accessToken;
            const response = firstValueFrom(this.httpService.get(
                ShoppingUrl.CATEGORY_LIST,
                {
                    headers: {'CJ-Access-Token': accessToken},
                }
            ));
            const body = (await response).data;
            console.log("server response for categories: " + body.result);
            if(body.result){
                await this.rabbitService.sendCategories(JSON.stringify(body.data));
            } else {
                console.log(body);
            }

        } catch (e){
            console.log(e)
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR, {});
        }

    }

    private async importProducts(){
        try {
            const accessToken = TokenDataUtil.tokenData.accessToken;
            const response = firstValueFrom(this.httpService.get(
                ShoppingUrl.PRODUCT_LIST,
                {
                    headers: {'CJ-Access-Token': accessToken},
                }
            ));
            const body = (await response).data;
            console.log("server response for products: " + body.result);
            if(body.result){
                console.log("importing products...")
                await this.importAllProducts(body.data.total);
            } else {
                console.log(body);
            }

        } catch (e){
            console.log(e)
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR, {});
        }

    }
    private async importAllProducts(total: number) {
        const remain: number = total % 100;
        const pageSize: number = 10;
        const limit: number = (total - remain) / pageSize;

        const accessToken = TokenDataUtil.tokenData.accessToken;

        await new Promise(resolve => setTimeout(resolve, 2000));

        for (let i = 1; i <= limit; i++) {
            try {
                const response = await firstValueFrom(this.httpService.get(
                    ShoppingUrl.PRODUCT_LIST,
                    {
                        headers: {'CJ-Access-Token': accessToken},
                        params: {"pageSize": pageSize, "pageNum": i}
                    }
                ));



                await this.saveProduct(response);


                await new Promise(resolve => setTimeout(resolve, 5000));

            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('Rate limit exceeded. Waiting...' + error);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    console.error('Error:', error.message);
                }
            }

        }

        await new Promise(resolve => setTimeout(resolve, 2000));


        for (let i = 1; i <= remain; i++) {
            try {
                const response = await firstValueFrom(this.httpService.get(
                    ShoppingUrl.PRODUCT_LIST,
                    {
                        headers: {'CJ-Access-Token': accessToken},
                        params: {"pageSize": remain, "pageNum": limit + 1}
                    }
                ));


                await this.saveProduct(response);

                await new Promise(resolve => setTimeout(resolve, 5000));

            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('Rate limit exceeded. Waiting...' + error);
                    console.log('pageNum' + i);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    console.error('Error:', error.message);
                }
            }
        }
    }

    private async saveProduct(response){
        if (response.data) {
            const products = response.data.data.list;
            for(const product of products) {
                console.log("-----------------------------------------------------------------");
                await this.setDataToProduct(product);
                this.sendProductToQueue(product);
            }
        } else {
            console.log(response.data);
        }
    }
    private async setDataToProduct(product) {
        const accessToken = TokenDataUtil.tokenData.accessToken;
        try {
            const variantResponse = await firstValueFrom(this.httpService.get(
                ShoppingUrl.VARIANT_LIST,
                {
                    headers: {'CJ-Access-Token': accessToken},
                    params: {"pid": product.pid}
                }
            ));

            const variants = variantResponse.data.data;

            if (variants) {
                console.log("setting data to product with id: " + product.pid)
                await this.setVariantsAndInventoryToProduct(variants, product);
                await this.setCommentsToProduct(product);
            }

            console.log("setting data successfully")

            await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('setData: Rate limit exceeded. Waiting...' + error);
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.error('setData: Error:', error.message);
            }
        }

    }

    private async setCommentsToProduct(product) {
        const accessToken = TokenDataUtil.tokenData.accessToken;
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            const response = await firstValueFrom(this.httpService.get(
                ShoppingUrl.COMMENTS,
                {
                    headers: {'CJ-Access-Token': accessToken},
                    params: {"pid": product.pid}
                }
            ));


            const data = response.data.data;

            if (data) {
                if (data.total !== 0) {
                    const comments = [];
                    for (let i = 1; i < data.total; i++) {
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        const response = await firstValueFrom(this.httpService.get(
                            ShoppingUrl.COMMENTS,
                            {
                                headers: {'CJ-Access-Token': accessToken},
                                params: {"pid": product.pid, "pageNum": i}
                            }
                        ));
                        comments.push(response.data.data.list);
                    }

                    product.comments = comments;
                } else {
                    return;
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log(`setComment: Rate limit exceeded: ${JSON.stringify(error.response.data)}`);
            } else {
                console.error('setComment: Error:', error.message, " pid: ", product.pid);
            }
        }
    }



    private async setVariantsAndInventoryToProduct(variants, product){
        const accessToken = TokenDataUtil.tokenData.accessToken;
        console.log("setting variants and inventory...")
        for(const variant of variants){
            try {

                const inventoryResponse = await firstValueFrom(this.httpService.get(
                    ShoppingUrl.INVENTORY,
                    {
                        headers: {'CJ-Access-Token': accessToken},
                        params: {"vid": variant.vid}
                    }
                ));
                const inventory = inventoryResponse.data.data;
                if (inventory) {
                    variant.inventory = inventory;
                }
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('Rate limit exceeded. Waiting...' + error);
                } else {
                    console.error('Error:', error.message);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        product.variantList = variants;
    }
    private sendProductToQueue(product){
        console.log(`sent to product queue: № ${product.pid}`);
        this.rabbitService.sendProduct(product).then(r => r);

    }

    async createOrder(req: CreateOrderDto) {
        try {
            const createResponse = await firstValueFrom(
                this.httpService.post(
                    ShoppingUrl.CREATE_ORDER,
                    req,
                    {
                        headers: {
                            'CJ-Access-Token': TokenDataUtil.tokenData.accessToken,
                            'Content-Type': 'application/json',
                        },
                    }
                )
            );

            if(createResponse.data.result){
                await this.rabbitService.sendOrder(JSON.stringify(req));
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    async calculateFreight(req: FreightCalculateDto) {
        const response = await firstValueFrom(
            this.httpService.post(
                ShoppingUrl.FREIGHT_CALCULATION,
                req,
                {
                    headers: {
                        'CJ-Access-Token': TokenDataUtil.tokenData.accessToken,
                        'Content-Type': 'application/json',
                    },
                }
            )
        );
        return response.data;
    }

    async trackInfo(trackNumbers) {
        const params = trackNumbers.map(trackNumber => `trackNumber=${trackNumber}`).join('&');


        return (await firstValueFrom(this.httpService.get(`https://developers.cjdropshipping.com/api2.0/v1/logistic/trackInfo?${params}`,
            {
                headers: {
                    'CJ-Access-Token': TokenDataUtil.tokenData.accessToken,
                }
            }))).data;
    }
}




