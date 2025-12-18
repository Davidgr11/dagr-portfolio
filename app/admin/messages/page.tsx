'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesManagement() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: messagesData } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (messagesData) {
      setMessages(messagesData);
    }

    setLoading(false);
  }

  async function toggleReadStatus(message: ContactMessage) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !message.is_read })
      .eq('id', message.id);

    if (error) {
      toast.error('Error updating message: ' + error.message);
    } else {
      await loadData();
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    const { error } = await supabase.from('contact_messages').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
      setExpandedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function toggleMessageExpanded(id: string) {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'read') return msg.is_read;
    if (filter === 'unread') return !msg.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">
          View and manage messages received through the contact form
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-3 font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All Messages ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-3 font-medium transition-colors ${
            filter === 'unread'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`pb-2 px-3 font-medium transition-colors ${
            filter === 'read'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => {
          const isExpanded = expandedMessages.has(message.id);

          return (
            <Card
              key={message.id}
              className={message.is_read ? 'opacity-75' : 'border-primary/30'}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => toggleMessageExpanded(message.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                      <CardTitle className="text-lg">
                        {message.subject || 'No Subject'}
                      </CardTitle>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <span className="font-medium">{message.name}</span>
                      <span>{message.email}</span>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => toggleReadStatus(message)}
                    >
                      {message.is_read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="default"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="whitespace-pre-wrap text-base">{message.message}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => window.open(`mailto:${message.email}`, '_blank')}
                    >
                      Reply via Email
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {filter === 'all' && 'No messages yet.'}
              {filter === 'unread' && 'No unread messages.'}
              {filter === 'read' && 'No read messages.'}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
