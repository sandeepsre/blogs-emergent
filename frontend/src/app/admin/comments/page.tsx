'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Comment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Check, X, Trash2 } from 'lucide-react';

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await apiClient.getComments({});
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.updateCommentStatus(id, status);
      loadComments();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await apiClient.deleteComment(id);
      loadComments();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Comments</h1>

      <div className="space-y-4">
        {comments.map(comment => (
          <Card key={comment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{comment.author_name}</span>
                    <span className="text-sm text-gray-500">{comment.author_email}</span>
                    <span className={`px-2 py-1 rounded text-xs ${comment.status === 'approved' ? 'bg-green-100 text-green-800' : comment.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">On: {comment.blog_title}</p>
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(comment.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  {comment.status !== 'approved' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(comment.id, 'approved')}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {comment.status !== 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(comment.id, 'rejected')}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
