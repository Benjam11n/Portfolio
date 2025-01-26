import Navigation from '@/components/Navigation';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
