import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductService} from "../service/product.service";
import {Product} from "../model/product";
import {Variant} from "../model/variant";
import {Inventory} from "../model/inventory";
import {ProductController} from "../controller/product.controller";
import {CategoryModule} from "./category.module";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Variant, Inventory]), CategoryModule],
    providers: [ProductService],
    controllers: [ProductController]
})
export class ProductModule {}