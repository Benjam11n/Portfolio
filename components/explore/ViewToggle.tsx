'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

const ViewToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <div className="toggle-container">
      <button
        onClick={() => {
          router.push('/explore');
          theme.setTheme('dark');
        }}
        className={cn(
          'text-sm font-medium transition-colors',
          pathname == '/explore' ? 'text-primary' : 'text-foreground/60',
        )}
      >
        Explore
      </button>

      <button
        onClick={() => router.push(pathname == '/explore' ? '/explore' : 'list')}
        className="toggle-switch"
      >
        <div className={`toggle-handle ${pathname == '/explore' ? '' : 'switched'}`} />
      </button>

      <button
        onClick={() => router.push('/list')}
        className={cn(
          'text-sm font-medium transition-colors',
          pathname == '/list' ? 'text-primary' : 'text-foreground/60',
        )}
      >
        List
      </button>
    </div>
  );
};

export default ViewToggle;
