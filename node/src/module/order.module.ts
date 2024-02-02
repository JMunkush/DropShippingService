import {Module} from "@nestjs/common";
import {OrderController} from "../controller/order.controller";
import {OrderService} from "../service/order.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "../model/order";

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}