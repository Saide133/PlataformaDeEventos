import {
    createTicket as createTicketInDb, findActiveTicketByUserAndEvent as findActiveTicketByUserAndEventInDb,
    countReservedQuantityForEvent as countReservedQuantityForEventInDb,
    findTicketsByEvent as findTicketsByEventInDb,
    findTicketsByUser as findTicketsByUserInDb,
    findTicketById as findTicketByIdInDb,
    cancelTicket as cancelTicketInDb
} from '../dao/tickets.dao.js';


export const createTicket = async (ticketData) => {
    return await createTicketInDb(ticketData);
};

export const findActiveTicketByUserAndEvent = async (userId, eventId) => {
    return await findActiveTicketByUserAndEventInDb(userId, eventId);
};

export const countReservedQuantityForEvent = async (eventId) => {
    return await countReservedQuantityForEventInDb(eventId);
};

export const findTicketsByEvent = async (eventId) => {
    return await findTicketsByEventInDb(eventId);
};

export const findTicketsByUser = async (userId) => {
    return await findTicketsByUserInDb(userId);
};

export const findTicketById = async (ticketId) => {
    return await findTicketByIdInDb(ticketId);
};

export const cancelTicket = async (ticketId) => {
    return await cancelTicketInDb(ticketId);
};