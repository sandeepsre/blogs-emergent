'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Contact } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Mail, Trash2 } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await apiClient.getContacts({});
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.updateContactStatus(id, status);
      loadContacts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await apiClient.deleteContact(id);
      loadContacts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

      <div className="space-y-4">
        {contacts.map(contact => (
          <Card key={contact.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-gray-500">{contact.email}</span>
                    <span className={`px-2 py-1 rounded text-xs ${contact.status === 'new' ? 'bg-blue-100 text-blue-800' : contact.status === 'read' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                      {contact.status}
                    </span>
                  </div>
                  {contact.subject && <p className="font-medium mb-2">{contact.subject}</p>}
                  <p className="text-gray-800 mb-2">{contact.message}</p>
                  <p className="text-xs text-gray-500">{formatDate(contact.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  {contact.status === 'new' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(contact.id, 'read')}>Mark Read</Button>
                  )}
                  {contact.status === 'read' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(contact.id, 'replied')}>Mark Replied</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(contact.id)}>
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
