'use client';

import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';

export function ExperienceTimeline() {
  const data = [
    {
      title: 'Senior Software Engineer at Tech Innovators Inc.',
      subtitle: 'May 2024 - August 2024',
      content: (
        <div>
          <div className="space-y-4">
            <p className="text-xs md:text-lg">
              • Led development of cloud-native microservices architecture
            </p>
            <p className="text-xs md:text-lg">
              • Mentored junior developers and conducted technical interviews
            </p>
            <p className="text-xs md:text-lg">
              • Implemented CI/CD pipelines reducing deployment time by 60%
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
              alt="Team collaboration"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
              alt="Code review"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: '2022',
      subtitle: 'May 2024 - August 2024',
      content: (
        <div>
          <p className=" text-xs md:text-sm font-normal mb-8">
            Full Stack Developer at Digital Solutions Ltd.
          </p>
          <div className="space-y-4">
            <p className="text-xs md:text-sm">
              • Developed and maintained multiple client-facing web applications
            </p>
            <p className="text-xs md:text-sm">
              • Implemented responsive designs and improved mobile UX
            </p>
            <p className="text-xs md:text-sm">
              • Integrated third-party APIs and payment gateways
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Team meeting"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
              alt="Development"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: '2020',
      subtitle: 'May 2024 - August 2024',
      content: (
        <div>
          <p className=" text-xs md:text-sm font-normal mb-8">
            Junior Developer at StartUp Hub
          </p>
          <div className="space-y-4">
            <p className="text-xs md:text-sm">
              • Built and maintained React-based web applications
            </p>
            <p className="text-xs md:text-sm">
              • Collaborated with UI/UX designers to implement new features
            </p>
            <p className="text-xs md:text-sm">
              • Participated in daily stand-ups and sprint planning
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80"
              alt="Learning"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80"
              alt="Coding"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      <Timeline data={data} />
    </div>
  );
}
