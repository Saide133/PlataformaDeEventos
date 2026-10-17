import { Router } from 'express';
import { getUsers, createUser } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles, authorizeEventOwner } from '../middlewares/authorize.middleware.js';

const router = Router();    

router.get('/', authMiddleware, authorizeRoles('admin'), getUsers);
router.post('/', authMiddleware, authorizeRoles('admin'), createUser);

export default router;