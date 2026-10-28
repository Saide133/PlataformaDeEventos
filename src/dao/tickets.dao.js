import Ticket from '../models/Ticket.js';

export class TicketDAO {

    async createTicket(ticketData) {
        try {
            const newTicket = await Ticket.create(ticketData);
            return newTicket;
        } catch (error) {
            console.error(error);
            if (error.name === 'ValidationError' || error.name === 'CastError') {
                const validationError = new Error(error.message);
                validationError.statusCode = 400;
                throw validationError;
            };
            throw new Error('Error al crear ticket');
        }
    };

    async findActiveTicketByUserAndEvent(userId, eventId) {
        try {
            const ticket = await Ticket.findOne({
                user: userId,
                event: eventId,
                status: { $ne: 'cancelled' }
            });
            return ticket;
        } catch (error) {
            console.error(error);
            throw new Error('Error al buscar el ticket');
        }
    };

    async countReservedQuantityForEvent(eventId) {
        try {
            const result = await Ticket.aggregate([
                { $match: { event: eventId, status: { $ne: 'cancelled' }}},
                { $group: { _id: '$event', totalReserved: { $sum: '$quantity' }}}
            ]);
            return result[0]?.totalReserved || 0;
        } catch (error) {
            console.error(error);
            throw new Error('Error al calcular el cupo reservado');
        }
    };

    async findTicketsByUser(userId) {
        try {
            const ticketsUser = await Ticket.find({ user: userId }).populate('event', 'title date location');
            return ticketsUser;
        } catch (error) {
            console.error(error);
            throw new Error('Error al buscar Tickets');
        }
    };

    async findTicketsByEvent(eventId) {
        try {
            const ticketsEvent = await Ticket.find({ event: eventId }).populate('user', 'first_name last_name email');
            return ticketsEvent;
        } catch (error) {
            console.error(error);
            throw new Error('Error al buscar Tickets');
        }
    };

    async findTicketById(ticketId) {
        try {
            const ticketById = await Ticket.findById(ticketId).populate('event');
            return ticketById;
        } catch (error) {
            console.error(error);
            throw new Error('No se encontro el Ticket');
        }
    };

    async cancelTicket(ticketId) {
        try {
            const canceledTicket = await Ticket.findByIdAndUpdate(ticketId, { status: 'cancelled', cancelledAt: new Date() }, { new: true, runValidators: true });
            return canceledTicket;
        } catch (error) {
            console.error(error);
            if (error.name === 'ValidationError' || error.name === 'CastError') {
                const validationError = new Error(error.message);
                validationError.statusCode = 400;
                throw validationError;
            };
            throw new Error('Error al cancelar el ticket');
        }
    };
};