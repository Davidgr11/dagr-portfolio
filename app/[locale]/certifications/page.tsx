import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { CertificationCard } from '@/components/sections/CertificationCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CertificationsPageProps {
  params: {
    locale: string;
  };
}

export default async function CertificationsPage({ params: { locale } }: CertificationsPageProps) {
  const supabase = await createClient();
  const tCert = await getTranslations('certifications');

  const { data } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_visible', true)
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
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <FadeIn>
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
        </FadeIn>

        {/* Page Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">
              {locale === 'es' ? 'Todas las Certificaciones' : 'All Certifications'}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {tCert('subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Certifications Grid */}
        {certifications.length > 0 ? (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <StaggerItem key={cert.id}>
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
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-white/70 text-lg">
                {locale === 'es'
                  ? 'No hay certificaciones disponibles en este momento.'
                  : 'No certifications available at this time.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
