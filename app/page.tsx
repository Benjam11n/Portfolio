'use client';

import Scene from '@/components/3d/Scene';
import ProjectCard from '@/components/ProjectCard';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { Button } from '@/components/ui/button';
import {
  GithubIcon,
  LinkedinIcon,
  Mail,
  FileText,
  Download,
} from 'lucide-react';
import { Gravity, MatterBody } from '@/components/ui/gravity';

export default function Home() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description:
        'A modern e-commerce platform built with Next.js and Stripe integration.',
      image:
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      link: '/projects/e-commerce-platform',
    },
    {
      title: 'AI Chat Application',
      description:
        'Real-time chat application powered by artificial intelligence.',
      image:
        'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
      link: '/projects/ai-chat-application',
    },
    {
      title: 'Blockchain Explorer',
      description:
        'A comprehensive blockchain explorer with real-time transaction tracking.',
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      link: '/projects/blockchain-explorer',
    },
  ];

  const skills = [
    { name: 'React', color: '#61DAFB', size: 'lg' },
    { name: 'TypeScript', color: '#3178C6', size: 'xl' },
    { name: 'Next.js', color: '#000000', size: 'lg' },
    { name: 'Node.js', color: '#339933', size: 'xl' },
    { name: 'Python', color: '#3776AB', size: 'lg' },
    { name: 'GraphQL', color: '#E10098', size: 'md' },
    { name: 'Docker', color: '#2496ED', size: 'lg' },
    { name: 'AWS', color: '#FF9900', size: 'xl' },
    { name: 'PostgreSQL', color: '#336791', size: 'lg' },
    { name: 'MongoDB', color: '#47A248', size: 'md' },
    { name: 'Redis', color: '#DC382D', size: 'lg' },
    { name: 'Tailwind', color: '#38B2AC', size: 'xl' },
  ];

  const sizeClasses = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  };

  return (
    <main className="min-h-screen">
      <Scene />

      {/* Hero Section */}
      <section
        className="h-screen flex items-center justify-center px-4 font-comic"
        id="home"
      >
        <div className="text-center z-10">
          <h1 className="text-8xl font-bold mb-6">Benjamin</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Full Stack Developer & 3D Enthusiast
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="icon">
              <GithubIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <LinkedinIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* About/Skills Section */}
      <section
        className="min-h-screen py-20 px-4 bg-background/80 backdrop-blur-sm"
        id="about"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center font-comic">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center font-nohemi font-normal">
            <div className="space-y-6">
              <p className="text-xl">
                I'm a passionate Full Stack Developer with expertise in modern
                web technologies. With over 5 years of experience, I specialize
                in building scalable applications and creating engaging user
                experiences.
              </p>
              <p className="text-xl">
                My approach combines technical excellence with creative
                problem-solving, ensuring that every project I work on meets
                both functional requirements and user expectations.
              </p>
              <div className="flex gap-4">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  View Resume
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] bg-background/50 rounded-lg overflow-hidden z-[60]">
              <h3 className="text-2xl font-semibold text-center mt-4 mb-8">
                Skills
              </h3>
              <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
                {skills.map((skill, index) => (
                  <MatterBody
                    key={index}
                    matterBodyOptions={{
                      friction: 0.3,
                      restitution: 0.7,
                      density: 0.8,
                    }}
                    x={`${20 + ((index * 15) % 80)}%`}
                    y={`${20 + Math.floor((index * 15) / 80) * 20}%`}
                    angle={Math.random() * 20 - 10}
                  >
                    <div
                      className={`${
                        sizeClasses[skill.size as keyof typeof sizeClasses]
                      } text-white rounded-full hover:cursor-grab px-6 py-3 whitespace-nowrap`}
                      style={{ backgroundColor: skill.color }}
                    >
                      {skill.name}
                    </div>
                  </MatterBody>
                ))}
              </Gravity>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-background/80 backdrop-blur-sm" id="experience">
        <ExperienceTimeline />
      </section>

      {/* Projects Section */}
      <section
        className="py-20 px-4 bg-background/80 backdrop-blur-sm"
        id="projects"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4" id="contact">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground mb-8">
            I'm always open to discussing new projects and opportunities.
          </p>
          <Button size="lg">Get in Touch</Button>
        </div>
      </section>
    </main>
  );
}
