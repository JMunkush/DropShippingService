import {Controller} from "@nestjs/common";
import {EventPattern} from "@nestjs/microservices";
import {RabbitUtil} from "../util/RabbitUtil";
import {OrderService} from "../service/order.service";

@Controller()
export class OrderController {

    constructor(private readonly orderService: OrderService) {}

    @EventPattern(RabbitUtil.ORDER)
    async consumeCategories(data: { pattern: string; data: any }) {

        console.log("order consumed");

        const order = JSON.parse(data.toString());

        await this.orderService.save(order)
    }

}