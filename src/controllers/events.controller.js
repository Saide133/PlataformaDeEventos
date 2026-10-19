import { createEvent as createEventInDb, getAllEvents, updateEvent as updateEventInDb, countEvents } from '../repositories/events.repository.js';

export const getEvents = async (req, res) => {
    try {
        const {
            category,
            status,
            location,
            fromDate,
            toDate,
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

        if (fromDate || toDate) {
            filter.date = {};

            if (fromDate) {
                filter.date.$gte = new Date(fromDate)
            };

            if (toDate) {
                filter.date.$lte = new Date(toDate)
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

        const events = await getAllEvents(filter, options);

        const totalEvents = await countEvents(filter);

        res.json({ 
            status: 'success', 
            payload: events,
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

        if (!title || !description || !category || !date || !location || !capacity) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        }

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

        const newEvent = await createEventInDb(eventData);

        res.status(201).json({ status: 'success', payload: newEvent });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear evento' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedEvent = await updateEventInDb(id, updateData);

        res.json({ status: 'success', payload: updatedEvent});
    } catch (error) {
        res.status(500).json({ status: 'error', message:'Error al actualizar evento'});
    }
};