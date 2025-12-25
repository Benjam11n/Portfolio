'use client';

import { certifications } from '@/constants';
import { SectionCard } from '@/components/section-card';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const Certifications = () => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo('.cert-card', 
            { y: 50, opacity: 0 },
            {
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom-=100',
                }
            }
        )
    }, { scope: containerRef });

    return (
        <SectionCard id="certifications" ref={containerRef} title="Certifications" className="p-8 sm:p-12 scroll-mt-24">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert) => (
                    <div key={cert.name} className="cert-card group relative p-6 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-all">
                        <div className="aspect-video w-full bg-secondary rounded-lg mb-4 overflow-hidden relative">
                             {/* Placeholder for actual certificate image if available, using project images as placeholders from constants for now as per data */}
                             <img src={cert.image} alt={cert.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{cert.organization}</p>
                        <p className="text-xs text-muted-foreground/80 line-clamp-3">
                            {cert.description}
                        </p>
                        <span className="absolute top-6 right-6 text-xs font-mono bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">
                            {cert.date}
                        </span>
                    </div>
                ))}
            </div>
        </SectionCard>
    )
}
