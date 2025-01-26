'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';

const ViewToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const currentView = pathname === '/explore';

  return (
    <div className="toggle-container">
      <button
        onClick={() => {
          router.push('/explore');
          theme.setTheme('dark');
        }}
        className={cn(
          'text-sm font-medium transition-colors',
          !currentView ? 'text-primary' : 'text-foreground/60'
        )}
      >
        Explore
      </button>

      <button
        onClick={() => router.push(currentView ? '/explore' : 'list')}
        className="toggle-switch"
      >
        <div className={`toggle-handle ${currentView ? '' : 'switched'}`} />
      </button>

      <button
        onClick={() => router.push('/list')}
        className={cn(
          'text-sm font-medium transition-colors',
          !currentView ? 'text-primary' : 'text-foreground/60'
        )}
      >
        List
      </button>
    </div>
  );
};

export default ViewToggle;
