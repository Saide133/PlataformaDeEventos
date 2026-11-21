export class EventInputDTO {
    constructor(body) {
        this.title = body.title?.trim();
        this.description = body.description?.trim();
        this.category = body.category;
        this.date = body.date;
        this.location = body.location?.trim();
        this.capacity = body.capacity;
        this.price = body.price;
        this.status = body.status;
    }
}