'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  FolderKanban,
  Award,
  Code,
  Trophy,
  Mail,
  Menu,
  X,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverBg: 'hover:bg-blue-500/20',
  },
  {
    href: '/admin/hero',
    label: 'Hero Section',
    icon: User,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    hoverBg: 'hover:bg-purple-500/20',
  },
  {
    href: '/admin/about',
    label: 'About & Education',
    icon: GraduationCap,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    hoverBg: 'hover:bg-green-500/20',
  },
  {
    href: '/admin/experience',
    label: 'Experience',
    icon: Briefcase,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/20',
  },
  {
    href: '/admin/projects',
    label: 'Projects',
    icon: FolderKanban,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/20',
  },
  {
    href: '/admin/certifications',
    label: 'Certifications',
    icon: Award,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    hoverBg: 'hover:bg-pink-500/20',
  },
  {
    href: '/admin/skills',
    label: 'Skills',
    icon: Code,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    hoverBg: 'hover:bg-indigo-500/20',
  },
  {
    href: '/admin/awards',
    label: 'Awards',
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    hoverBg: 'hover:bg-yellow-500/20',
  },
  {
    href: '/admin/messages',
    label: 'Messages',
    icon: Mail,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    hoverBg: 'hover:bg-red-500/20',
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile burger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-40',
          'w-72 lg:w-auto lg:col-span-3',
          'bg-gradient-to-b from-background via-background to-muted/30',
          'border-r border-border',
          'transition-transform duration-300 ease-in-out',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 lg:p-0 space-y-1">
          {/* Mobile header */}
          <div className="lg:hidden mb-6 pt-16 px-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Portfolio Admin
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your content
            </p>
          </div>

          {/* Menu items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:translate-x-1',
                  isActive
                    ? `${item.bgColor} ${item.color} font-semibold shadow-sm border-l-4 border-current`
                    : `hover:bg-muted ${item.hoverBg} text-muted-foreground hover:text-foreground`
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isActive ? item.bgColor : 'group-hover:bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive ? item.color : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                </div>
                <span className="text-sm lg:text-base">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout button */}
          <Link
            href="/admin/logout"
            onClick={closeSidebar}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 mt-4 border-t border-border pt-4"
          >
            <div className="p-2 rounded-lg transition-colors group-hover:bg-red-500/20">
              <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-sm lg:text-base font-medium">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
