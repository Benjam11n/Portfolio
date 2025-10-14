'use client';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import ViewToggle from '../explore/ViewToggle';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const [showToggles] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionName = entry.target.id;

          if (entry.isIntersecting) {
            const matchingItem = items.find((item) => item.href.replace('#', '') === sectionName);
            if (matchingItem) {
              setActiveTab(matchingItem.name);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-10% 0px -10% 0px',
      },
    );

    items.forEach((item) => {
      const sectionId = item.href.replace('#', '');
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (href: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="pointer-events-auto fixed top-4 right-4 z-50 flex items-center gap-3">
          {/* View Toggle */}
          <div className="border-border bg-background/10 rounded-full border p-2 backdrop-blur-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/explore')}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === '/explore' ? 'text-primary' : 'text-foreground/60',
                )}
              >
                Explore
              </button>
              <button
                onClick={() => router.push(pathname === '/explore' ? '/list' : '/explore')}
                className="bg-muted relative h-4 w-8 rounded-full"
              >
                <motion.div
                  className="bg-primary absolute top-0.5 left-0.5 size-3 rounded-full"
                  animate={{ x: pathname === '/explore' ? 0 : 16 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <button
                onClick={() => router.push('/list')}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === '/list' ? 'text-primary' : 'text-foreground/60',
                )}
              >
                List
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Navigation */}
      <div
        className={cn(
          'pointer-events-none fixed left-1/2 z-40 mb-6 -translate-x-1/2 sm:pt-6 md:top-0',
          isMobile ? 'bottom-0' : '',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Navigation Items */}
          <div className="border-border bg-background/5 flex items-center gap-3 rounded-full border p-1 shadow-lg backdrop-blur-lg">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    handleClick(item.href);
                  }}
                  className={cn(
                    'pointer-events-auto relative cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors',
                    'text-foreground/80 hover:text-primary',
                    isActive && 'bg-muted text-primary',
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="bg-primary/5 absolute inset-0 -z-10 w-full rounded-full"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="bg-primary absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full">
                        <div className="bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md" />
                        <div className="bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md" />
                        <div className="bg-primary/20 absolute top-0 left-2 size-4 rounded-full blur-sm" />
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toggles Container */}
          <motion.div
            className={cn(
              'pointer-events-auto flex gap-4',
              isMobile && 'fixed top-16 right-4',
              isMobile && !showToggles && 'pointer-events-none opacity-0',
            )}
            animate={{
              opacity: isMobile ? (showToggles ? 1 : 0) : 1,
              y: isMobile ? (showToggles ? 0 : -20) : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* View Toggle */}
            <div className="flex gap-4">
              <div className="border-border bg-background/5 flex items-center gap-3 rounded-full border p-1 shadow-lg backdrop-blur-lg">
                <ViewToggle />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
