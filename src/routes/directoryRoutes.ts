import express from 'express';
import { requestDirectory } from '../controllers/directoryController';

const router = express.Router();

router.post('/request', requestDirectory);

export default router; 