'use client';

import { Briefcase, FolderOpen, Home, Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: FolderOpen },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 rounded-2xl bg-primary/80 backdrop-blur-lg shadow-2xl border border-white/10 ring-1 ring-black/5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-12 h-10 rounded-xl transition-all duration-300 hover:bg-white/10 group relative"
          >
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            <span className="sr-only">{item.name}</span>
            <div className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.name}
            </div>
          </Link>
        ))}
        
        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex flex-col items-center justify-center w-12 h-10 rounded-xl transition-all duration-300 hover:bg-white/10 group relative"
          aria-label="Toggle theme"
        >
          {mounted && theme === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          )}
        </button>
      </nav>
    </div>
  );
};
