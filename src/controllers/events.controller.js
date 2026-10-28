import { createEventService, updateEventService, updateEventStatusService, getEventsService, getEventByIdService, countEventsService } from '../services/events.service.js';
import { EventResponseDTO } from '../dto/event-response.dto.js';

export const getEvents = async (req, res) => {
    try {
        const {
            category,
            status,
            location,
            dateFrom,
            dateTo,
            search,
            page = 1,
            limit = 10,
            sort = 'date'
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        };

        if (status) {
            filter.status = status;
        };

        if (location) {
            filter.location = {
                $regex: location,
                $options: 'i'
            };
        };

        if (dateFrom || dateTo) {
            filter.date = {};

            if (dateFrom) {
                filter.date.$gte = new Date(dateFrom)
            };

            if (dateTo) {
                filter.date.$lte = new Date(dateTo)
            };
        };

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {  
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const options = { skip, limit: limitNumber, sort};

        const events = await getEventsService(filter, options);
        const eventsDTO = events.map(event => new EventResponseDTO(event));

        const totalEvents = await countEventsService(filter);

        res.json({ 
            status: 'success', 
            payload: eventsDTO,
            pagination: {
                total: totalEvents,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalEvents / limitNumber)
            }
         });
        
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener eventos' });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, capacity, price, status } = req.body;

        const eventData = {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status,
            organizer: req.user._id
        };

        const newEvent = await createEventService(eventData);
        const eventDTO = new EventResponseDTO(newEvent);

        res.status(201).json({ status: 'success', payload: eventDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al crear evento' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const updateData = req.body;
        const updatedEvent = await updateEventService(req.event, updateData);
        const eventDTO = new EventResponseDTO(updatedEvent);

        res.json({ status: 'success', payload: eventDTO});
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al actualizar evento'});
    }
};

export const getEventById = async(req, res) =>{
    try {
        const { id } = req.params;
        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'No se encontró el evento'});   
        };

        const eventDTO = new EventResponseDTO(event);

        res.json({ status: 'success', payload: eventDTO });
    } catch (error){
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener el evento'});
    }

};

export const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedEvent = await updateEventStatusService(req.event, status);
        const eventDTO = new EventResponseDTO(updatedEvent);

        res.json({ status: 'success', payload: eventDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al actualizar el estado del evento' });
    }
};