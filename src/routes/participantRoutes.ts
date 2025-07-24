import express from 'express';
import { createParticipantApplication, getApprovedParticipants, verifyParticipant, getAllParticipants, getParticipantById, deleteParticipant } from '../controllers/participantController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

router.post('/', createParticipantApplication);
router.get('/approved', getApprovedParticipants);
router.get('/verify/:code', verifyParticipant);
router.get('/all', adminAuth, getAllParticipants);
router.get('/:id', getParticipantById);
router.delete('/:id', deleteParticipant)

export default router; 