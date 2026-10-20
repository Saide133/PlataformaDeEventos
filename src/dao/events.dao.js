import Event from '../models/Event.js';
import '../models/Category.js';

export const createEvent = async (eventData) => {
    try {
        const newEvent = await Event.create(eventData);
        return newEvent;
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            const validationError = new Error(error.message);
            validationError.statusCode = 400;
            throw validationError;
        };

        throw new Error('Error al crear evento');
    }
};

export const findAll = async (filter, options) => {
    try {
        const { skip, limit, sort } = options;
        const events = await Event.find(filter).populate('category').populate('organizer', 'first_name last_name').sort(sort).skip(skip).limit(limit);

        return events;
    } catch (error) {
         console.error(error);
        throw new Error('Error al obtener eventos');
    }
};

export const findById = async (_id) => {
    try {
        const event = await Event.findById(_id);
        return event;
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            const invalidIdError = new Error('El id ingresado no es válido');
            invalidIdError.statusCode = 400;
            throw invalidIdError;
        };

        throw new Error('Error al obtener el evento');
    }
};

export const updateEvent = async (_id, updateData) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        return updatedEvent;
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            const validationError = new Error(error.message);
            validationError.statusCode = 400;
            throw validationError;
        };

        throw new Error('Error al actualizar evento');
    }
};

export const countEvents = async (filter) => {
    try {
        const totalEvents = await Event.countDocuments(filter);
        return totalEvents;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener eventos');
    }
};