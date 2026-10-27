import { Router } from 'express';
import { login } from '../controllers/controller.auth.js';

const router = Router();

router.post('/login', login);

export default router;