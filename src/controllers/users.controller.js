export const getUsers = async (req, res) => {
    try {
        res.json({ status: 'success', payload: [] });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const createUser = async (req, res) => {
    try {
        res.json({ message: 'Usuario creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};