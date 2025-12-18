'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Book, CheckCircle, AlertCircle, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EducationCard } from './EducationCard';

interface EducationProps {
  locale: string;
}

interface EducationData {
  id: string;
  degree_en: string;
  degree_es: string | null;
  institution_en: string;
  institution_es: string | null;
  level_en: string;
  level_es: string | null;
  start_date: string;
  end_date: string | null;
  gpa: string | null;
  show_gpa: boolean;
  subjects_en: string[] | null;
  subjects_es: string[] | null;
  logo_url: string | null;
  order: number;
  status: 'studying' | 'graduated' | 'incomplete' | 'in-progress';
}

export function Education({ locale }: EducationProps) {
  const [education, setEducation] = useState<EducationData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const t = useTranslations('sections');
  const tEdu = useTranslations('education');

  useEffect(() => {
    async function fetchEducation() {
      const supabase = createClient();
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .order('order', { ascending: true });

      if (educationData) {
        setEducation(educationData as EducationData[]);
      }
      setLoading(false);
    }

    fetchEducation();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? education.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === education.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return null;
  }

  if (education.length === 0) {
    return null;
  }

  const degreeField = locale === 'es' ? 'degree_es' : 'degree_en';
  const institutionField = locale === 'es' ? 'institution_es' : 'institution_en';
  const subjectsField = locale === 'es' ? 'subjects_es' : 'subjects_en';
  const levelField = locale === 'es' ? 'level_es' : 'level_en';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return tEdu('present');
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusConfig = (status: 'studying' | 'graduated' | 'incomplete' | 'in-progress') => {
    const configs = {
      'studying': {
        label: tEdu('status.studying'),
        icon: Book,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: true
      },
      'in-progress': {
        label: tEdu('status.inProgress'),
        icon: GraduationCap,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: true
      },
      'graduated': {
        label: tEdu('status.graduated'),
        icon: CheckCircle,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: false
      },
      'incomplete': {
        label: tEdu('status.incomplete'),
        icon: AlertCircle,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/50',
        animate: false
      }
    };
    return configs[status];
  };

  const currentEdu = education[currentIndex];

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            {t('education')}
          </h2>
        </FadeIn>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {education.length > 1 && (
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

          {/* Education Card */}
          <div className="px-8 md:px-12">
            <EducationCard
              education={{
                degree: currentEdu[degreeField] || currentEdu.degree_en,
                institution: currentEdu[institutionField] || currentEdu.institution_en,
                level: currentEdu[levelField] || currentEdu.level_en,
                status: currentEdu.status,
                statusLabel: getStatusConfig(currentEdu.status).label,
                startDate: formatDate(currentEdu.start_date),
                endDate: formatDate(currentEdu.end_date),
                gpa: currentEdu.gpa,
                showGpa: currentEdu.show_gpa,
                subjects: currentEdu[subjectsField] || [],
                logoUrl: currentEdu.logo_url,
              }}
            />
          </div>

          {/* Dots Indicator */}
          {education.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {education.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-cyan-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to education ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
