import express from 'express';
import {
  getAllComments,
  createComment,
  updateCommentStatus,
  deleteComment
} from '../controllers/commentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createComment);

// Protected routes
router.get('/', authenticateToken, requireAdmin, getAllComments);
router.patch('/:id/status', authenticateToken, requireAdmin, updateCommentStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteComment);

export default router;
