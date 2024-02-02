import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

(async () => {
    await (await NestFactory.create(AppModule)).listen(8080);
})();