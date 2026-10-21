import { createTicketService, cancelTicketService } from '../services/tickets.service.js';
import { findTicketsByUser, findTicketsByEvent } from '../repositories/tickets.repository.js';

export const createTicket = async (req, res) => {
    try {
        const user = req.user;
        const eventId = req.params.eid;
        const { quantity } = req.body;

        const newTicket = await createTicketService(user._id, eventId, quantity, user);

        res.status(201).json({ status: 'success', payload: newTicket });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al crear el ticket' });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const user = req.user;

        const myTickets = await findTicketsByUser(user._id);

        res.status(200).json({ status: 'success', payload: myTickets });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener tickets' });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const eventId = req.params.eid;

        const eventTickets = await findTicketsByEvent(eventId);

        res.status(200).json({ status: 'success', payload: eventTickets });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener tickets del evento' });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const user = req.user;

        const ticketCancelled = await cancelTicketService(ticketId, user);
        
        res.status(200).json({ status: 'success', payload: ticketCancelled });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al cancelar el ticket' });
    }
};