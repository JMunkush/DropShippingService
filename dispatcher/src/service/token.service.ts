import {TokenDataDto} from "../dto/token.data.dto";
import {Injectable, OnModuleInit} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {ShoppingUrl} from "../util/shopping.url";
import * as process from "process";
import {TokenDataUtil} from "../util/token.data.util";
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class TokenService implements OnModuleInit {
    constructor(private readonly httpService: HttpService) {}


    async onModuleInit(): Promise<any> {
        if(process.env.CJ_TOKEN){
            TokenDataUtil.tokenData = {
                accessToken: process.env.CJ_TOKEN,
                accessTokenExpiryDate: "none",
                refreshToken: "none",
                refreshTokenExpiryDate: "none",
                createDate: "none"
            };
        } else {
            try {
                const response = firstValueFrom(this.httpService.post(ShoppingUrl.GET_ACCESS_TOKEN, {
                    email: process.env.CJ_EMAIL,
                    password: process.env.CJ_PASSWORD
                }));

                const body = (await response).data;

                if (body.result) {
                    TokenDataUtil.tokenData = new TokenDataDto(body.data);
                    console.error("Successfully authenticated to get access token.");
                } else {
                    console.error("Failed to get access token. Exiting application.");
                    process.exit(1);
                }
            } catch (e) {
                console.error("Error during access token retrieval. Exiting application.", e.message);
                process.exit(1);
            }
        }
    }

    @Cron(CronExpression.EVERY_WEEK)
    async refreshAccessToken() {
        try {
            if (!TokenDataUtil.tokenData) {
                console.error('Token data is not available. Exiting refreshAccessToken.');
                return;
            }

            const response = await firstValueFrom(this.httpService.post(ShoppingUrl.REFRESH_ACCESS_TOKEN, {
                refreshToken: TokenDataUtil.tokenData.refreshToken,
            }));
            const body = response.data;

            if (body.result) {
                TokenDataUtil.tokenData = body.data;
                console.log("Access token refreshed");
            } else {
                console.error("Failed to refresh access token:", body.message);
            }
        } catch (e) {
            console.error("Error during access token refresh:", e);
        }
    }


}