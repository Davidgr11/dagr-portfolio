'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, Award, ChevronDown, ChevronUp, Book, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface EducationCardProps {
  education: {
    degree: string;
    institution: string;
    level: string;
    status: 'studying' | 'graduated' | 'incomplete' | 'in-progress';
    statusLabel: string;
    startDate: string;
    endDate: string;
    gpa: string | null;
    showGpa: boolean;
    subjects: string[] | null;
    logoUrl: string | null;
  };
}

export function EducationCard({ education }: EducationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('education');

  const subjects = education.subjects || [];
  const displayedSubjects = isExpanded ? subjects : [];
  const hasSubjects = subjects.length > 0;
  const hasGpa = education.showGpa && education.gpa;
  const hasExpandableContent = hasSubjects || hasGpa;

  // Get status configuration
  const getStatusConfig = (status: 'studying' | 'graduated' | 'incomplete' | 'in-progress') => {
    const configs = {
      'studying': {
        icon: Book,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: true
      },
      'in-progress': {
        icon: GraduationCap,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: true
      },
      'graduated': {
        icon: CheckCircle,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/60',
        animate: false
      },
      'incomplete': {
        icon: AlertCircle,
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
        textColor: 'text-white/50',
        animate: false
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(education.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Institution Logo or Icon */}
          {education.logoUrl ? (
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                <Image
                  src={education.logoUrl}
                  alt={education.institution}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
              <GraduationCap className="h-6 w-6 text-cyan-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-2">
              <CardTitle className="text-base md:text-lg text-white">
                {education.degree}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {/* Level Badge - Destacado */}
                {education.level && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm w-fit">
                    <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">
                      {education.level}
                    </span>
                  </div>
                )}
                {/* Status Badge - Only show for non-graduated */}
                {education.status && education.status !== 'graduated' && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm w-fit ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                    <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.textColor} ${statusConfig.animate ? 'animate-pulse' : ''}`} />
                    <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                      {education.statusLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base md:text-lg text-white/70 font-medium">
                {education.institution}
              </p>
              <div className="flex items-center gap-2 text-base md:text-lg text-white/60">
                <Calendar className="h-4 w-4" />
                <span>
                  {education.startDate} - {education.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      {hasExpandableContent && (
        <CardContent className="space-y-4">
          {/* GPA and Subjects - Show only when expanded */}
          {isExpanded && (
            <div className="space-y-3">
              {/* GPA */}
              {hasGpa && (
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">
                    {t('gpa')}: {education.gpa}
                  </span>
                </div>
              )}

              {/* Subjects */}
              {displayedSubjects.length > 0 && (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {displayedSubjects.map((subject, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-cyan-400 mt-1.5 flex-shrink-0">•</span>
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Show More/Less Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show more</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </CardContent>
      )}
    </Card>
  );
}
