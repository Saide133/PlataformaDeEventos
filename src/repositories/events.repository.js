import { EventDAO } from '../dao/events.dao.js';

const eventDAO = new EventDAO();

export class EventRepository {

    async createEvent(eventData) {
        return await eventDAO.create(eventData);
    };

    async getAllEvents(queryParams) {
        return await eventDAO.findAll(queryParams);
    };

    async getEventById(_id) {
        return await eventDAO.findById(_id);
    };

    async updateEvent(_id, updateData) {
        return await eventDAO.update(_id, updateData);
    };

    async countEvents(filter) {
        return await eventDAO.count(filter);
    };
};