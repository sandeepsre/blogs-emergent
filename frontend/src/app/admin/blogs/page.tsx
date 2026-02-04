'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Blog, Category, Tag } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published',
    tags: [] as string[],
    featured_image: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [blogsRes, catsRes, tagsRes] = await Promise.all([
        apiClient.getBlogs({}),
        apiClient.getCategories(),
        apiClient.getTags()
      ]);
      setBlogs(blogsRes.blogs);
      setCategories(catsRes);
      setTags(tagsRes);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      if (formData.featured_image) {
        formDataToSend.append('featured_image', formData.featured_image);
      }

      if (editingBlog) {
        await apiClient.updateBlog(editingBlog.id, formDataToSend);
      } else {
        await apiClient.createBlog(formDataToSend);
      }

      setShowForm(false);
      setEditingBlog(null);
      setFormData({ title: '', content: '', excerpt: '', category_id: '', status: 'draft', tags: [], featured_image: null });
      loadData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await apiClient.deleteBlog(id);
      loadData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const startEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category_id: blog.category_id || '',
      status: blog.status,
      tags: blog.tags?.map(t => t.id) || [],
      featured_image: null
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Button onClick={() => { setShowForm(true); setEditingBlog(null); setFormData({ title: '', content: '', excerpt: '', category_id: '', status: 'draft', tags: [], featured_image: null }); }}>
          <Plus className="h-4 w-4 mr-2" /> New Blog
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Featured Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, featured_image: e.target.files?.[0] || null })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingBlog ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingBlog(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="px-6 py-4">{blog.title}</td>
                  <td className="px-6 py-4">{blog.category_name || '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{blog.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(blog)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(blog.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
