'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X, Award, Calendar } from 'lucide-react';
import Image from 'next/image';

interface CertificationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification: {
    name: string;
    issuer: string;
    description: string | null;
    issueDate: string;
    certificateFileUrl: string | null;
    certificateUrl: string | null;
  };
  locale: string;
}

export function CertificationPreviewModal({ isOpen, onClose, certification, locale }: CertificationPreviewModalProps) {
  const isPDF = certification.certificateFileUrl?.toLowerCase().endsWith('.pdf');

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
                {certification.name}
              </DialogTitle>

              {/* Issuer */}
              <div className="flex items-center gap-2 text-white/70 mb-4">
                <Award className="h-5 w-5 text-cyan-400" />
                <span className="text-lg font-medium">{certification.issuer}</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-white/60 mb-6">
                <Calendar className="h-5 w-5" />
                <span>{certification.issueDate}</span>
              </div>

              {/* Description */}
              {certification.description && (
                <DialogDescription className="text-white/70 text-base leading-relaxed text-justify mb-6">
                  {certification.description}
                </DialogDescription>
              )}
            </div>

            {/* Action Button */}
            {certification.certificateUrl && (
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  <a
                    href={certification.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {locale === 'es' ? 'Mostrar Credencial' : 'Show Credential'}
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Right column: Certificate File - 5 columns */}
          <div className="lg:col-span-5 flex items-center">
            {certification.certificateFileUrl && (
              <div className="relative w-full rounded-lg overflow-hidden bg-black border border-white/10">
                {isPDF ? (
                  <iframe
                    src={certification.certificateFileUrl}
                    className="w-full h-[50vh] md:h-[60vh] lg:h-[600px]"
                    title={certification.name}
                  />
                ) : (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={certification.certificateFileUrl}
                      alt={certification.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {!certification.certificateFileUrl && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                <p className="text-white/50 text-center px-4">
                  {locale === 'es'
                    ? 'No hay archivo de certificado disponible'
                    : 'No certificate file available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
