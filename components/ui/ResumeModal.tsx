'use client';

import { useState } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { useTranslations } from 'next-intl';

interface ResumeModalProps {
  resumeUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ resumeUrl, isOpen, onClose }: ResumeModalProps) {
  const t = useTranslations('common');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('resumePreview')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('open')}
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="w-full h-[calc(100%-5rem)] bg-gray-100 dark:bg-gray-800">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            className="w-full h-full"
            title="Resume Preview"
          />
        </div>
      </div>
    </div>
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
