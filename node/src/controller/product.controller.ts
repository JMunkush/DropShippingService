import {Controller} from "@nestjs/common";
import {EventPattern} from "@nestjs/microservices";
import {RabbitUtil} from "../util/RabbitUtil";
import {ProductService} from "../service/product.service";

@Controller()
export class ProductController {

    constructor(private readonly productService: ProductService) {}
    @EventPattern(RabbitUtil.PRODUCT)
    async consumeProduct(data: { pattern: string; data: any }) {
        console.log("product consumed");
        await this.productService.saveProduct(data);
    }




}