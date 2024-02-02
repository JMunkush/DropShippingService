export class ShoppingUrl {
    static readonly GET_ACCESS_TOKEN: string = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";
    static readonly REFRESH_ACCESS_TOKEN: string = "https://developers.cjdropshipping.com/api2.0/v1/authentication/refreshAccessToken";


    static readonly CATEGORY_LIST: string = "https://developers.cjdropshipping.com/api2.0/v1/product/getCategory";
    static readonly PRODUCT_LIST: string = "https://developers.cjdropshipping.com/api2.0/v1/product/list";
    static readonly VARIANT_LIST: string = "https://developers.cjdropshipping.com/api2.0/v1/product/variant/query";
    static readonly INVENTORY: string = "https://developers.cjdropshipping.com/api2.0/v1/product/stock/queryByVid";
    static readonly COMMENTS: string = "https://developers.cjdropshipping.com/api2.0/v1/product/productComments";
    static readonly CREATE_ORDER: string = "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder";


    static readonly FREIGHT_CALCULATION: string = "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate";
    static readonly TRACKING_INFORMATION: string = "https://developers.cjdropshipping.com/api2.0/v1/logistic/trackInfo";

}