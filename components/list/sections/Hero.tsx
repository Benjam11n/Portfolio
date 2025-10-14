'use client';

import { GithubIcon, LinkedinIcon, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GITHUB_URL, LINKEDIN_URL } from '@/constants';

const Hero = () => {
  return (
    <section className="font-comic flex h-screen items-center justify-center px-4" id="home">
      <div className="c-space mx-auto flex w-full flex-col gap-3">
        <p className="font-comic z-20 text-center text-2xl font-medium sm:text-3xl">Hi, I&apos;m</p>
        <h1 className="font-comic mb-6 text-center text-6xl font-bold lg:text-8xl">Benjamin</h1>
        <p className="font-comic text-muted-foreground mb-8 text-center text-xl">
          Full Stack Developer & AI Enthusiast
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="size-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <a href="#contact">
              <Mail className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
