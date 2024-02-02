import {Repository} from "typeorm";
import {Product} from "../model/product";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Variant} from "../model/variant";
import {CategoryService} from "./category.service";
import {Inventory} from "../model/inventory";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>,
                @InjectRepository(Variant) private readonly variantRepository: Repository<Variant>,
                @InjectRepository(Inventory) private readonly inventoryRepository: Repository<Inventory>,
                private readonly categoryService: CategoryService) {}


    public async saveProduct(product){

        const variantList = product.variantList;
        delete product.variantList;
        await this.saveProductToDb(product);
        if(variantList) {
            try {

                for (const variant of variantList) {
                    variant.product = product;
                    delete variant.pid;
                    await this.saveVariant(variant);

                    if(variant.inventory) {
                        const inventory = variant.inventory[0];
                        delete variant.inventory;
                        inventory.variant = variant;

                        await this.saveInventory(inventory);
                    }
                }

            } catch (e){
                console.log(product);
                console.log(e);
            }
        }

    }
    private async saveProductToDb(product) {

        product.category = await this.categoryService.findCategoryById(product.categoryId);

        const createdProduct = this.productRepository.create(product);

        return this.productRepository.save(createdProduct);

    }

    async saveVariant(variant){
        const createdVariant = this.variantRepository.create(variant);
        return this.variantRepository.save(createdVariant);
    }

    async saveInventory(inventory){
        const createdInventory = this.inventoryRepository.create(inventory);
        return this.inventoryRepository.save(createdInventory);
    }
}