import { createEventService, updateEventService, updateEventStatusService, getEventsService, getEventByIdService } from '../services/events.service.js';
import { EventResponseDTO } from '../dto/event-response.dto.js';
import { EventInputDTO } from '../dto/event-input.dto.js';

export const getEvents = async (req, res, next) => {
    try {
        const result = await getEventsService(req.query);
        const eventsDTO = result.events.map(event => new EventResponseDTO(event));

        res.json({
            status: 'success',
            data: eventsDTO,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
        });
    } catch (error) {
        next(error);
    }
};

export const createEvent = async (req, res, next) => {
    try {
        const eventInput = new EventInputDTO(req.body);

        const eventData = {
            ...eventInput,
            organizer: req.user._id
        };

        const newEvent = await createEventService(eventData);
        const eventDTO = new EventResponseDTO(newEvent);

        res.status(201).json({ status: 'success', payload: eventDTO });
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const updateData = new EventInputDTO(req.body);
        const updatedEvent = await updateEventService(req.event, updateData);
        const eventDTO = new EventResponseDTO(updatedEvent);

        res.json({ status: 'success', payload: eventDTO });
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await getEventByIdService(id);

        if (!event) {
            const notFoundError = new Error('No se encontró el evento');
            notFoundError.statusCode = 404;
            throw notFoundError;
        };

        const eventDTO = new EventResponseDTO(event);

        res.json({ status: 'success', payload: eventDTO });
    } catch (error) {
        next(error);
    }
};

export const updateEventStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const updatedEvent = await updateEventStatusService(req.event, status);
        const eventDTO = new EventResponseDTO(updatedEvent);

        res.json({ status: 'success', payload: eventDTO });
    } catch (error) {
        next(error);
    }
};