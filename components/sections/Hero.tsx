'use client';

import { useTranslations } from 'next-intl';
import { Mail, Linkedin, Github, Download } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { ResumeButton } from '@/components/ui/ResumeModal';
import Image from 'next/image';
import Link from 'next/link';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  badge_text: string;
  profile_image_url: string | null;
  resume_url: string | null;
  email: string;
  linkedin_url: string | null;
  github_url: string | null;
  location: string | null;
}

interface HeroProps {
  data: HeroData;
}

export function Hero({ data }: HeroProps) {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-lg shadow-cyan-500/50"></span>
                </span>
                <span className="text-sm font-medium text-white">{data.badge_text}</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Title with gradient */}
              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                    {data.title}
                  </span>
                </h1>
              </FadeIn>

              {/* Subtitle */}
              <FadeIn delay={0.3}>
                <p className="text-xl md:text-2xl font-semibold text-white/90">
                  {data.subtitle}
                </p>
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.4}>
                <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {data.description}
                </p>
              </FadeIn>

              {/* Location */}
              {data.location && (
                <FadeIn delay={0.5}>
                  <p className="text-sm text-white/60 flex items-center gap-2 justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    {data.location}
                  </p>
                </FadeIn>
              )}

              {/* CTA Buttons */}
              <FadeIn delay={0.6}>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <ResumeButton
                    resumeUrl={data.resume_url}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl shadow-blue-500/50 group border-0"
                  >
                    <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    {t('viewResume')}
                  </ResumeButton>
                </div>
              </FadeIn>

              {/* Social Links */}
              <FadeIn delay={0.7}>
                <div className="flex gap-4 justify-center lg:justify-start">
                  {data.email && (
                    <a
                      href={`mailto:${data.email}`}
                      className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30 group"
                      aria-label="Email"
                    >
                      <Mail className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {data.linkedin_url && (
                    <a
                      href={data.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30 group"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {data.github_url && (
                    <a
                      href={data.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30 group"
                      aria-label="GitHub"
                    >
                      <Github className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Right side - Profile image */}
            {data.profile_image_url && (
              <FadeIn delay={0.3} className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-40 animate-pulse" />

                  {/* Image container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-50" />
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                      <Image
                        src={data.profile_image_url}
                        alt={data.title}
                        fill
                        className="rounded-full border-4 border-white/20 shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
