import { createTicketService, cancelTicketService, getMyTicketsService, getEventTicketsService } from '../services/tickets.service.js';
import { TicketResponseDTO } from '../dto/ticket-response.dto.js';
import { CreateTicketInputDTO } from '../dto/create-ticket-input.dto.js';

export const createTicket = async (req, res, next) => {
    try {
        const user = req.user;
        const eventId = req.params.eid;
        const { quantity } = new CreateTicketInputDTO(req.body);

        const newTicket = await createTicketService(user._id, eventId, quantity, user);
        const ticketDTO = new TicketResponseDTO(newTicket);

        res.status(201).json({ status: 'success', payload: ticketDTO });
    } catch (error) {
        next(error);
    }
};

export const getMyTickets = async (req, res, next) => {
    try {
        const user = req.user;

        const myTickets = await getMyTicketsService(user._id);
        const ticketsDTO = myTickets.map(ticket => new TicketResponseDTO(ticket));

        res.status(200).json({ status: 'success', payload: ticketsDTO });
    } catch (error) {
        next(error);
    }
};

export const getEventTickets = async (req, res, next) => {
    try {
        const eventId = req.params.eid;

        const eventTickets = await getEventTicketsService(eventId);
        const ticketsDTO = eventTickets.map(ticket => new TicketResponseDTO(ticket));

        res.status(200).json({ status: 'success', payload: ticketsDTO });
    } catch (error) {
        next(error);
    }
};

export const cancelTicket = async (req, res, next) => {
    try {
        const ticketId = req.params.tid;
        const user = req.user;

        const ticketCancelled = await cancelTicketService(ticketId, user);
        const ticketDTO = new TicketResponseDTO(ticketCancelled);

        res.status(200).json({ status: 'success', payload: ticketDTO });
    } catch (error) {
        next(error);
    }
};