'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    videoUrl: string | null;
    demoUrl: string | null;
  };
}

export function ProjectPreviewModal({ isOpen, onClose, project }: ProjectPreviewModalProps) {
  const t = useTranslations('projects');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-[1600px] h-auto max-h-[95vh] overflow-y-auto bg-black/95 backdrop-blur-xl border-2 border-cyan-500/30 custom-scrollbar p-6 lg:p-8 rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Two column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-10">
          {/* Left column: Info - 2 columns */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <DialogTitle className="text-3xl text-white mb-4">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base leading-relaxed text-justify">
                {project.description}
              </DialogDescription>
            </div>

            {/* Action Button */}
            {project.demoUrl && (
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {t('visitProject') || 'Visit Project'}
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Right column: Video - 5 columns */}
          <div className="lg:col-span-5 flex items-center">
            {project.videoUrl && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10">
                <video
                  src={project.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={project.videoUrl.replace(/\.(mp4|webm|mov)$/, '-thumb.jpg')}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {!project.videoUrl && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                <p className="text-white/50 text-center px-4">
                  {t('noVideoAvailable') || 'No video preview available for this project'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
