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

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blog_id, author_name, author_email, content]
 *             properties:
 *               blog_id:
 *                 type: string
 *               author_name:
 *                 type: string
 *               author_email:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/', createComment);

// Protected routes

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [approved, pending, rejected]
 *       - in: query
 *         name: blog_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/', authenticateToken, requireAdmin, getAllComments);
/**
 * @swagger
 * /comments/{id}/status:
 *   patch:
 *     summary: Update comment status
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *     responses:
 *       200:
 *         description: Comment status updated
 */
router.patch('/:id/status', authenticateToken, requireAdmin, updateCommentStatus);
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteComment);

export default router;
