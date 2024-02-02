import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {DropShoppingService} from "../service/drop.shopping.service";
import {TokenDataUtil} from "../util/token.data.util";
import {CreateOrderDto} from "../dto/create.order.dto";
import {FreightCalculateDto} from "../dto/freight.calculate.dto";

@Controller()
export class MainController {

    constructor(private readonly dropShoppingService: DropShoppingService) {}

    @Get("/currentAccessToken")
    async accessToken(){
        return TokenDataUtil.tokenData;
    }



    @Get("/import")
    async import(){

        try {
            this.dropShoppingService.processImport();
            return {message:"import process started"};
        } catch (e){
            return {message: "try again"}
        }

    }

    @Post("/createOrder")
    async createOrder(@Body() req: CreateOrderDto){

        await this.dropShoppingService.createOrder(req);

        return {message: "the order has successfully created"}
    }

    @Post("/freightCalculate")
    async deliverCost(@Body() req: FreightCalculateDto){
       return await this.dropShoppingService.calculateFreight(req);
    }

    @Get("/trackInfo")
    async getTrackInfo(@Query('trackNumber') trackNumbers: string[]) {
        return await this.dropShoppingService.trackInfo(trackNumbers);
    }

}