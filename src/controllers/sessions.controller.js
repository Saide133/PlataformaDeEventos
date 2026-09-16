import { registerUser } from '../services/sessions.service.js';

export const registerController = async (req, res) => {
    try {
        const newUser = await registerUser(req.body);

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
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message});
    }
};

