import crypto from 'crypto';
import db from '../config/database.js';
import { generateSlug, paginate } from '../utils/helpers.js';

export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const { limit: queryLimit, offset } = paginate(page, limit);

    let query = `
      SELECT b.*, c.name as category_name, c.slug as category_slug,
             u.name as author_name, u.email as author_email
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.author_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(queryLimit, offset);

    const [blogs] = await db.execute(query, params);

    // Get tags for each blog
    for (let blog of blogs) {
      const [tags] = await db.execute(
        `SELECT t.id, t.name, t.slug 
         FROM tags t
         JOIN blog_tags bt ON t.id = bt.tag_id
         WHERE bt.blog_id = ?`,
        [blog.id]
      );
      blog.tags = tags;
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
    const countParams = [];
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      blogs,
      pagination: {
        page: parseInt(page),
        limit: queryLimit,
        total,
        totalPages: Math.ceil(total / queryLimit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [blogs] = await db.execute(
      `SELECT b.*, c.name as category_name, c.slug as category_slug,
              u.name as author_name, u.email as author_email
       FROM blogs b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN users u ON b.author_id = u.id
       WHERE b.slug = ?`,
      [slug]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = blogs[0];

    // Get tags
    const [tags] = await db.execute(
      `SELECT t.id, t.name, t.slug 
       FROM tags t
       JOIN blog_tags bt ON t.id = bt.tag_id
       WHERE bt.blog_id = ?`,
      [blog.id]
    );
    blog.tags = tags;

    // Get approved comments
    const [comments] = await db.execute(
      `SELECT id, author_name, author_email, content, created_at
       FROM comments
       WHERE blog_id = ? AND status = 'approved'
       ORDER BY created_at DESC`,
      [blog.id]
    );
    blog.comments = comments;

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category_id, status = 'draft', tags = [] } = req.body;
    const featured_image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = generateSlug(title);
    const blogId = crypto.randomUUID();
    const published_at = status === 'published' ? new Date() : null;

    await db.execute(
      `INSERT INTO blogs (id, title, slug, content, excerpt, featured_image, category_id, status, author_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [blogId, title, slug, content, excerpt, featured_image, category_id || null, status, req.user.id, published_at]
    );

    // Add tags
    if (tags.length > 0) {
      for (const tagId of tags) {
        await db.execute(
          'INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)',
          [blogId, tagId]
        );
      }
    }

    res.status(201).json({ message: 'Blog created successfully', id: blogId, slug });
  } catch (error) {
    console.error('Create blog error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'A blog with this title already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category_id, status, tags = [] } = req.body;
    const featured_image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Check if blog exists
    const [existing] = await db.execute('SELECT id, status as old_status FROM blogs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?', 'slug = ?');
      params.push(title, generateSlug(title));
    }
    if (content) {
      updates.push('content = ?');
      params.push(content);
    }
    if (excerpt !== undefined) {
      updates.push('excerpt = ?');
      params.push(excerpt);
    }
    if (featured_image) {
      updates.push('featured_image = ?');
      params.push(featured_image);
    }
    if (category_id !== undefined) {
      updates.push('category_id = ?');
      params.push(category_id || null);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
      // Set published_at if status changed to published
      if (status === 'published' && existing[0].old_status !== 'published') {
        updates.push('published_at = ?');
        params.push(new Date());
      }
    }

    if (updates.length > 0) {
      params.push(id);
      await db.execute(
        `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Update tags
    if (tags.length >= 0) {
      await db.execute('DELETE FROM blog_tags WHERE blog_id = ?', [id]);
      for (const tagId of tags) {
        await db.execute(
          'INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }

    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM blogs WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
