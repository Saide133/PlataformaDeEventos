export class RegisterInputDTO {
    constructor(body) {
        this.first_name = body.first_name?.trim();
        this.last_name = body.last_name?.trim();
        this.email = body.email?.trim().toLowerCase();
        this.password = body.password;
    }
}