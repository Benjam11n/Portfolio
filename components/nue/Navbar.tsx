'use client';

import { Briefcase, FolderOpen, Home, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: FolderOpen },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export const Navbar = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-1.5 rounded-full bg-primary/95 backdrop-blur-md shadow-2xl border border-white/10 ring-1 ring-black/5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 hover:bg-white/10 group"
          >
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            <span className="text-[10px] font-medium text-gray-500 mt-0.5 group-hover:text-gray-200 transition-colors duration-300 opacity-0 group-hover:opacity-100 absolute translate-y-4 group-hover:translate-y-3">
              {item.name}
            </span>
            <span className="sr-only">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
