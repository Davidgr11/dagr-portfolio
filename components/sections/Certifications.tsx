import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Award, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CertificationCard } from './CertificationCard';
import Link from 'next/link';

interface CertificationsProps {
  locale: string;
}

export async function Certifications({ locale }: CertificationsProps) {
  const supabase = await createClient();
  const t = await getTranslations('sections');
  const tCert = await getTranslations('certifications');

  const { data } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('order', { ascending: true });

  const certifications = (data || []) as Array<{
    id: string;
    name_en: string;
    name_es: string | null;
    description_en: string | null;
    description_es: string | null;
    issuer_en: string;
    issuer_es: string | null;
    issue_date: string;
    certificate_url: string | null;
    certificate_file_url: string | null;
    logo_url: string | null;
    is_verified: boolean;
  }>;

  if (certifications.length === 0) {
    return null;
  }

  const nameField = locale === 'es' ? 'name_es' : 'name_en';
  const issuerField = locale === 'es' ? 'issuer_es' : 'issuer_en';
  const descriptionField = locale === 'es' ? 'description_es' : 'description_en';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">
            {t('certifications')}
          </h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {tCert('subtitle')}
          </p>
        </FadeIn>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 custom-horizontal-scrollbar">
          <div className="flex gap-6" style={{ width: 'max-content' }}>
            {certifications.map((cert) => (
              <div key={cert.id} className="w-[85vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0">
                <CertificationCard
                  certification={{
                    name: cert[nameField] || cert.name_en,
                    issuer: cert[issuerField] || cert.issuer_en,
                    description: cert[descriptionField] || cert.description_en,
                    issueDate: formatDate(cert.issue_date),
                    logoUrl: cert.logo_url,
                    certificateFileUrl: cert.certificate_file_url,
                    certificateUrl: cert.certificate_url,
                  }}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all group"
          >
            <Link href={`/${locale}/certifications`}>
              {locale === 'es' ? 'Ver Todas las Certificaciones' : 'View All Certifications'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
