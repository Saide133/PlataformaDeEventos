import express from 'express';
import userRoutes from './routes/users.router.js';
import sessionsRoutes from './routes/sessions.router.js';
import eventsRoutes from './routes/events.router.js';
import ticketsRoutes from './routes/tickets.router.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor activo' });
});

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tickets', ticketsRoutes);

export default app;