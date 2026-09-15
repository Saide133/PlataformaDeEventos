import User from '../models/User.js';
//import { registerUser } from '../services/sessions.service.js';

export const registerController = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        };

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(409).json({ status: 'error', message: 'Ya existe un usuario registrado con ese email' });
        };

        const newUser = await User.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password,
            role: 'user'
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Usuario registrado',
            payload: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor'});
    }
};

