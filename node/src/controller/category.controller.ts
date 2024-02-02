import {EventPattern} from "@nestjs/microservices";
import {Controller} from "@nestjs/common";
import {RabbitUtil} from "../util/RabbitUtil";
import {CategoryService} from "../service/category.service";

@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    // count of categories 527
    @EventPattern(RabbitUtil.CATEGORY)
    async consumeCategories(data: { pattern: string; data: any }) {

        console.log("categories consumed");
        const categories = JSON.parse(data.toString());

        await this.categoryService.saveCategories(categories);

    }






}