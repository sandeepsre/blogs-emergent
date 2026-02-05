import crypto from 'crypto';
import db from '../config/database.js';
import { generateSlug } from '../utils/helpers.js';


export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = generateSlug(name);
    const categoryId = crypto.randomUUID();

    await db.execute(
      'INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)',
      [categoryId, name, slug, description]
    );

    res.status(201).json({ message: 'Category created successfully', id: categoryId });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?', 'slug = ?');
      params.push(name, generateSlug(name));
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const [result] = await db.execute(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const [tags] = await db.execute(
      'SELECT * FROM tags ORDER BY name'
    );
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const slug = generateSlug(name);
    const tagId = crypto.randomUUID();

    await db.execute(
      'INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)',
      [tagId, name, slug]
    );

    res.status(201).json({ message: 'Tag created successfully', id: tagId });
  } catch (error) {
    console.error('Create tag error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tag with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM tags WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};
