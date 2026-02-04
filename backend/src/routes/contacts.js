import express from 'express';
import {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createContact);

// Protected routes
router.get('/', authenticateToken, requireAdmin, getAllContacts);
router.patch('/:id/status', authenticateToken, requireAdmin, updateContactStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteContact);

export default router;
