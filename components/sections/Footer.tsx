'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Github, Linkedin, Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const [aboutText, setAboutText] = useState('');
  const [userName, setUserName] = useState('');
  const [socialLinks, setSocialLinks] = useState<{
    email?: string;
    linkedin_url?: string;
    github_url?: string;
  }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch about content
      const { data: aboutData } = await supabase
        .from('about')
        .select('*')
        .limit(1);

      // Fetch profile for social links and name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email, linkedin_url, github_url, title_en, title_es')
        .single();

      if (aboutData && aboutData.length > 0) {
        const text = locale === 'es' && aboutData[0].content_es
          ? aboutData[0].content_es
          : aboutData[0].content_en;
        setAboutText(text || '');
      }

      if (profileData) {
        const name = locale === 'es' && profileData.title_es
          ? profileData.title_es
          : profileData.title_en;
        setUserName(name || '');
        setSocialLinks({
          email: profileData.email,
          linkedin_url: profileData.linkedin_url,
          github_url: profileData.github_url,
        });
      }
    }

    fetchData();
  }, [locale]);

  return (
    <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === 'es' ? 'Sobre Mí' : 'About Me'}
            </h3>
            <p className={`text-white/70 text-base leading-relaxed text-justify ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {aboutText}
            </p>
            {aboutText && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                {isExpanded ? (
                  <>
                    {locale === 'es' ? 'Mostrar menos' : 'Show less'}
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {locale === 'es' ? 'Mostrar más' : 'Show more'}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === 'es' ? 'Conéctate' : 'Connect'}
            </h3>
            <div className="flex gap-4">
              {socialLinks?.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.linkedin_url && (
                <a
                  href={socialLinks.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.github_url && (
                <a
                  href={socialLinks.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-white/60 text-base">
            © {currentYear} {userName}
          </p>
        </div>
      </div>
    </footer>
  );
}
