import { Router } from 'express';
import passport from 'passport';
import { registerController, loginController, currentController, logoutController } from '../controllers/sessions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router(); 

router.post('/register', passport.authenticate('register', { session: false }), registerController);
router.post('/login', passport.authenticate('login', { session: false }), loginController);
router.get('/current', authMiddleware, currentController);
router.post('/logout', logoutController);
    

export default router;