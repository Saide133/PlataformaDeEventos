//import { registerUser } from '../services/sessions.service.js';

export const registerController = async (req, res) => {
    try {
       // const user = await registerUser(req.body);
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

