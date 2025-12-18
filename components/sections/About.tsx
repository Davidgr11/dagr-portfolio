import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/animations/FadeIn';
import { getTranslations } from 'next-intl/server';

interface AboutProps {
  locale: string;
}

export async function About({ locale }: AboutProps) {
  const supabase = await createClient();
  const t = await getTranslations('sections');
  const tAbout = await getTranslations('about');

  // Fetch about data
  const { data: aboutData } = await supabase
    .from('about')
    .select('*')
    .single();

  if (!aboutData) {
    return null;
  }

  const about = aboutData as {
    bio_en: string;
    bio_es: string | null;
    years_experience: number | null;
    projects_completed: number | null;
    clients_served: number | null;
  };

  const bioField = locale === 'es' && about.bio_es ? 'bio_es' : 'bio_en';

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">
            {t('about')}
          </h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {about[bioField]}
          </p>
        </FadeIn>

        {/* Stats */}
        {(about.years_experience || about.projects_completed || about.clients_served) && (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.years_experience && (
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {about.years_experience}+
                    </div>
                    <div className="text-white/70">
                      {tAbout('yearsExperience')}
                    </div>
                  </CardContent>
                </Card>
              )}
              {about.projects_completed && (
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {about.projects_completed}+
                    </div>
                    <div className="text-white/70">
                      {tAbout('projectsCompleted')}
                    </div>
                  </CardContent>
                </Card>
              )}
              {about.clients_served && (
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {about.clients_served}+
                    </div>
                    <div className="text-white/70">
                      {tAbout('clientsServed')}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
