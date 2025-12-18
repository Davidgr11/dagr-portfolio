'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceProps {
  locale: string;
}

interface Experience {
  id: string;
  position_en: string;
  position_es: string | null;
  company_en: string;
  company_es: string | null;
  location_en: string | null;
  location_es: string | null;
  employment_type_en: string | null;
  employment_type_es: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  achievements_en: string[] | null;
  achievements_es: string[] | null;
  logo_url: string | null;
}

export function Experience({ locale }: ExperienceProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const t = useTranslations('sections');
  const tExp = useTranslations('experience');

  useEffect(() => {
    async function fetchExperiences() {
      const supabase = createClient();
      const { data } = await supabase
        .from('experience')
        .select('*')
        .eq('is_visible', true)
        .order('order', { ascending: true });

      if (data) {
        setExperiences(data as Experience[]);
      }
      setLoading(false);
    }

    fetchExperiences();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper || experiences.length === 0) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Each card gets 70vh of scroll
      const scrollPerCard = viewportHeight * 0.7;

      // Calculate how far into the wrapper we've scrolled
      // When wrapper.top is 0, we're just entering
      // When wrapper.top is negative, we're scrolling through it
      const scrollProgress = Math.max(0, -rect.top);

      // Calculate current card index based on scroll progress
      const cardIndex = Math.floor(scrollProgress / scrollPerCard);
      const clampedIndex = Math.min(Math.max(0, cardIndex), experiences.length - 1);

      setCurrentIndex(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [experiences]);

  if (loading) {
    return null;
  }

  if (experiences.length === 0) {
    return null;
  }

  const positionField = locale === 'es' ? 'position_es' : 'position_en';
  const companyField = locale === 'es' ? 'company_es' : 'company_en';
  const locationField = locale === 'es' ? 'location_es' : 'location_en';
  const typeField = locale === 'es' ? 'employment_type_es' : 'employment_type_en';
  const achievementsField = locale === 'es' ? 'achievements_es' : 'achievements_en';

  const formatDate = (dateStr: string | null, isCurrent: boolean) => {
    if (isCurrent || !dateStr) {
      return tExp('present');
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Calculate the height: 70vh per card + extra 100vh at the end to keep it stuck
  const scrollHeight = (experiences.length * 70) + 100;

  return (
    <section id="experience" ref={sectionRef} className="py-20">
      {/* Wrapper that creates scroll space */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `${scrollHeight}vh` }}
      >
        {/* Sticky container - title + cards stick together */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
          {/* Title and subtitle */}
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center text-white">
              {t('experience')}
            </h2>
            <p className="text-center text-white/70 max-w-2xl mx-auto">
              {tExp('subtitle')}
            </p>
          </div>

          {/* Cards container */}
          <div className="container mx-auto px-4 max-w-4xl w-full">
            <div className="relative overflow-hidden">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/40 via-cyan-500/60 to-cyan-500/40 -translate-y-1/2 pointer-events-none" />

              {/* Cards track - moves horizontally */}
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className={`w-6 h-6 rounded-full border-4 border-gray-950 transition-all duration-500 ${
                          exp.is_current
                            ? 'bg-cyan-400 shadow-lg shadow-cyan-500/50 scale-110'
                            : 'bg-cyan-600/70'
                        }`}>
                          {exp.is_current && (
                            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                          )}
                        </div>
                      </div>

                      <div className="mt-8">
                        <ExperienceCard
                          experience={{
                            position: exp[positionField] || exp.position_en,
                            company: exp[companyField] || exp.company_en,
                            location: exp[locationField] || exp.location_en,
                            type: exp[typeField] || exp.employment_type_en,
                            startDate: formatDate(exp.start_date, false),
                            endDate: formatDate(exp.end_date, exp.is_current),
                            isCurrent: exp.is_current,
                            achievements: exp[achievementsField] || [],
                            logoUrl: exp.logo_url,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {experiences.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentIndex
                        ? 'w-8 bg-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
