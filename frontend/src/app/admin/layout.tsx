'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, FileText, FolderOpen, Tag, MessageSquare, Mail, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">CMS Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </div>
          </Link>
          <Link href="/admin/blogs">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <FileText className="h-5 w-5" />
              Blogs
            </div>
          </Link>
          <Link href="/admin/categories">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <FolderOpen className="h-5 w-5" />
              Categories
            </div>
          </Link>
          <Link href="/admin/tags">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <Tag className="h-5 w-5" />
              Tags
            </div>
          </Link>
          <Link href="/admin/comments">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <MessageSquare className="h-5 w-5" />
              Comments
            </div>
          </Link>
          <Link href="/admin/contacts">
            <div className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
              <Mail className="h-5 w-5" />
              Contacts
            </div>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
