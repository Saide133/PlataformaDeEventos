import { Router } from 'express';
import { getEvents, createEvent, updateEvent, getEventById, updateEventStatus } from '../controllers/events.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles, authorizeEventOwner } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/', getEvents);
router.post('/', authMiddleware, authorizeRoles('organizer', 'admin'), createEvent);
router.put('/:id', authMiddleware, authorizeRoles('organizer', 'admin'), authorizeEventOwner, updateEvent);
router.get('/:id', getEventById);
router.patch('/:id/status', authMiddleware, authorizeRoles('organizer', 'admin'), authorizeEventOwner, updateEventStatus);

export default router;