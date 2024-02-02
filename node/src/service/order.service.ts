import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../model/order";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

    async save(order) {
        const createdOrder = this.orderRepository.create(order);

        return await this.orderRepository.save(createdOrder);
    }
}
