import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./model/category";
import {Inventory} from "./model/inventory";
import {Product} from "./model/product";
import {Variant} from "./model/variant";
import * as process from "process";
import {CategoryModule} from "./module/category.module";
import {ProductModule} from "./module/product.module";
import {Comment} from "./model/comment";
import {OrderModule} from "./module/order.module";
import {Order} from "./model/order";

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Category, Inventory, Product, Variant, Comment, Order],
      synchronize: true
    }),
    CategoryModule,
    ProductModule,
    OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
