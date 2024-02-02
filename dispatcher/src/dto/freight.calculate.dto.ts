export class FreightCalculateDto {

    startCountryCode: string;
    endCountryCode: string;
    products: [
        {
            quantity: number;
            vid: string;
        }
    ];

}