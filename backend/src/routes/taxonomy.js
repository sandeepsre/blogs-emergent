import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllTags,
  createTag,
  deleteTag
} from '../controllers/categoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', authenticateToken, requireAdmin, createCategory);
router.put('/categories/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticateToken, requireAdmin, deleteCategory);

// Tags
router.get('/tags', getAllTags);
router.post('/tags', authenticateToken, requireAdmin, createTag);
router.delete('/tags/:id', authenticateToken, requireAdmin, deleteTag);

export default router;
