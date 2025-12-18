'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Trophy, Calendar, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface AwardsProps {
  locale: string;
}

interface Award {
  id: string;
  title_en: string;
  title_es: string | null;
  issuer_en: string;
  issuer_es: string | null;
  date: string;
  description_en: string | null;
  description_es: string | null;
  certificate_url: string | null;
  icon_url: string | null;
}

export function Awards({ locale }: AwardsProps) {
  const t = useTranslations('sections');
  const tAwards = useTranslations('awards');
  const [awards, setAwards] = useState<Award[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAwards() {
      const supabase = createClient();
      const { data } = await supabase
        .from('awards')
        .select('*')
        .eq('is_visible', true)
        .order('order', { ascending: true });

      if (data) {
        setAwards(data as Award[]);
      }
      setLoading(false);
    }

    fetchAwards();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? awards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === awards.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return null;
  }

  if (awards.length === 0) {
    return null;
  }

  const titleField = locale === 'es' ? 'title_es' : 'title_en';
  const issuerField = locale === 'es' ? 'issuer_es' : 'issuer_en';
  const descriptionField = locale === 'es' ? 'description_es' : 'description_en';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const currentAward = awards[currentIndex];

  return (
    <section id="awards" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">
            {t('awards')}
          </h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {tAwards('subtitle')}
          </p>
        </FadeIn>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {awards.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="absolute -left-5 md:-left-16 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute -right-5 md:-right-16 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 shadow-lg"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </>
          )}

          {/* Award Card */}
          <div className="px-8 md:px-12">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 shadow-2xl">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {currentAward.icon_url ? (
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/20 bg-white/5">
                        <Image
                          src={currentAward.icon_url}
                          alt={currentAward[titleField] || currentAward.title_en}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                        <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Title and Issuer */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl md:text-2xl text-white mb-2">
                      {currentAward[titleField] || currentAward.title_en}
                    </CardTitle>
                    <CardDescription className="text-white/70 font-medium text-base">
                      {currentAward[issuerField] || currentAward.issuer_en}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3 text-sm text-white/60">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(currentAward.date)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {(currentAward[descriptionField] || currentAward.certificate_url) && (
                <CardContent className="space-y-4">
                  {/* Description */}
                  {currentAward[descriptionField] && (
                    <p className="text-white/70 text-sm md:text-base leading-relaxed text-justify">
                      {currentAward[descriptionField]}
                    </p>
                  )}

                  {/* View Certificate Button */}
                  {currentAward.certificate_url && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full md:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <a
                        href={currentAward.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {locale === 'es' ? 'Ver Certificado' : 'View Certificate'}
                      </a>
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Dots Indicator */}
          {awards.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {awards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-cyan-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to award ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
