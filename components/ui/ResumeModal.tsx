'use client';

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ResumeModalProps {
  resumeUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ resumeUrl, isOpen, onClose }: ResumeModalProps) {
  const t = useTranslations('common');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-[1600px] h-auto max-h-[95vh] overflow-hidden bg-black/95 backdrop-blur-xl border-2 border-cyan-500/30 p-6 lg:p-8 rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pr-8">
            <DialogTitle className="text-2xl md:text-3xl text-white">
              {t('resumePreview')}
            </DialogTitle>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white flex-shrink-0"
            >
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('open')}
              </a>
            </Button>
          </div>

          {/* PDF Viewer */}
          <div className="relative w-full rounded-lg overflow-hidden bg-black border border-white/10">
            <iframe
              src={`${resumeUrl}#toolbar=0`}
              className="w-full h-[60vh] md:h-[70vh] lg:h-[75vh]"
              title="Resume Preview"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ResumeButtonProps {
  resumeUrl: string | null;
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ResumeButton({ resumeUrl, children, className, size = 'lg' }: ResumeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!resumeUrl) return null;

  return (
    <>
      <Button
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children}
      </Button>

      <ResumeModal
        resumeUrl={resumeUrl}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
