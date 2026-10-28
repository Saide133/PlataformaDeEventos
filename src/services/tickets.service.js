import { getEventByIdService } from './events.service.js';
import { TicketRepository } from '../repositories/tickets.repository.js';
import { generateReservationCode } from '../utils/ticketCode.js';
import { sendTicketConfirmationEmail } from './mailer.service.js';

const ticketRepository = new TicketRepository();

export const createTicketService = async (userId, eventId, quantity, user) => {
    const event = await getEventByIdService(eventId);

    if (!event) {
        const eventError = new Error('No se encontro el evento');
        eventError.statusCode = 404;
        throw eventError;
    };

    if (event.status !== 'published') {
        const eventUnavailable = new Error('El evento no esta disponible');
        eventUnavailable.statusCode = 400;
        throw eventUnavailable;
    };

    const now = new Date();
    if (event.date < now) {
        const eventExpired = new Error('El evento es antiguo');
        eventExpired.statusCode = 400;
        throw eventExpired;
    };

    if(isNaN(quantity) || quantity <= 0) {
        const quantityInvalid = new Error('La cantidad de tickets no es valida');
        quantityInvalid.statusCode = 400;
        throw quantityInvalid;
    };

    if(await ticketRepository.findActiveTicketByUserAndEvent(userId, eventId)) {
        const ticketExistente = new Error('El usuario ya posee un ticket para este evento');
        ticketExistente.statusCode = 409;
        throw ticketExistente;
    };

    const totalReservado = await ticketRepository.countReservedQuantityForEvent(event._id);
    if((event.capacity - totalReservado) < quantity) {
        const capacityError = new Error('Excede los cupos disponibles');
        capacityError.statusCode = 400;
        throw capacityError;
    };

    const reservationCode = generateReservationCode();

    const newTicket = await ticketRepository.createTicket({
        user: userId,
        event: event._id,
        quantity,
        reservationCode
    });

    await sendTicketConfirmationEmail({
        to: user.email,
        userName: user.first_name,
        eventTitle: event.title,
        ticketCode: reservationCode
    });

    return newTicket;
};

export const cancelTicketService = async (ticketId, requestingUser) => {
    const ticket = await ticketRepository.findTicketById(ticketId);

    if (!ticket){
        const ticketError = new Error('No se encontro el Ticket');
        ticketError.statusCode = 404;
        throw ticketError;
    };

    if (!ticket.user.equals(requestingUser._id) && requestingUser.role !== 'admin'){
        const credencialError = new Error('No tienes permisos para acceder a este Ticket');
        credencialError.statusCode = 403;
        throw credencialError;
    };

    if (ticket.status === 'cancelled'){
        const ticketCancelled = new Error('El ticket ya fue cancelado');
        ticketCancelled.statusCode = 400;
        throw ticketCancelled;
    };

    if (ticket.event.status === 'finished'){
        const eventExpired = new Error('No se puede cancelar el Ticket, el evento ya finalizo');
        eventExpired.statusCode = 400;
        throw eventExpired;
    };

    return await ticketRepository.cancelTicket(ticketId);
};

export const getMyTicketsService = async (userId) => {
    return await ticketRepository.findTicketsByUser(userId);
};

export const getEventTicketsService = async (eventId) => {
    return await ticketRepository.findTicketsByEvent(eventId);
};