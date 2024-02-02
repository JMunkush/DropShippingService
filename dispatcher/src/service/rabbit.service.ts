import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {RabbitUtil} from "../util/RabbitUtil";
import {firstValueFrom} from "rxjs";

@Injectable()
export class RabbitService  {
    private readonly logger = new Logger(RabbitService.name);

    constructor(@Inject(RabbitUtil.NAME) private readonly client: ClientProxy) { }

    async sendCategories(message: string): Promise<void> {
        try {
            await firstValueFrom(this.client.emit<any>(RabbitUtil.CATEGORY, message));
            console.log("sent to categories queue")
        } catch (e) {
            this.logger.error('Error sending message to queue', e);
        }
    }

    async sendProduct(message: string) {
        try {
            await firstValueFrom(this.client.emit<any>(RabbitUtil.PRODUCT, message));
        } catch (e) {
            this.logger.error('Error sending message to queue', e);
        }
    }


    async sendOrder(message: string) {
        try {
            await firstValueFrom(this.client.emit<any>(RabbitUtil.ORDER, message));
        } catch (e) {
            this.logger.error('Error sending message to queue', e);
        }
    }
}
