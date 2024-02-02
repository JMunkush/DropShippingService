import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {MainController} from "./controller/main.controller";
import {TokenService} from "./service/token.service";
import {DropShoppingService} from "./service/drop.shopping.service";
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import * as process from "process";
import {RabbitUtil} from "./util/RabbitUtil";
import {RabbitService} from "./service/rabbit.service";

@Module({
    imports: [ConfigModule.forRoot({isGlobal: true}),
        ClientsModule.register([
            {
                name: RabbitUtil.NAME,
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                    queue: RabbitUtil.CATEGORY,
                },
            },
            {
                name: RabbitUtil.NAME,
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                    queue: RabbitUtil.PRODUCT,
                },
            },
            {
                name: RabbitUtil.NAME,
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                    queue: RabbitUtil.ORDER,
                },
            }
        ]),
        HttpModule],
    providers: [TokenService, DropShoppingService, RabbitService],
    controllers: [MainController]
})
export class AppModule {}