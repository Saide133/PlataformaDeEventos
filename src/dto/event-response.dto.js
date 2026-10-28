export class EventResponseDTO {
    constructor(event) {
        this.id = event._id.toString();
        this.title = event.title;
        this.description = event.description;
        this.date = event.date;
        this.location = event.location;
        this.capacity = event.capacity;
        this.price = event.price;
        this.status = event.status;

        this.category = event.category?.name
            ? { id: event.category._id.toString(), name: event.category.name }
            : event.category?.toString();

        this.organizer = event.organizer?.first_name
            ? {
                id: event.organizer._id.toString(),
                first_name: event.organizer.first_name,
                last_name: event.organizer.last_name
              }
            : event.organizer?.toString();
    }
};