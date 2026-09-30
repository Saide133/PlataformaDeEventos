import { registerUser, loginUser } from '../services/sessions.service.js';

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

export const loginController = async (req, res) => {
    try{
        const token = await loginUser(req.body);

        res.cookie('currentUser', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Login correcto'
        });
    }catch(error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message});
    }
};

export const currentController = (req, res) => {
    res.status(200).json({
        status: 'success',
        payload: req.user
    });
};

export const logoutController = (req, res) => {
    res.clearCookie('currentUser');
    res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada'
    })
};


