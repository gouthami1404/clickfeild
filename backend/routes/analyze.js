import express from 'express';
import { analyzeClient } from '../controllers/analyzeController.js';

const router = express.Router();
router.post('/analyze/:clientId', analyzeClient);
export default router;
