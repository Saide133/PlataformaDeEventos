import { generateToken } from "../utils/jwt.js";

export const registerController =  (req, res) => {    
    res.status(201).json({ 
        status: 'success', 
        message: 'Usuario registrado',
        payload: {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

export const loginController = (req, res) => {
    const tokenUser = {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
    };

    const token = generateToken(tokenUser);

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


