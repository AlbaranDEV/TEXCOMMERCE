import { Router } from 'express';
import { getTelas, getTelaByCodigo } from '../controllers/controller.telas.js';

const router = Router();

router.get('/telas', getTelas);
router.get('/telas/:codigo', getTelaByCodigo);

export default router;
