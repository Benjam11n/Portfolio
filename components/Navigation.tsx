'use client';

import { NavBar } from '@/components/ui/tubelight-navbar';
import { NAVITEMS } from '@/constants';

export default function Navigation() {
  return (
    <div className="relative">
      <NavBar items={NAVITEMS} />
    </div>
  );
}
