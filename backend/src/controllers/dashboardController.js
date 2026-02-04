import db from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get total blogs
    const [blogsCount] = await db.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "published" THEN 1 ELSE 0 END) as published, SUM(CASE WHEN status = "draft" THEN 1 ELSE 0 END) as drafts FROM blogs'
    );

    // Get total comments
    const [commentsCount] = await db.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved FROM comments'
    );

    // Get total contacts
    const [contactsCount] = await db.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "new" THEN 1 ELSE 0 END) as new_messages FROM contacts'
    );

    // Get total categories and tags
    const [categoriesCount] = await db.execute('SELECT COUNT(*) as total FROM categories');
    const [tagsCount] = await db.execute('SELECT COUNT(*) as total FROM tags');

    // Get recent blogs
    const [recentBlogs] = await db.execute(
      'SELECT id, title, slug, status, created_at FROM blogs ORDER BY created_at DESC LIMIT 5'
    );

    // Get recent comments
    const [recentComments] = await db.execute(
      `SELECT c.id, c.author_name, c.content, c.status, c.created_at, b.title as blog_title 
       FROM comments c 
       JOIN blogs b ON c.blog_id = b.id 
       ORDER BY c.created_at DESC LIMIT 5`
    );

    res.json({
      blogs: blogsCount[0],
      comments: commentsCount[0],
      contacts: contactsCount[0],
      categories: categoriesCount[0].total,
      tags: tagsCount[0].total,
      recentBlogs,
      recentComments
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
