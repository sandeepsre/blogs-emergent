import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics (counts of blogs, comments, views, etc.)
 */
router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);

export default router;
