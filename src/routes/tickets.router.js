import { Router } from 'express';
import { getTickets, createTicket } from '../controllers/tickets.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();    

router.get('/', authMiddleware, getTickets);
router.post('/', authMiddleware, createTicket); 

export default router;