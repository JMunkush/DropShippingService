export class TokenDataDto {
    accessToken: string;
    accessTokenExpiryDate: string;
    refreshToken: string;
    refreshTokenExpiryDate: string;
    createDate: string;

    constructor({accessToken, accessTokenExpiryDate, refreshToken, refreshTokenExpiryDate, createDate}) {
        this.accessToken = accessToken;
        this.accessTokenExpiryDate = accessTokenExpiryDate;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiryDate = refreshTokenExpiryDate;
        this.createDate = createDate;
    }

}
