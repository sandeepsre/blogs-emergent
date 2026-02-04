'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Blog } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, truncate } from '@/lib/utils';
import { BookOpen, Mail, Home } from 'lucide-react';

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBlogs({ page: currentPage, limit: 9, status: 'published' });
      setBlogs(response.blogs);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">CMS Blog</h1>
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary transition">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-gray-700 hover:text-primary transition">
                <Mail className="h-4 w-4" />
                Contact
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">Admin Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to Our Blog</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover insightful articles, tutorials, and stories from our community
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No published blogs yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                  {blog.featured_image && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={`http://localhost:5000${blog.featured_image}`}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {blog.category_name && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {blog.category_name}
                        </span>
                      )}
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <CardTitle className="text-xl">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {blog.excerpt ? truncate(blog.excerpt, 120) : truncate(blog.content, 120)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/blog/${blog.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 CMS Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
