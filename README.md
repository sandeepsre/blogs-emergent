# CMS - Content Management System

A modern full-stack CMS built with **Next.js 16**, **TypeScript**, **Express**, and **MySQL**.

## Features

### Public Pages
- **Blog List**: Browse all published blog posts with pagination
- **Blog Detail**: Read full blog posts with comments
- **Contact Form**: Submit contact messages (stored in database)

### Admin Dashboard (`/admin`)
- **Login**: Secure JWT-based authentication
- **Dashboard**: Overview statistics (blogs, comments, contacts)
- **Blog Management**: Create, edit, delete blogs with:
  - Featured images (uploaded to `/backend/uploads`)
  - Categories and tags
  - Draft/Published status
  - Rich content editing
- **Category Management**: Organize blogs into categories
- **Tag Management**: Add tags for better organization
- **Comment Moderation**: Approve/reject/delete comments
- **Contact Inbox**: View and manage contact form submissions

## Tech Stack

### Frontend
- **Next.js 16** with TypeScript and App Router
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- Context API for authentication

### Backend
- **Express.js** REST API
- **MySQL** (MariaDB) database
- **JWT** authentication with bcrypt
- **Multer** for file uploads
- **Nodemailer** (placeholder for email notifications)

## Installation

### Prerequisites
- Node.js 18+ and yarn
- MySQL/MariaDB server running

### Setup

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Configure Backend (.env):**
Edit `/backend/.env` if needed (already configured for local MySQL):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cms_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

3. **Initialize Database:**
```bash
# Create database schema
mysql < backend/scripts/schema.sql

# Create admin user
cd backend
npm run db:create-admin
```

4. **Start Development Servers:**
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend: http://localhost:3000
npm run dev:backend   # Backend: http://localhost:5000
```

## Default Admin Credentials

**⚠️ IMPORTANT: Change these after first login!**

- **Email**: `admin@example.com`
- **Password**: `Admin@123`

Access admin panel at: http://localhost:3000/admin/login

## Project Structure

```
/app/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── page.tsx     # Homepage (blog list)
│   │   │   ├── blog/[slug]/ # Blog detail
│   │   │   ├── contact/     # Contact page
│   │   │   └── admin/       # Admin area
│   │   │       ├── login/
│   │   │       ├── dashboard/
│   │   │       ├── blogs/
│   │   │       ├── categories/
│   │   │       ├── tags/
│   │   │       ├── comments/
│   │   │       └── contacts/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # Auth context
│   │   ├── lib/            # API client, utils
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── middleware/     # Auth, upload middleware
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   └── utils/          # Helper functions
│   ├── scripts/
│   │   ├── schema.sql      # Database schema
│   │   └── create-admin.js # Admin creation script
│   ├── uploads/            # Uploaded media files
│   └── package.json
│
├── package.json            # Root package.json
├── database.md             # Database documentation
└── README.md               # This file
```

## API Endpoints

### Public Endpoints
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/comments` - Submit comment
- `POST /api/contacts` - Submit contact form
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags

### Protected Endpoints (Admin)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/blogs` - Create blog (with file upload)
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/tags` - Create tag
- `DELETE /api/tags/:id` - Delete tag
- `GET /api/comments` - Get all comments
- `PATCH /api/comments/:id/status` - Update comment status
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/contacts` - Get all contacts
- `PATCH /api/contacts/:id/status` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact

## Build for Production

```bash
# Build frontend
cd frontend
yarn build

# Start production servers
cd frontend && yarn start  # Port 3000
cd backend && yarn start   # Port 5000
```

## Database

See [database.md](./database.md) for complete database schema and documentation.

## Security Notes

1. **Change default admin password** immediately after first login
2. **Update JWT_SECRET** in production environment
3. File uploads are limited to 5MB and only accept images
4. All admin routes are protected with JWT authentication
5. Passwords are hashed with bcrypt (10 rounds)

## Features TODO (Optional Enhancements)

- [ ] Email notifications with Nodemailer
- [ ] Image optimization and CDN integration
- [ ] Rich text editor (TinyMCE/Quill)
- [ ] Search functionality
- [ ] SEO metadata management
- [ ] Multi-language support
- [ ] User roles and permissions
- [ ] Blog analytics

## License

MIT

## Support

For issues or questions, please check the documentation or create an issue in the repository.
