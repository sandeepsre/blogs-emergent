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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact message submitted
 */
router.post('/', createContact);

// Protected routes

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied]
 *     responses:
 *       200:
 *         description: List of contact messages
 */
router.get('/', authenticateToken, requireAdmin, getAllContacts);
/**
 * @swagger
 * /contacts/{id}/status:
 *   patch:
 *     summary: Update contact message status
 *     tags: [Contacts]
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
 *                 enum: [new, read, replied]
 *     responses:
 *       200:
 *         description: Contact status updated
 */
router.patch('/:id/status', authenticateToken, requireAdmin, updateContactStatus);
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [Contacts]
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
 *         description: Contact message deleted
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteContact);

export default router;
