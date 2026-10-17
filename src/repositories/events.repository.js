import { createEvent as createEventInDb, findAll, findById, updateEvent as updateEventInDb } from '../dao/events.dao.js';

export const createEvent = async (eventData) => {
    return await createEventInDb(eventData);
};

export const getAllEvents = async () => {
    return await findAll();
};

export const getEventById = async (_id) => {
    return await findById(_id);
};

export const updateEvent = async (_id, updateData) => {
    return await updateEventInDb(_id, updateData);
};