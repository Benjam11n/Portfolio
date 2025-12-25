'use client';

import { PROJECTS } from '@/constants';
import { SectionCard } from '@/components/section-card';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef<HTMLElement>(null);
  const projects = Object.values(PROJECTS);

  useGSAP(
    () => {
      gsap.fromTo(
        '.project-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom-=100',
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="projects" ref={containerRef} title="Projects" className="p-8 sm:p-12 scroll-mt-24">

      <div className="grid grid-cols-1 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Visual Part (placeholder for video/image) */}
            <div className="aspect-video w-full bg-secondary relative overflow-hidden">
                {project.texture ? (
                   <video 
                     src={project.texture}
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                   />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Preview
                    </div>
                )}
                
                <div className="absolute top-4 left-4">
                     <div className="bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border/50" style={project.logoStyle}>
                        <img src={project.logo} alt="logo" className="w-8 h-8 object-contain" />
                     </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                        {project.description}
                    </p>
                </div>
                {(project.href || project.github) && (
                    <div className="flex gap-2">
                         {project.href && (
                             <Link href={project.href} target="_blank" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                                 <ArrowUpRight className="w-5 h-5" />
                             </Link>
                         )}
                    </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {project.techStack.map((tech) => (
                    <span key={tech.name} className="px-3 py-1 bg-secondary text-xs font-medium rounded-full text-secondary-foreground border border-border">
                        {tech.name}
                    </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
