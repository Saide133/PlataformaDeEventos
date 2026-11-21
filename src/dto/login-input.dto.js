export class LoginInputDTO {
    constructor(body) {
        this.email = body.email?.trim().toLowerCase();
        this.password = body.password;
    }
}