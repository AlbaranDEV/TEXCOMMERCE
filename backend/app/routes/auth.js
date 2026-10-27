import { Router } from 'express';
import { login } from '../controllers/controller.auth.js';
import { limiteAutenticacion } from '../middleware/limite.middleware.js';

const router = Router();

router.post('/login', limiteAutenticacion, login);

export default router;
