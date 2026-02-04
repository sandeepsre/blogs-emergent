export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  status: 'draft' | 'published';
  author_id: string;
  author_name?: string;
  author_email?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Comment {
  id: string;
  blog_id: string;
  blog_title?: string;
  blog_slug?: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface DashboardStats {
  blogs: {
    total: number;
    published: number;
    drafts: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
  };
  contacts: {
    total: number;
    new_messages: number;
  };
  categories: number;
  tags: number;
  recentBlogs: Blog[];
  recentComments: Comment[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
