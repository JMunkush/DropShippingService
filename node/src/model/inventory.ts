import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Variant} from "./variant";

@Entity({name: "inventory"})
export class Inventory {

    @PrimaryGeneratedColumn()
    inventoryId: number;


    @Column()
    areaId: number;

    @Column()
    areaEn: string;
    @Column()

    countryCode: string;
    @Column()

    storageNum: number;

    @OneToOne(() => Variant)
    @JoinColumn({ name: "variant_id" })
    variant: Variant;
}
