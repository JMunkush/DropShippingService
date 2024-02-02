import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {Product} from "./product";
import {Inventory} from "./inventory";

@Entity("variant")
export class Variant {
    @PrimaryColumn({ name: "vid" })
    vid: string;
    @Column({nullable: true})
    variantName: string;
    @Column({nullable: true})
    variantNameEn: string;
    @Column({nullable: true})
    variantImage: string
    @Column({nullable: true})
    variantSku: string;
    @Column({nullable: true})
    variantUnit: string;
    @Column({nullable: true})
    variantProperty: string
    @Column({nullable: true})
    variantKey: string;
    @Column({nullable: true})
    variantLength: number;
    @Column({nullable: true})
    variantWidth: number;
    @Column({nullable: true})
    variantHeight: number;
    @Column({nullable: true})
    variantVolume: number;
    @Column({nullable: true})
    variantWeight: number;
    @Column({nullable: true})
    variantSellPrice: string;

    @Column("bigint")
    createTime: number;
    @Column({nullable: true})
    variantStandard: string;
    @Column({nullable: true})
    variantSugSellPrice: string;

    @ManyToOne(() => Product, p => p.variantList)
    @JoinColumn({name: "pid"})
    product: Product;


    @OneToOne(() => Inventory)
    inventory: Inventory;
}
