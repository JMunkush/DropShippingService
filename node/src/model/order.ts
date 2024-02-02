import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderNumber: string;

    @Column()
    shippingZip: string;

    @Column()
    shippingCountryCode: string;

    @Column()
    shippingCountry: string;

    @Column()
    shippingProvince: string;

    @Column()
    shippingCity: string;

    @Column()
    shippingAddress: string;

    @Column()
    shippingCustomerName: string;

    @Column()
    shippingPhone: string;

    @Column()
    remark: string;

    @Column()
    fromCountryCode: string;

    @Column()
    logisticName: string;

    @Column()
    houseNumber: string;

    @Column()
    email: string;

    @Column('jsonb', { nullable: true })
    products: { vid: string; quantity: number }[];
}
