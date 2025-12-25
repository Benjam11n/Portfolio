'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SectionCardProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export const SectionCard = forwardRef<HTMLElement, SectionCardProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    "bg-muted rounded-3xl border border-border/40",
                    className
                )}
                {...props}
            >
                {children}
            </section>
        );
    }
);

SectionCard.displayName = 'SectionCard';
