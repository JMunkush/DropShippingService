import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import { Category } from "./category";
import {Variant} from "./variant";
import {Comment} from "./comment";

@Entity("product")
export class Product {
    @PrimaryColumn({name: "pid"})
    pid: string;

    @Column("jsonb")
    productName: string[];

    @Column({nullable: true})
    productNameEn: string;

    @Column({nullable: true})
    productSku: string;

    @Column({nullable: true})
    productImage: string;

    @Column({nullable: true})
    productWeight: string;

    @Column({nullable: true})
    productType: string;

    @Column({nullable: true})
    productUnit: string;


    @Column({nullable: true})
    sellPrice: string;

    @Column({nullable: true})
    remark: string;

    @Column({nullable: true})
    addMarkStatus: string;

    @Column("bigint")
    createTime: number;

    @Column({nullable: true})
    isVideo: boolean;

    @Column({nullable: true})
    saleStatus: number;

    @Column({nullable: true})
    listedNum: number;

    @Column({nullable: true})
    supplierName: string;

    @Column({nullable: true})
    supplierId: string;

    @Column({nullable: true})
    sourceFrom: number;

    @Column({type: "jsonb", nullable: true})
    shippingCountryCode: string[];

    @ManyToOne(() => Category, (category) => category.productList)
    @JoinColumn({name: "category_id"})
    category: Category;

    @Column({nullable: true})
    categoryName: string;

    @OneToMany(() => Variant, v => v.product)
    variantList: Variant[];

    @OneToMany(() => Comment, c => c.product, {cascade: true})
    commentList: Comment[];
}
