'use client';

import {
  Home,
  User,
  Briefcase,
  FileText,
  Hammer,
  Phone,
  Mail,
} from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: Hammer },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function Navigation() {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <NavBar items={navItems} />
    </div>
  );
}
