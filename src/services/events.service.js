import { updateEvent as updateEventInDb, createEvent as createEventInDb } from "../repositories/events.repository.js";

const validateEventDate = (date) => {
    const now = new Date();
    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        const invalidDateFormatError = new Error('La fecha ingresada no es válida');
        invalidDateFormatError.statusCode = 400;
        throw invalidDateFormatError;
    };

    if (eventDate < now) {
        const invalidDateError = new Error('La fecha del evento no puede ser anterior a la fecha actual');
        invalidDateError.statusCode = 400;
        throw invalidDateError;
    };
};

const validateCapacity = (capacity) => {
    if (isNaN(capacity)) {
        const invalidCapacityFormatError = new Error('La capacidad debe ser un valor numérico');
        invalidCapacityFormatError.statusCode = 400;
        throw invalidCapacityFormatError;
    };

    if (capacity < 1) {
        const capacityError = new Error('La capacidad del evento debe ser de al menos 1');
        capacityError.statusCode = 400;
        throw capacityError;
    };
};

const validatePrice = (price) => {
    if (isNaN(price)) {
        const invalidPriceFormatError = new Error('El precio debe ser un valor numérico');
        invalidPriceFormatError.statusCode = 400;
        throw invalidPriceFormatError;
    };

    if (price < 0) {
        const invalidPrice = new Error('El precio no puede ser menor a cero');
        invalidPrice.statusCode = 400;
        throw invalidPrice;
    };
};

const isMissing = (value) => value === undefined || value === null || value === '';

export const createEventService = async (eventData) => {
    const { title, description, category, date, location, capacity, price } = eventData;

    if (isMissing(title) || isMissing(description) || isMissing(category) || isMissing(date) || isMissing(location) || isMissing(capacity)) {
        const missingFieldsError = new Error('Todos los campos son obligatorios');
        missingFieldsError.statusCode = 400;
        throw missingFieldsError;
    };

    validateEventDate(date);
    validateCapacity(capacity);
    if (price) validatePrice(price);

    return await createEventInDb(eventData);
};

export const updateEventService = async (event, updateData) => {
    if (event.status === 'cancelled' || event.status === 'finished') {
        const closedEventError = new Error('No se puede modificar un evento cancelado o finalizado');
        closedEventError.statusCode = 400;
        throw closedEventError;
    };

    if (updateData.status !== undefined) {
        const statusNotAllowedError = new Error('El estado del evento se modifica desde otro endpoint');
        statusNotAllowedError.statusCode = 400;
        throw statusNotAllowedError;
    };

    if (updateData.date !== undefined) validateEventDate(updateData.date);
    if (updateData.capacity !== undefined) validateCapacity(updateData.capacity);
    if (updateData.price !== undefined) validatePrice(updateData.price);

    return await updateEventInDb(event._id, updateData);
};

const VALID_STATUSES = ['draft', 'published', 'cancelled', 'finished'];

export const updateEventStatusService = async (event, newStatus) => {
    if (event.status === 'cancelled' || event.status === 'finished') {
        const closedEventError = new Error('No se puede cambiar el estado de un evento cancelado o finalizado');
        closedEventError.statusCode = 400;
        throw closedEventError;
    };

    if (!VALID_STATUSES.includes(newStatus)) {
        const invalidStatusError = new Error('El estado ingresado no es válido');
        invalidStatusError.statusCode = 400;
        throw invalidStatusError;
    };

    return await updateEventInDb(event._id, { status: newStatus });
};