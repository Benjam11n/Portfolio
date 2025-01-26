'use client';

import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { GithubIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import InteractiveBentoGallery from '@/components/blocks/interactive-bento-gallery';
import { Particles } from '@/components/ui/particles';

// Project data - in a real app, this would come from a CMS or database
const projects = {
  quickie: {
    title: 'E-Commerce Platform',
    description:
      'A modern e-commerce platform built with Next.js and Stripe integration.',
    fullDescription: `
      A comprehensive e-commerce solution that provides a seamless shopping experience. 
      The platform features real-time inventory management, secure payment processing, 
      and a responsive design that works across all devices.
    `,
    techStack: [
      { name: 'Next.js', color: '#0070f3' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Stripe', color: '#635bff' },
      { name: 'Tailwind', color: '#38bdf8' },
      { name: 'Prisma', color: '#2D3748' },
      { name: 'PostgreSQL', color: '#336791' },
    ],
    link: '#',
    github: '#',
    features: [
      'Secure payment processing with Stripe',
      'Real-time inventory management',
      'Admin dashboard for order management',
      'Product search and filtering',
      'User authentication and profiles',
      'Order tracking and history',
    ],
    gallery: [
      {
        id: 1,
        type: 'image',
        title: 'Dashboard Overview',
        desc: 'Main admin dashboard showing key metrics and analytics',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        span: 'md:col-span-2 md:row-span-2',
      },
      {
        id: 2,
        type: 'image',
        title: 'Product Catalog',
        desc: 'Browse through our extensive product collection',
        url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
        span: 'md:col-span-1 md:row-span-2',
      },
      {
        id: 3,
        type: 'video',
        title: 'Shopping Experience',
        desc: 'Seamless shopping cart and checkout process',
        url: 'https://cdn.pixabay.com/video/2023/03/15/07-45-36-881_large.mp4',
        span: 'md:col-span-1 md:row-span-3',
      },
      {
        id: 4,
        type: 'image',
        title: 'Mobile View',
        desc: 'Responsive design for mobile devices',
        url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80',
        span: 'md:col-span-2 md:row-span-2',
      },
    ],
  },
  'ai-chat-application': {
    title: 'AI Chat Application',
    description:
      'Real-time chat application powered by artificial intelligence.',
    fullDescription: `
      An intelligent chat platform that combines real-time communication with AI-powered 
      features. The application uses natural language processing to provide smart 
      responses and content moderation.
    `,
    techStack: [
      { name: 'React', color: '#61dafb' },
      { name: 'OpenAI', color: '#412991' },
      { name: 'Socket.io', color: '#010101' },
      { name: 'Redis', color: '#dc382d' },
      { name: 'Express', color: '#000000' },
      { name: 'MongoDB', color: '#47A248' },
    ],
    link: '#',
    github: '#',
    features: [
      'Real-time messaging with WebSocket',
      'AI-powered chat suggestions',
      'Content moderation',
      'File sharing and media support',
      'User presence indicators',
      'Message search and history',
    ],
    gallery: [
      {
        id: 1,
        type: 'video',
        title: 'Chat Interface',
        desc: 'Real-time messaging with AI responses',
        url: 'https://cdn.pixabay.com/video/2023/05/22/07-39-02-426_large.mp4',
        span: 'md:col-span-2 md:row-span-2',
      },
      {
        id: 2,
        type: 'image',
        title: 'AI Suggestions',
        desc: 'Smart response suggestions powered by AI',
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        span: 'md:col-span-1 md:row-span-3',
      },
      {
        id: 3,
        type: 'image',
        title: 'User Dashboard',
        desc: 'Personalized user dashboard with chat history',
        url: 'https://images.unsplash.com/photo-1673187735166-dcc72491c52e?w=800&q=80',
        span: 'md:col-span-1 md:row-span-2',
      },
      {
        id: 4,
        type: 'image',
        title: 'Mobile Chat',
        desc: 'Mobile-optimized chat experience',
        url: 'https://images.unsplash.com/photo-1675467369399-5f4e3c18d689?w=800&q=80',
        span: 'md:col-span-2 md:row-span-2',
      },
    ],
  },
  'blockchain-explorer': {
    title: 'Blockchain Explorer',
    description:
      'A comprehensive blockchain explorer with real-time transaction tracking.',
    fullDescription: `
      A feature-rich blockchain explorer that provides real-time insights into 
      blockchain transactions, smart contracts, and network statistics. Built with 
      performance and scalability in mind.
    `,
    techStack: [
      { name: 'Vue.js', color: '#42b883' },
      { name: 'Web3.js', color: '#f16822' },
      { name: 'Node.js', color: '#339933' },
      { name: 'GraphQL', color: '#e10098' },
      { name: 'AWS', color: '#ff9900' },
      { name: 'Ethereum', color: '#3c3c3d' },
    ],
    link: '#',
    github: '#',
    features: [
      'Real-time transaction monitoring',
      'Smart contract verification',
      'Token tracking and analytics',
      'Address watchlist',
      'Network statistics',
      'API access',
    ],
    gallery: [
      {
        id: 1,
        type: 'image',
        title: 'Transaction Explorer',
        desc: 'Real-time blockchain transaction monitoring',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
        span: 'md:col-span-2 md:row-span-2',
      },
      {
        id: 2,
        type: 'video',
        title: 'Network Stats',
        desc: 'Live network statistics and analytics',
        url: 'https://cdn.pixabay.com/video/2023/04/20/09-09-16-616_large.mp4',
        span: 'md:col-span-1 md:row-span-3',
      },
      {
        id: 3,
        type: 'image',
        title: 'Smart Contracts',
        desc: 'Smart contract verification and analysis',
        url: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80',
        span: 'md:col-span-1 md:row-span-2',
      },
      {
        id: 4,
        type: 'image',
        title: 'Token Analytics',
        desc: 'Detailed token tracking and analysis',
        url: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80',
        span: 'md:col-span-2 md:row-span-2',
      },
    ],
  },
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects[params.slug as keyof typeof projects];

  if (!project) {
    notFound();
  }

  const handleDemoClick = () => {
    window.open(project.link, '_blank');
  };

  return (
    <main className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center justify-center px-4 z-10 h-[80vh]"
      >
        <h1 className="text-4xl md:text-7xl font-bold text-center mb-6">
          {project.title}
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl text-center mb-8">
          {project.description}
        </p>
        <RainbowButton onClick={handleDemoClick}>View Live Demo</RainbowButton>
      </motion.div>
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={80}
        refresh
      />

      {/* Project Details */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <p className="text-muted-foreground mb-8">
              {project.fullDescription}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Source Code
                </a>
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-muted-foreground"
                >
                  <span className="h-2 w-2 rounded-full bg-primary mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 bg-background/80 backdrop-blur-sm">
        <InteractiveBentoGallery
          mediaItems={project.gallery}
          title="Project Gallery"
          description="Explore the features and interface of this project"
        />
      </section>
    </main>
  );
}
