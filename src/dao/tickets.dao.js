import Ticket from '../models/Ticket.js';

export const createTicket = async (ticketData) => {
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

export const findActiveTicketByUserAndEvent = async (userId, eventId) => {
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

export const countReservedQuantityForEvent = async (eventId) => {
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

export const findTicketsByUser = async (userId) => {
    try {
        const ticketsUser = await Ticket.find({ user: userId }).populate( 'event', 'title date location' );
        return ticketsUser;
    } catch (error) {
        console.error(error);
        throw new Error('Error al buscar Tickets');
    }
};

export const findTicketsByEvent = async (eventId) => {
    try {
        const ticketsEvent = await Ticket.find({ event: eventId }).populate( 'user', 'first_name last_name email');
        return ticketsEvent;
    } catch (error) {
        console.error(error);
        throw new Error('Error al buscar Tickets');
    }
};

export const findTicketById = async (ticketId) => {
    try {
        const ticketById = await Ticket.findById(ticketId).populate( 'event' );
        return ticketById;
    } catch (error) {
        console.error(error);
        throw new Error('No se encontro el Ticket');
    }
};

export const cancelTicket = async (ticketId) => {
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
