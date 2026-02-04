# Database Documentation

## Overview

This CMS uses **MySQL (MariaDB)** as the database with the following schema.

**Database Name**: `cms_db`

## Tables

### 1. roles
Stores user roles for role-based access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique role ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Role name (admin, editor, user) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Default Roles**:
- `admin` - Full system access
- `editor` - Content management access
- `user` - Basic user access

---

### 2. users
Stores user accounts with authentication credentials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role_id | INT | FOREIGN KEY → roles.id | User's role |
| name | VARCHAR(255) | | User's display name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- Primary: `id`
- Unique: `email`
- Foreign Key: `role_id` → `roles(id)`

**Notes**:
- Passwords hashed with bcrypt (10 rounds)
- UUIDs used instead of auto-increment for better security

---

### 3. categories
Organizes blog posts into categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| name | VARCHAR(255) | NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly slug |
| description | TEXT | | Category description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- Primary: `id`
- Unique: `slug`

---

### 4. tags
Flexible tagging system for blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| name | VARCHAR(255) | NOT NULL | Tag name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly slug |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes**:
- Primary: `id`
- Unique: `slug`

---

### 5. blogs
Main content table storing blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| title | VARCHAR(500) | NOT NULL | Blog title |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL-friendly slug |
| content | TEXT | NOT NULL | Full blog content (HTML) |
| excerpt | TEXT | | Short description/summary |
| featured_image | VARCHAR(500) | | Path to featured image |
| category_id | VARCHAR(36) | FOREIGN KEY → categories.id | Blog category |
| status | ENUM | 'draft', 'published' | Publication status |
| author_id | VARCHAR(36) | FOREIGN KEY → users.id | Author |
| published_at | TIMESTAMP | NULL | Publication date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- Primary: `id`
- Unique: `slug`
- Index: `status`, `category_id`, `author_id`

**Foreign Keys**:
- `category_id` → `categories(id)` ON DELETE SET NULL
- `author_id` → `users(id)` ON DELETE CASCADE

**Notes**:
- `published_at` set automatically when status changes to 'published'
- Featured images stored in `/backend/uploads/`

---

### 6. blog_tags
Many-to-many relationship between blogs and tags.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| blog_id | VARCHAR(36) | PRIMARY KEY, FOREIGN KEY → blogs.id | Blog reference |
| tag_id | VARCHAR(36) | PRIMARY KEY, FOREIGN KEY → tags.id | Tag reference |

**Composite Primary Key**: (`blog_id`, `tag_id`)

**Foreign Keys**:
- `blog_id` → `blogs(id)` ON DELETE CASCADE
- `tag_id` → `tags(id)` ON DELETE CASCADE

---

### 7. comments
User comments on blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| blog_id | VARCHAR(36) | FOREIGN KEY → blogs.id | Associated blog |
| author_name | VARCHAR(255) | NOT NULL | Commenter name |
| author_email | VARCHAR(255) | NOT NULL | Commenter email |
| content | TEXT | NOT NULL | Comment text |
| status | ENUM | 'pending', 'approved', 'rejected' | Moderation status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Comment timestamp |

**Indexes**:
- Primary: `id`
- Index: `blog_id`, `status`

**Foreign Keys**:
- `blog_id` → `blogs(id)` ON DELETE CASCADE

**Notes**:
- All comments start with 'pending' status
- Only 'approved' comments shown on public blog pages

---

### 8. contacts
Contact form submissions inbox.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 |
| name | VARCHAR(255) | NOT NULL | Sender name |
| email | VARCHAR(255) | NOT NULL | Sender email |
| subject | VARCHAR(500) | | Message subject |
| message | TEXT | NOT NULL | Message content |
| status | ENUM | 'new', 'read', 'replied' | Message status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission time |

**Indexes**:
- Primary: `id`
- Index: `status`

**Notes**:
- All submissions start with 'new' status
- Admin can mark as 'read' or 'replied'

---

## Relationships

```
users
  └─ has many blogs (author_id)
  └─ belongs to role (role_id)

categories
  └─ has many blogs (category_id)

blogs
  └─ belongs to user (author_id)
  └─ belongs to category (category_id)
  └─ has many comments (blog_id)
  └─ has many tags (through blog_tags)

tags
  └─ has many blogs (through blog_tags)

comments
  └─ belongs to blog (blog_id)

contacts
  └─ standalone table (no relations)
```

## Database Setup

### 1. Create Database and Tables
```bash
mysql < /app/backend/scripts/schema.sql
```

### 2. Create Admin User
```bash
cd /app/backend
npm run db:create-admin
```

**Default Admin**:
- Email: `admin@example.com`
- Password: `Admin@123`
- Role: `admin`

## Performance Optimization

### Indexes
The following indexes are created for optimal query performance:

- `blogs.status` - Fast filtering by publication status
- `blogs.category_id` - Quick category-based queries
- `blogs.author_id` - Efficient author lookups
- `comments.blog_id` - Fast comment retrieval per blog
- `comments.status` - Quick moderation filtering
- `contacts.status` - Efficient inbox filtering

### Connection Pooling

The backend uses MySQL connection pooling:
- Max connections: 10
- Wait for connections: enabled
- No queue limit

## Backup & Restore

### Backup
```bash
mysqldump -u root cms_db > cms_backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root cms_db < cms_backup_20250604.sql
```

## Data Types Rationale

### UUIDs (VARCHAR(36))
- Used for primary keys instead of auto-increment
- Better for distributed systems and security
- Prevents ID enumeration attacks
- Generated with `crypto.randomUUID()` in Node.js

### TEXT vs VARCHAR
- `TEXT` for large content (blog content, comments, messages)
- `VARCHAR` for limited strings (names, emails, titles)

### ENUM for Status Fields
- Enforces valid status values at database level
- Better performance than VARCHAR with CHECK constraints
- Used for: blog status, comment status, contact status

## Migration Notes

If you need to modify the schema:

1. **Never drop tables in production** - use migrations
2. **Add new columns with DEFAULT values** to avoid breaking existing data
3. **Test migrations on backup** before applying to production
4. **Create indexes after data insertion** for better performance

## Security Considerations

1. **Password Storage**: Bcrypt with 10 rounds (configurable)
2. **SQL Injection**: All queries use parameterized statements
3. **UUID Primary Keys**: Prevents ID enumeration
4. **Foreign Key Constraints**: Maintains referential integrity
5. **Cascade Deletes**: Automatic cleanup of related records

## Monitoring

### Check Database Size
```sql
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'cms_db'
ORDER BY (data_length + index_length) DESC;
```

### Check Table Stats
```sql
SELECT 
  'blogs' AS table_name, COUNT(*) AS count FROM blogs
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'users', COUNT(*) FROM users;
```

## Troubleshooting

### Connection Issues
```bash
# Check MySQL is running
mysqladmin ping

# Check database exists
mysql -e "SHOW DATABASES LIKE 'cms_db';"

# Verify tables
mysql cms_db -e "SHOW TABLES;"
```

### Reset Database
```bash
# Drop and recreate
mysql -e "DROP DATABASE IF EXISTS cms_db;"
mysql < /app/backend/scripts/schema.sql
cd /app/backend && npm run db:create-admin
```
