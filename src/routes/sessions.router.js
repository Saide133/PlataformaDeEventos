import { Router } from 'express';
import { registerController, loginController, currentController, logoutController } from '../controllers/sessions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router(); 

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/current', authMiddleware, currentController);
router.post('/logout', logoutController);
    

export default router;