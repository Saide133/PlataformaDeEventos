import { createTicketService, cancelTicketService, getMyTicketsService, getEventTicketsService } from '../services/tickets.service.js';
import { TicketResponseDTO } from '../dto/ticket-response.dto.js';

export const createTicket = async (req, res) => {
    try {
        const user = req.user;
        const eventId = req.params.eid;
        const { quantity } = req.body;

        const newTicket = await createTicketService(user._id, eventId, quantity, user);
        const ticketDTO = new TicketResponseDTO(newTicket);

        res.status(201).json({ status: 'success', payload: ticketDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al crear el ticket' });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const user = req.user;

        const myTickets = await getMyTicketsService(user._id);
        const ticketsDTO = myTickets.map(ticket => new TicketResponseDTO(ticket));

        res.status(200).json({ status: 'success', payload: ticketsDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener tickets' });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const eventId = req.params.eid;

        const eventTickets = await getEventTicketsService(eventId);
        const ticketsDTO = eventTickets.map(ticket => new TicketResponseDTO(ticket));

        res.status(200).json({ status: 'success', payload: ticketsDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener tickets del evento' });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const user = req.user;

        const ticketCancelled = await cancelTicketService(ticketId, user);
        const ticketDTO = new TicketResponseDTO(ticketCancelled);

        res.status(200).json({ status: 'success', payload: ticketDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al cancelar el ticket' });
    }
};