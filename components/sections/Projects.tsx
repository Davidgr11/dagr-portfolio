import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { FadeIn } from '@/components/animations/FadeIn';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ProjectCard } from './ProjectCard';

interface ProjectsProps {
  locale: string;
}

export async function Projects({ locale }: ProjectsProps) {
  const supabase = await createClient();
  const t = await getTranslations('sections');

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .eq('is_visible', true)
    .order('order', { ascending: true })
    .limit(6);

  const projects = (data || []) as Array<{
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
  }>;

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold mb-12 text-center text-white">{t('projects')}</h2>
            <p className="text-center text-white/70">
              No projects added yet. Add some in the admin panel!
            </p>
          </FadeIn>
        </div>
      </section>
    );
  }

  const titleField = locale === 'es' ? 'title_es' : 'title_en';
  const descField = locale === 'es' ? 'description_es' : 'description_en';

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">{t('projects')}</h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {t('projectsSubtitle')}
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard
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
            </StaggerItem>
          ))}
        </Stagger>

        {/* View All Projects Link */}
        <FadeIn delay={0.4}>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:shadow-2xl hover:shadow-cyan-500/30">
              <Link href={`/${locale}/projects`}>
                {t('allProjects')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
