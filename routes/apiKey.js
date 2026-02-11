import { Router } from 'express';
import { generateApiKey } from '../controllers/apiKey.js';

const router = Router();

router.post('/generate', generateApiKey);

export default router;
