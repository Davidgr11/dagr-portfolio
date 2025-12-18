import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { FadeIn } from '@/components/animations/FadeIn';
import { getTranslations } from 'next-intl/server';
import { SkillsCarousel } from './SkillsCarousel';

interface SkillsProps {
  locale: string;
}

export async function Skills({ locale }: SkillsProps) {
  const supabase = await createClient();
  const t = await getTranslations('sections');
  const tSkills = await getTranslations('skills');

  // Fetch visible categories
  const { data: categoriesData } = await supabase
    .from('skills_categories')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });

  const categories = (categoriesData || []) as Array<{
    id: string;
    name_en: string;
    name_es: string | null;
    order: number;
    is_visible: boolean;
  }>;

  if (categories.length === 0) {
    return null;
  }

  // Fetch all visible skills
  const { data: skillsData } = await supabase
    .from('skills')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });

  const skills = (skillsData || []) as Array<{
    id: string;
    category_id: string;
    name: string;
    logo_url: string | null;
    order: number;
    is_visible: boolean;
  }>;

  const nameField = locale === 'es' ? 'name_es' : 'name_en';

  // Group skills by category
  const categoriesWithSkills = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category_id === category.id)
  })).filter(category => category.skills.length > 0);

  if (categoriesWithSkills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4 text-center text-white">
            {t('skills')}
          </h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {tSkills('subtitle')}
          </p>
        </FadeIn>

        {/* Skills by Category with Carousels */}
        <Stagger className="space-y-10">
          {categoriesWithSkills.map((category) => (
            <StaggerItem key={category.id}>
              <div className="space-y-6">
                {/* Category Title */}
                <h3 className="text-2xl font-bold text-white text-center">
                  {category[nameField] || category.name_en}
                </h3>

                {/* Skills Carousel */}
                <SkillsCarousel
                  skills={category.skills.map(skill => ({
                    id: skill.id,
                    name: skill.name,
                    logo_url: skill.logo_url,
                  }))}
                  speed={30}
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
