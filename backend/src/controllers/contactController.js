import crypto from 'crypto';
import db from '../config/database.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contactId = crypto.randomUUID();

    await db.execute(
      'INSERT INTO contacts (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [contactId, name, email, subject, message]
    );

    res.status(201).json({ message: 'Contact message sent successfully', id: contactId });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [contacts] = await db.execute(query, params);
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await db.execute(
      'UPDATE contacts SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact status updated successfully' });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
