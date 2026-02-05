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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Taxonomy]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getAllCategories);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     tags: [Taxonomy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/categories', authenticateToken, requireAdmin, createCategory);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Taxonomy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/categories/:id', authenticateToken, requireAdmin, updateCategory);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Taxonomy]
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
 *         description: Category deleted
 */
router.delete('/categories/:id', authenticateToken, requireAdmin, deleteCategory);

// Tags

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Taxonomy]
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get('/tags', getAllTags);
/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a tag
 *     tags: [Taxonomy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created
 */
router.post('/tags', authenticateToken, requireAdmin, createTag);
/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Taxonomy]
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
 *         description: Tag deleted
 */
router.delete('/tags/:id', authenticateToken, requireAdmin, deleteTag);

export default router;
