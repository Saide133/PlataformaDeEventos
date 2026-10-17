import { Router } from 'express';
import passport from 'passport';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import { registerController, loginController, currentController, logoutController } from '../controllers/sessions.controller.js';

const router = Router(); 

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ status: 'error', message: info?.message || 'No se pudo registrar el usuario' });
        }
        req.user = user;
        registerController(req, res);
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ status: 'error', message: info?.message || 'Credenciales inválidas' });
        }
        req.user = user;
        loginController(req, res);
    })(req, res, next);
});

router.get('/current', authMiddleware, currentController);

router.post('/logout', logoutController);
    

export default router;