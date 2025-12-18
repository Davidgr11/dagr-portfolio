'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Github, Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectPreviewModal } from './ProjectPreviewModal';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    videoUrl: string | null;
    demoUrl: string | null;
    repoUrl: string | null;
    technologies: string[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const t = useTranslations('projects');

  // Check if description is longer than 3 lines (roughly 150 characters)
  const isLongDescription = project.description.length > 150;

  return (
    <>
      <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 group overflow-hidden">
        {project.imageUrl && (
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover scale-110 md:scale-100 md:group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
            {project.title}
          </CardTitle>
          <div className="space-y-2">
            <CardDescription className={`text-white/70 text-justify ${isDescExpanded ? '' : 'line-clamp-3'}`}>
              {project.description}
            </CardDescription>
            {isLongDescription && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {isDescExpanded ? (
                  <>
                    <span>{t('showLess') || 'Show less'}</span>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <span>{t('showMore') || 'Show more'}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-medium rounded-full border border-cyan-400/30 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {project.videoUrl ? (
              <Button
                onClick={() => setIsPreviewOpen(true)}
                size="sm"
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                {t('preview') || 'Preview'}
              </Button>
            ) : project.demoUrl ? (
              <Button asChild size="sm" className="flex-1">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('visitProject') || 'Visit Project'}
                </a>
              </Button>
            ) : null}
            {project.repoUrl && (
              <Button asChild size="sm" variant="outline" className="flex-1">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  {t('viewCode')}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ProjectPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        project={{
          title: project.title,
          description: project.description,
          videoUrl: project.videoUrl,
          demoUrl: project.demoUrl,
        }}
      />
    </>
  );
}
