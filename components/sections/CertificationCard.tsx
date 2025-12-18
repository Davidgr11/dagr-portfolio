'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import { CertificationPreviewModal } from './CertificationPreviewModal';

interface CertificationCardProps {
  certification: {
    name: string;
    issuer: string;
    description: string | null;
    issueDate: string;
    logoUrl: string | null;
    certificateFileUrl: string | null;
    certificateUrl: string | null;
  };
  locale: string;
}

export function CertificationCard({ certification, locale }: CertificationCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 group">
        <CardHeader className="pb-3">
          {/* Logo in circular frame */}
          {certification.logoUrl && (
            <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20 bg-white/5">
              <Image
                src={certification.logoUrl}
                alt={certification.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <CardTitle className="text-lg text-white text-center group-hover:text-cyan-400 transition-colors line-clamp-2">
            {certification.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Issuer */}
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Award className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <span className="text-base font-medium text-center">
              {certification.issuer}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-center gap-2 text-base text-white/60">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{certification.issueDate}</span>
          </div>

          {/* Preview Button */}
          {certification.certificateFileUrl && (
            <Button
              onClick={() => setIsPreviewOpen(true)}
              size="default"
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Eye className="mr-2 h-4 w-4" />
              {locale === 'es' ? 'Ver Certificado' : 'Preview Certificate'}
            </Button>
          )}
        </CardContent>
      </Card>

      <CertificationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        certification={{
          name: certification.name,
          issuer: certification.issuer,
          description: certification.description,
          issueDate: certification.issueDate,
          certificateFileUrl: certification.certificateFileUrl,
          certificateUrl: certification.certificateUrl,
        }}
        locale={locale}
      />
    </>
  );
}
