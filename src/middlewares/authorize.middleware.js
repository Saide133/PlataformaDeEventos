import { getEventById } from '../repositories/events.repository.js';

export const authorizeRoles = (...allowedRoles) => {
    return (req,res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            })
        };

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para realizar esta acción'
            })
        };

        next();
    }
};

export const authorizeEventOwner = (paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const eventId = req.params[paramName];
            const event = await getEventById(eventId);

            if (!event) {
            return res.status(404).json({ status: 'error', message: 'Evento no encontrado' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOwner = event.organizer.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ status: 'error', message: 'No tenés permisos para modificar este evento' });
        }

        req.event = event;
        next();

        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al validar permisos' });
        }
    };
};