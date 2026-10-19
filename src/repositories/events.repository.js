import { createEvent as createEventInDb, findAll, findById, updateEvent as updateEventInDb, countEvents as countEventsInDb } from '../dao/events.dao.js';

export const createEvent = async (eventData) => {
    return await createEventInDb(eventData);
};

export const getAllEvents = async (filter, options) => {
    return await findAll(filter, options);
};

export const getEventById = async (_id) => {
    return await findById(_id);
};

export const updateEvent = async (_id, updateData) => {
    return await updateEventInDb(_id, updateData);
};

export const countEvents = async (filter) => {
    return await countEventsInDb(filter);
};