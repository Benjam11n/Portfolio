'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface Card3DProps {
  name: string;
  organization: string;
  date: string;
  image: string;
  description: string;
}

export const Card3D = ({ name, organization, date, image, description }: Card3DProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 20 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = x / rect.width;
      const percentY = y / rect.height;
      const maxTilt = 12; // degrees
      rotY.set((percentX - 0.5) * 2 * maxTilt);
      rotX.set(-(percentY - 0.5) * 2 * maxTilt);
      setShinePos({ x: percentX * 100, y: percentY * 100 });
    },
    [rotX, rotY],
  );

  const handleMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
  }, [rotX, rotY]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' as any }}
        className="relative"
      >
        {/* Pokémon-style gradient border wrapper */}
        <div className="relative rounded-[22px] bg-gradient-to-br from-yellow-400 via-rose-500 to-purple-600 p-[3px] shadow-[0_10px_40px_rgba(234,179,8,0.25)]">
          <Card className="relative overflow-hidden rounded-[20px] border border-yellow-200/40 bg-card/90 shadow-2xl">
            <div className="relative h-52 w-full md:h-72" style={{ transform: 'translateZ(30px)' }}>
              <Image src={image} alt={name} fill className="object-cover" priority />
              {/* subtle top foil strip */}
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-r from-yellow-200/25 via-pink-200/20 to-purple-200/25"
                style={{ transform: 'translateZ(35px)' }}
              />
            </div>
            <CardHeader className="space-y-1" style={{ transform: 'translateZ(20px)' }}>
              <CardTitle className="font-comic text-xl md:text-2xl">{name}</CardTitle>
              <CardDescription className="text-sm md:text-base">
                {organization} • {date}
              </CardDescription>
            </CardHeader>
            <CardContent style={{ transform: 'translateZ(15px)' }}>
              <p className="text-muted-foreground md:text-lg">{description}</p>
            </CardContent>
            <CardFooter className="justify-between" style={{ transform: 'translateZ(10px)' }}>
              <div className="text-xs text-muted-foreground">Swipe or drag to navigate</div>
            </CardFooter>

            {/* Shine overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(80px 80px at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.25), transparent 60%)`,
                mixBlendMode: 'overlay',
                opacity: 0.85,
                transform: 'translateZ(40px)',
              }}
            />
            {/* diagonal foil tint */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)',
              }}
            />
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Card3D;
