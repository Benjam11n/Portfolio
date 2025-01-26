'use client';

import { Home, User, Briefcase, Hammer, Mail } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

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
      <NavBar items={navItems} />
    </div>
  );
}
