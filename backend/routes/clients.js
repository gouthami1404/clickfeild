import express from 'express';
import { getClientById, getClients } from '../controllers/clientController.js';

const router = express.Router();
router.get('/clients', getClients);
router.get('/client/:id', getClientById);
export default router;
