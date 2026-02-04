import express from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Protected routes
router.post('/', authenticateToken, requireAdmin, upload.single('featured_image'), createBlog);
router.put('/:id', authenticateToken, requireAdmin, upload.single('featured_image'), updateBlog);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlog);

export default router;
