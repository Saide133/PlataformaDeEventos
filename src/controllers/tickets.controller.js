export const getTickets = async (req, res) => {
    try {
        res.json({ message: 'Listado de tickets' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tickets' });
    }
};

export const createTicket = async (req, res) => {
    try {
        res.json({ message: 'Ticket creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ticket' });
    }
};