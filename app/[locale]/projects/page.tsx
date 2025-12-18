'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  title_en: string;
  title_es: string | null;
  description_en: string;
  description_es: string | null;
  image_url: string | null;
  video_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  technologies: string[];
}

export default function ProjectsPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .order('order', { ascending: true });

      const projectsData = (data || []) as Project[];
      setProjects(projectsData);
      setFilteredProjects(projectsData);

      // Extract unique technologies
      const techSet = new Set<string>();
      projectsData.forEach(project => {
        (project.technologies || []).forEach(tech => techSet.add(tech));
      });
      setAllTechnologies(Array.from(techSet).sort());
      setLoading(false);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        const title = locale === 'es' ? (project.title_es || project.title_en) : project.title_en;
        const description = locale === 'es' ? (project.description_es || project.description_en) : project.description_en;

        return (
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
        );
      });
    }

    // Filter by selected technology
    if (selectedTech) {
      filtered = filtered.filter(project =>
        project.technologies.includes(selectedTech)
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedTech, projects, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Link href={`/${locale}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === 'es' ? 'Volver' : 'Back'}
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">
            {locale === 'es' ? 'Todos los Proyectos' : 'All Projects'}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Explora mi portafolio completo de proyectos y trabajos'
              : 'Explore my complete portfolio of projects and work'}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12 space-y-4 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <Input
              type="text"
              placeholder={t('search') || 'Search projects...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/50 h-12"
            />
          </div>

          {/* Technology Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-white/70 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTech('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTech === ''
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {locale === 'es' ? 'Todos' : 'All'}
              </button>
              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTech === tech
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="text-center mb-8">
          <p className="text-white/60">
            {filteredProjects.length} {locale === 'es' ? 'proyecto(s) encontrado(s)' : 'project(s) found'}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const titleField = locale === 'es' ? 'title_es' : 'title_en';
              const descField = locale === 'es' ? 'description_es' : 'description_en';

              return (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: project[titleField] || project.title_en,
                    description: project[descField] || project.description_en,
                    imageUrl: project.image_url,
                    videoUrl: project.video_url,
                    demoUrl: project.demo_url,
                    repoUrl: project.repo_url,
                    technologies: project.technologies || [],
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">
              {locale === 'es'
                ? 'No se encontraron proyectos con los filtros aplicados'
                : 'No projects found with the applied filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
