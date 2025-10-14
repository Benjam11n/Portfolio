'use client';

import Image from 'next/image';
import React from 'react';

import { Timeline } from '@/components/ui/timeline';
import { workExperiences } from '@/constants';

export function ExperienceTimeline() {
  const data = workExperiences.map((experience) => ({
    title: experience.name,
    subtitle: experience.duration,
    content: (
      <div>
        <p className="mb-8 text-xs font-normal md:text-sm">
          {experience.pos}
        </p>
        <div className="space-y-4">
          {experience.title.split('. ').map((point, index) => (
            <p key={index} className="text-xs md:text-lg">
              • {point.trim()}
            </p>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
            alt="Team collaboration"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
          />
          <Image
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
            alt="Code review"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen w-full bg-background">
      <Timeline data={data} />
    </div>
  );
}
