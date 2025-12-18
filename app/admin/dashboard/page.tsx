import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  Award,
  GraduationCap,
  Code,
  Trophy,
  Mail,
  FolderKanban,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch comprehensive counts and stats
  const [
    { count: projectsCount },
    { data: projectsData },
    { count: experienceCount },
    { count: educationCount },
    { count: certificationsCount },
    { count: skillsCount },
    { count: awardsCount },
    { count: messagesCount },
    { data: messagesData },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('is_visible, is_featured'),
    supabase.from('experience').select('*', { count: 'exact', head: true }),
    supabase.from('education').select('*', { count: 'exact', head: true }),
    supabase.from('certifications').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('awards').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('is_read'),
  ]);

  // Calculate additional stats
  const visibleProjects = projectsData?.filter((p) => p.is_visible).length || 0;
  const featuredProjects = projectsData?.filter((p) => p.is_featured).length || 0;
  const unreadMessages = messagesData?.filter((m) => !m.is_read).length || 0;

  const stats = [
    {
      title: 'Projects',
      value: projectsCount || 0,
      subtitle: `${visibleProjects} visible, ${featuredProjects} featured`,
      href: '/admin/projects',
      icon: FolderKanban,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Experience',
      value: experienceCount || 0,
      subtitle: 'Work history entries',
      href: '/admin/experience',
      icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Education',
      value: educationCount || 0,
      subtitle: 'Academic background',
      href: '/admin/about',
      icon: GraduationCap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Skills',
      value: skillsCount || 0,
      subtitle: 'Technical skills',
      href: '/admin/skills',
      icon: Code,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Certifications',
      value: certificationsCount || 0,
      subtitle: 'Verified credentials',
      href: '/admin/certifications',
      icon: Award,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Awards',
      value: awardsCount || 0,
      subtitle: 'Recognition & honors',
      href: '/admin/awards',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Messages',
      value: messagesCount || 0,
      subtitle: `${unreadMessages} unread`,
      href: '/admin/messages',
      icon: Mail,
      color: unreadMessages > 0 ? 'text-red-500' : 'text-gray-500',
      bgColor: unreadMessages > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your portfolio content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/hero"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Update Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Edit hero section & socials
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/admin/projects"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <FolderKanban className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Add Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase your latest work
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/admin/experience"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Briefcase className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Add Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Update work timeline
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/admin/certifications"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Award className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Add Certification</h3>
                  <p className="text-sm text-muted-foreground">
                    New credentials
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/admin/skills"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                  <Code className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manage Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Update tech stack
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/admin/about"
              className="group p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                  <GraduationCap className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Edit About</h3>
                  <p className="text-sm text-muted-foreground">
                    Update bio & education
                  </p>
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">SQL Schema Executed</p>
                <p className="text-xs text-muted-foreground">
                  Database tables are ready
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                !
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Create Storage Buckets</p>
                <p className="text-xs text-muted-foreground">
                  Go to Supabase → Storage → Create buckets: profile-images,
                  resumes, company-logos, project-media, certifications,
                  tech-logos, awards-icons
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Environment Variables</p>
                <p className="text-xs text-muted-foreground">
                  Configured in .env.local
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white text-xs">
                →
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Start Adding Content</p>
                <p className="text-xs text-muted-foreground">
                  Use the admin panels above to populate your portfolio
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
