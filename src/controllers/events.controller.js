import { createEvent as createEventInDb, getAllEvents, updateEvent as updateEventInDb } from '../repositories/events.repository.js';

export const getEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.json({ status: 'success', payload: events });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener eventos' });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { name, description, date, location, availableTickets } = req.body;

        if (!name || !description || !date || !location || !availableTickets) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        }

        const eventData = {
            name,
            description,
            date,
            location,
            availableTickets,
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