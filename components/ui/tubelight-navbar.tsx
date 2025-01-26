'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { usePathname, useRouter } from 'next/navigation';
import ViewToggle from '../explore/ViewToggle';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  currentView?: boolean;
  setCurrentView?: (view: boolean) => void;
}

export function NavBar({
  items,
  className,
  currentView,
  setCurrentView,
}: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const [showToggles, setShowToggles] = useState(false);

  const handleClick = (href: string) => {
    window.location.href = href;
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
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 pointer-events-auto">
          {/* View Toggle */}
          <div className="bg-background/10 backdrop-blur-lg rounded-full border border-border p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  router.push(pathname === '/list' ? '/explore' : '/list')
                }
                className={cn(
                  'text-sm font-medium transition-colors',
                  currentView ? 'text-primary' : 'text-foreground/60'
                )}
              >
                Explore
              </button>
              <button
                onClick={() => router.push('/list')}
                className="w-8 h-4 bg-muted rounded-full relative"
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-3 h-3 bg-primary rounded-full"
                  animate={{ x: currentView ? 0 : 16 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <button
                onClick={() => router.push('/explore')}
                className={cn(
                  'text-sm font-medium transition-colors',
                  !currentView ? 'text-primary' : 'text-foreground/60'
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
          'fixed md:top-0 left-1/2 -translate-x-1/2 z-40 mb-6 sm:pt-6 pointer-events-none',
          isMobile ? 'bottom-0' : '',
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Navigation Items */}
          <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
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
                    'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors pointer-events-auto',
                    'text-foreground/80 hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
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
              'flex gap-4 pointer-events-auto',
              isMobile && 'fixed right-4 top-16',
              isMobile && !showToggles && 'opacity-0 pointer-events-none'
            )}
            animate={{
              opacity: isMobile ? (showToggles ? 1 : 0) : 1,
              y: isMobile ? (showToggles ? 0 : -20) : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* View Toggle */}
            <div className="flex gap-4">
              <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                <ViewToggle />
              </div>
              {pathname.startsWith('/list') && (
                <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                  <ThemeToggle />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
