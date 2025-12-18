import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Admin',
  description: 'Admin panel for managing portfolio content',
  manifest: '/admin-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Portfolio Admin',
  },
};

export default function AdminPage() {
  redirect('/admin/dashboard');
}
