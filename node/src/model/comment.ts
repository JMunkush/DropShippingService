import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Product} from "./product";

@Entity()
export class Comment {
    @PrimaryColumn("varchar")
    commentId: string;

    @Column()
    comment: string;

    @Column("bigint")
    commentDate: number;

    @Column()
    commentUser: string;

    @Column()
    score: number;

    @Column("jsonb")
    commentUrls: string[];

    @Column()
    countryCode: string;

    @Column()
    flagIconUrl: string;

    @ManyToOne(() => Product, (product) => product.commentList)
    @JoinColumn({name: "pid"})
    product: Product;

}