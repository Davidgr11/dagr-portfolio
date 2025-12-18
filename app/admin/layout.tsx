import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from 'sonner';
import { User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Optional: Check if user email is in allowed admin emails
  // Uncomment the code below if you want to restrict access to specific emails
  // Add ADMIN_EMAILS to your .env.local file (comma-separated list)
  /*
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  if (adminEmails.length > 0 && !adminEmails.includes(user.email || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Admin Navigation - Desktop only */}
      <nav className="hidden lg:block sticky top-0 z-20 border-b bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Portfolio Admin
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Content Management System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">View Site</span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-10 border-b bg-card/95 backdrop-blur-lg shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium hidden sm:inline">Site</span>
              </Link>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium truncate max-w-[120px]">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout with sidebar */}
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar - mobile burger menu + desktop sidebar */}
          <AdminSidebar />

          {/* Main content */}
          <main className="lg:col-span-9 w-full min-w-0">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
