
export class CreateOrderDto {

    orderNumber: number;
    shippingZip: number;
    shippingCountryCode: string;

    shippingCountry: number;

    shippingProvince: number;
    shippingCity: number;

    shippingAddress: number;
    shippingCustomerName: number;

    shippingPhone: number;
    remark: string;
    fromCountryCode: string;

    logisticName: string;
    houseNumber: string;
    email: string;
    products: [
        {
            "vid": string,
            "quantity": number
        }
    ]

}