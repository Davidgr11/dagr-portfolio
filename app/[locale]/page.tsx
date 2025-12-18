import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Certifications } from '@/components/sections/Certifications';
import { Skills } from '@/components/sections/Skills';
import { Awards } from '@/components/sections/Awards';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch profile data
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .single();

  // Map bilingual fields based on locale
  const profile = profileData ? {
    title: (locale === 'es' && (profileData as Record<string, unknown>).title_es) ? (profileData as Record<string, unknown>).title_es as string : (profileData as Record<string, unknown>).title_en as string,
    subtitle: (locale === 'es' && (profileData as Record<string, unknown>).subtitle_es) ? (profileData as Record<string, unknown>).subtitle_es as string : (profileData as Record<string, unknown>).subtitle_en as string,
    description: (locale === 'es' && (profileData as Record<string, unknown>).description_es) ? (profileData as Record<string, unknown>).description_es as string : (profileData as Record<string, unknown>).description_en as string,
    badge_text: (locale === 'es' && (profileData as Record<string, unknown>).badge_text_es) ? (profileData as Record<string, unknown>).badge_text_es as string : (profileData as Record<string, unknown>).badge_text_en as string,
    location: (locale === 'es' && (profileData as Record<string, unknown>).location_es) ? (profileData as Record<string, unknown>).location_es as string : (profileData as Record<string, unknown>).location_en as string,
    profile_image_url: (profileData as Record<string, unknown>).profile_image_url as string | null,
    resume_url: (profileData as Record<string, unknown>).resume_url as string | null,
    email: (profileData as Record<string, unknown>).email as string,
    linkedin_url: (profileData as Record<string, unknown>).linkedin_url as string | null,
    github_url: (profileData as Record<string, unknown>).github_url as string | null,
  } : null;

  // If no profile exists yet, show setup instructions
  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Portfolio!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your portfolio is ready, but you need to add your data first.
          </p>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Quick Setup:</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-semibold">Go to Supabase Table Editor</p>
                  <p className="text-sm text-muted-foreground">
                    Open your Supabase project → Table Editor → <code className="bg-secondary px-2 py-1 rounded">profiles</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-semibold">Click "Insert row"</p>
                  <p className="text-sm text-muted-foreground">
                    Add a new row with your information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-semibold">Fill in your data:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• <strong>title:</strong> "Your Name" or "Software Developer"</li>
                    <li>• <strong>subtitle:</strong> "Full Stack Developer"</li>
                    <li>• <strong>description:</strong> Your bio</li>
                    <li>• <strong>email:</strong> your@email.com</li>
                    <li>• <strong>location:</strong> "Your City"</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <p className="font-semibold">Refresh this page!</p>
                  <p className="text-sm text-muted-foreground">
                    You'll see your portfolio come to life
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> Or use the Admin Panel at{' '}
              <a href="/admin/login" className="underline font-semibold hover:text-blue-600">
                /admin/login
              </a>{' '}
              to manage your content (you'll need to sign up first)
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Return default data if needed (shouldn't reach here anymore)
  if (!profile) {
    const defaultProfile = {
      title: locale === 'es' ? 'Desarrollador de Software' : 'Software Developer',
      subtitle: locale === 'es' ? 'Ingeniero Full Stack' : 'Full Stack Engineer',
      description: locale === 'es'
        ? 'Construyendo aplicaciones web modernas con tecnologías de vanguardia'
        : 'Building modern web applications with cutting-edge technologies',
      badge_text: locale === 'es' ? 'Disponible para Contratar' : 'Available for Hire',
      profile_image_url: null,
      resume_url: null,
      email: 'your@email.com',
      linkedin_url: null,
      github_url: null,
      location: locale === 'es' ? 'CDMX, México' : 'CDMX, Mexico',
    };

    return (
      <main>
        <Hero data={defaultProfile} />

        {/* About Section - To be implemented */}
        <section id="about" className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <p className="text-muted-foreground">
              This section will display your about content from Supabase.
              Implement this by creating an About component similar to the Hero component.
            </p>
          </div>
        </section>

        {/* Experience Section - To be implemented */}
        <section id="experience" className="min-h-screen bg-secondary/20 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Experience</h2>
            <p className="text-muted-foreground">
              This section will display your experience timeline from Supabase.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <Projects locale={locale} />

        {/* Certifications Section - To be implemented */}
        <section id="certifications" className="min-h-screen bg-secondary/20 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Certifications</h2>
            <p className="text-muted-foreground">
              This section will display your certifications from Supabase.
            </p>
          </div>
        </section>

        {/* Skills Section - To be implemented */}
        <section id="skills" className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Skills & Tech Stack</h2>
            <p className="text-muted-foreground">
              This section will display your skills organized by categories from Supabase.
            </p>
          </div>
        </section>

        {/* Awards Section - To be implemented */}
        <section id="awards" className="min-h-screen bg-secondary/20 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Awards & Recognition</h2>
            <p className="text-muted-foreground">
              This section will display your awards from Supabase.
            </p>
          </div>
        </section>

        {/* Contact Section - To be implemented */}
        <section id="contact" className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
            <p className="text-muted-foreground">
              This section will have a contact form that sends emails via Resend.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Particles Background - visible en toda la página */}
      <ParticlesBackground />

      {/* Contenido con z-index superior */}
      <div className="relative z-10">
        <Hero data={profile} />
        <Education locale={locale} />
        <Experience locale={locale} />
        <Projects locale={locale} />
        <Certifications locale={locale} />
        <Skills locale={locale} />
        <Awards locale={locale} />
        <Contact locale={locale} />
        <Footer locale={locale} />
      </div>
    </main>
  );
}
