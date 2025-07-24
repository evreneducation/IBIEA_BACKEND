import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { AdminController } from '../controllers/AdminController';

const router = express.Router();
const adminController = new AdminController();

router.post('/login', adminController.login);
router.post('/refresh', adminController.refreshToken);
router.post('/logout', adminAuth, adminController.logout);
router.get('/auth-status', adminAuth, adminController.getAuthStatus);
router.get('/nominations', adminAuth, adminController.getAllNominations);
router.get('/nominations/:id', adminAuth, adminController.getNominationById);
router.delete('/nominations/:id', adminAuth, adminController.deleteNomination);
router.put('/nominations/:id', adminAuth, adminController.updateNomination);

export default router; 
