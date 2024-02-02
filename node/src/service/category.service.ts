import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../model/category";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async saveCategories(categories) {
        for (const categoryFirst of categories) {
            const fCategory = new Category();
            fCategory.parent = null;
            fCategory.categoryId = categoryFirst.categoryFirstId;
            fCategory.categoryName = categoryFirst.categoryFirstName;

            await this.categoryRepository.save(fCategory);

            for (const categorySecond of categoryFirst.categoryFirstList) {
                const sCategory = new Category();
                sCategory.categoryId = categorySecond.categorySecondId;
                sCategory.categoryName = categorySecond.categorySecondName;
                sCategory.parent = fCategory;
                await this.categoryRepository.save(sCategory);

                for (const category of categorySecond.categorySecondList) {
                    const tCategory = new Category();
                    tCategory.categoryId = category.categoryId;
                    tCategory.categoryName = category.categoryName;
                    tCategory.parent = sCategory;
                    await this.categoryRepository.save(tCategory);
                }
            }
        }
    }


    async findCategoryById(categoryId) {
        categoryId = categoryId.toString().trim();
        if (categoryId) {
            try {
                const category = await this.categoryRepository.findOne({ where: { "categoryId": categoryId } });
                if (category) {
                    return category;
                } else {
                    console.log('category not found with categoryId: ' + categoryId);
                }
            } catch (e) {
                console.log('Error finding category:', e);
            }
        }
    }



}
