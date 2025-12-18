'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ExperienceCardProps {
  experience: {
    position: string;
    company: string;
    location: string | null;
    type: string | null;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    achievements: string[] | null;
    logoUrl: string | null;
  };
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('experience');

  const achievements = experience.achievements || [];
  const displayedAchievements = isExpanded ? achievements : [];
  const hasMore = achievements.length > 0;

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          {experience.logoUrl && (
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                <Image
                  src={experience.logoUrl}
                  alt={experience.company}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <CardTitle className="text-base md:text-lg text-white mb-1">
                  {experience.position}
                </CardTitle>
                <p className="text-base md:text-lg text-white/70 font-medium">
                  {experience.company}
                </p>
              </div>

              {/* Employment Type Badge */}
              {experience.type && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm w-fit">
                  <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">
                    {experience.type}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-base md:text-lg text-white/60">
              {experience.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{experience.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {experience.startDate} - {experience.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {achievements.length > 0 && (
          <div>
            {/* Show achievements only when expanded */}
            {displayedAchievements.length > 0 && (
              <ul className="space-y-2 mb-3">
                {displayedAchievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-cyan-400 mt-1.5 flex-shrink-0">•</span>
                    <span className="text-justify">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Show More/Less Button */}
            {hasMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <span>{t('showLess') || 'Show less'}</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>{t('showMore') || 'Show more'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
