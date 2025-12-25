'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SectionCardProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    title?: string;
}

export const SectionCard = forwardRef<HTMLElement, SectionCardProps>(
    ({ children, title, className, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    "bg-muted rounded-3xl border border-border/40",
                    className
                )}
                {...props}
            >
                {title && (
                    <div className="mb-12">
                        <h2 className="text-md font-bold tracking-widest uppercase text-foreground font-mono">
                            {title}
                        </h2>
                    </div>
                )}
                {children}
            </section>
        );
    }
);

SectionCard.displayName = 'SectionCard';
