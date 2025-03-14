'use client';

import { GithubIcon, LinkedinIcon, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GITHUB_URL, LINKEDIN_URL } from '@/constants';

const Hero = () => {
  return (
    <section
      className="flex h-screen items-center justify-center px-4 font-comic"
      id="home"
    >
      <div className="c-space mx-auto flex w-full flex-col gap-3">
        <p className="z-20 text-center font-comic text-2xl font-medium sm:text-3xl">
          Hi, I&apos;m
        </p>
        <h1 className="mb-6 text-center font-comic text-8xl font-bold">
          Benjamin
        </h1>
        <p className="mb-8 text-center font-comic text-xl text-muted-foreground">
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
