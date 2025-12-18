'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Skill {
  id: string;
  name: string;
  logo_url: string | null;
}

interface SkillsCarouselProps {
  skills: Skill[];
  speed?: number; // pixels per second
}

export function SkillsCarousel({ skills, speed = 30 }: SkillsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationFrameId: number;
    let lastTimestamp: number;
    let scrollPosition = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Calculate scroll distance based on speed and time elapsed
      scrollPosition += (speed * delta) / 1000;

      // Reset scroll position when we've scrolled past the first set of items
      const scrollWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed, isPaused]);

  // Duplicate skills for infinite scroll effect
  const duplicatedSkills = [...skills, ...skills];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedSkills.map((skill, index) => (
          <TooltipProvider key={`${skill.id}-${index}`} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden group">
                  {skill.logo_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={skill.logo_url}
                        alt={skill.name}
                        fill
                        className="object-cover filter group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-center text-white/70 flex items-center justify-center h-full">
                      {skill.name}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/90 border-cyan-400/50 text-white"
              >
                <p className="font-medium">{skill.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none" />
    </div>
  );
}
