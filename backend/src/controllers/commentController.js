import crypto from 'crypto';
import db from '../config/database.js';

export const getAllComments = async (req, res) => {
  try {
    const { status, blog_id } = req.query;
    let query = `
      SELECT c.*, b.title as blog_title, b.slug as blog_slug
      FROM comments c
      JOIN blogs b ON c.blog_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (blog_id) {
      query += ' AND c.blog_id = ?';
      params.push(blog_id);
    }

    query += ' ORDER BY c.created_at DESC';

    const [comments] = await db.execute(query, params);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const createComment = async (req, res) => {
  try {
    const { blog_id, author_name, author_email, content } = req.body;

    if (!blog_id || !author_name || !author_email || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if blog exists
    const [blogs] = await db.execute('SELECT id FROM blogs WHERE id = ? AND status = "published"', [blog_id]);
    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const commentId = crypto.randomUUID();

    await db.execute(
      'INSERT INTO comments (id, blog_id, author_name, author_email, content) VALUES (?, ?, ?, ?, ?)',
      [commentId, blog_id, author_name, author_email, content]
    );

    res.status(201).json({ message: 'Comment submitted for moderation', id: commentId });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await db.execute(
      'UPDATE comments SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment status updated successfully' });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM comments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
