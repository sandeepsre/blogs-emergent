'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Blog } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBlogBySlug(slug);
      setBlog(data);
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    try {
      setSubmitting(true);
      await apiClient.createComment({
        blog_id: blog.id,
        ...commentForm
      });
      setMessage('Comment submitted for moderation!');
      setCommentForm({ author_name: '', author_email: '', content: '' });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {blog.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={`http://localhost:5000${blog.featured_image}`}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            {blog.category_name && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {blog.category_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(blog.created_at)}
            </span>
            {blog.author_name && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {blog.author_name}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-500" />
              {blog.tags.map((tag) => (
                <span key={tag.id} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Comments Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comments ({blog.comments?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {blog.comments && blog.comments.length > 0 ? (
              <div className="space-y-4 mb-8">
                {blog.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.author_name}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-8">No comments yet. Be the first to comment!</p>
            )}

            {/* Comment Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
              {message && (
                <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="author_name">Name</Label>
                  <Input
                    id="author_name"
                    value={commentForm.author_name}
                    onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author_email">Email</Label>
                  <Input
                    id="author_email"
                    type="email"
                    value={commentForm.author_email}
                    onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Comment</Label>
                  <Textarea
                    id="content"
                    rows={4}
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Comment'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </article>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 CMS Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
