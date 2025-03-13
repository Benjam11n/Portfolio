'use client';

import { GithubIcon, LinkedinIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_URL, LINKEDIN_URL } from '@/constants';

const Hero = () => {
  return (
    <section
      className="h-screen flex items-center justify-center px-4 font-comic"
      id="home"
    >
      <div className="w-full mx-auto flex flex-col c-space gap-3">
        <p className="sm:text-3xl text-2xl font-medium text-center font-comic z-20">
          Hi, I'm
        </p>
        <h1 className="text-8xl font-bold mb-6 text-center font-comic">
          Benjamin
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-center font-comic">
          Full Stack Developer & AI Enthusiast
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="icon">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <a href="#contact">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
