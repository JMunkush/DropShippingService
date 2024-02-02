import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Product} from "./product";

@Entity("category")
export class Category {
    @PrimaryColumn({type: "varchar"})
    categoryId: string;

    @Column()
    categoryName: string;

    @Column({ nullable: true, unique: false, name: "parent_id"})
    parent_id: string;

    @ManyToOne(() => Category, { nullable: true})
    @JoinColumn({ name: 'parent_id'})
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    categoryList: Category[];
    @OneToMany(() => Product, p => p.category)
    productList: Product[];
}
