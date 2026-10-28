import { TicketDAO } from '../dao/tickets.dao.js';

const ticketDAO = new TicketDAO();

export class TicketRepository {

    async createTicket(ticketData) {
        return await ticketDAO.createTicket(ticketData);
    };

    async findActiveTicketByUserAndEvent(userId, eventId) {
        return await ticketDAO.findActiveTicketByUserAndEvent(userId, eventId);
    };

    async countReservedQuantityForEvent(eventId) {
        return await ticketDAO.countReservedQuantityForEvent(eventId);
    };

    async findTicketsByUser(userId) {
        return await ticketDAO.findTicketsByUser(userId);
    };

    async findTicketsByEvent(eventId) {
        return await ticketDAO.findTicketsByEvent(eventId);
    };

    async findTicketById(ticketId) {
        return await ticketDAO.findTicketById(ticketId);
    };

    async cancelTicket(ticketId) {
        return await ticketDAO.cancelTicket(ticketId);
    };
};