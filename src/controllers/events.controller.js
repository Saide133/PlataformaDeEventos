export const getEvents = async (req, res) => {
    try {
        res.json({ status: 'success', payload: [] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener eventos' });
    }
};

export const createEvent = async (req, res) => {
    try {
        res.json({ status: 'success', message: 'Evento creado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear evento' });
    }
};