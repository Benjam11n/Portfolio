"use client"

import { Home, User, Briefcase, FileText } from 'lucide-react';
import { NavBar as TubelightNavBar } from './tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'About', url: '/about', icon: User },
  { name: 'Projects', url: '/projects', icon: Briefcase },
  { name: 'Resume', url: '/resume', icon: FileText }
];

export function NavBar() {
  return <TubelightNavBar items={navItems} />;
}