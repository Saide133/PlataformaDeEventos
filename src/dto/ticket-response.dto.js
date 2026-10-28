export class TicketResponseDTO {
    constructor(ticket) {
        this.id = ticket._id.toString();
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.reservationCode = ticket.reservationCode;
        this.cancelledAt = ticket.cancelledAt;

        this.user = ticket.user?.first_name
            ? {
                id: ticket.user._id.toString(),
                first_name: ticket.user.first_name,
                last_name: ticket.user.last_name,
                email: ticket.user.email
              }
            : ticket.user?.toString();

        this.event = ticket.event?.title
            ? {
                id: ticket.event._id.toString(),
                title: ticket.event.title,
                date: ticket.event.date,
                location: ticket.event.location,
                status: ticket.event.status
              }
            : ticket.event?.toString();
    }
};