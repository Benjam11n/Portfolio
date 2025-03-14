import {
  Briefcase,
  Hammer,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react';

export const GITHUB_URL = 'https://github.com/Benjam11n';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/benjaminwang-sg/';
export const EMAIL = 'youcanfindbenjamin@gmail.com';

export const NAVITEMS = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: Hammer },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email',
    value: EMAIL,
    link: 'mailto:' + EMAIL,
  },
  {
    icon: Phone,
    title: 'Telegram',
    value: '@benjaminwjy',
    link: 'https://t.me/benjaminwjy',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Singapore, Singapore',
    link: 'https://www.google.com/maps?sca_esv=be29cc62fc8e0244&output=search&q=singapore&source=lnms&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpmDtIGL1r84kuKz6yAcD_ivAVmKZxU_UoutG-TG5lqbs6lRwhrq5ZB_F86GMJ9ziSEjGRiIlIm49QFZ29HJnTOtclbEBLRvQNU_hFpwv3LwPOP_-zf-eYJHllGGkzKgeHQLdB6B3-VlFzSxJCns_CBWmxXgHXIh2DMBlpTcTUYuIudKaBVuiYfrixm0RVLzkD2wC-zA&entry=mc&ved=1t:200715&ictx=111',
  },
  {
    icon: MessageSquare,
    title: 'LinkedIn',
    link: 'https://www.linkedin.com/in/benjaminwang-sg/',
  },
];

interface ProjectTechnology {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: (props: { className: string }) => JSX.Element;
  path: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  subdesc?: string;
  status?: 'completed' | 'in-development' | 'planned';

  // Links
  href?: string;
  link?: string;
  github?: string;

  // Visual elements
  texture?: string;
  logo: string;
  logoStyle?: React.CSSProperties;
  spotlight: string;

  // Technologies used
  techStack: ProjectTechnology[];

  // Features
  features?: string[];
}

export const PROJECTS: Record<string, Project> = {
  twinAI: {
    id: 'twinAI',
    title: 'TwinAI - AI-Powered Digital Twins for Mental Health Therapy',
    description:
      'A platform that uses AI-powered digital twins to revolutionize mental health therapy and treatment.',
    subdesc:
      'TwinAI creates virtual representations of patients’ psychological states, enabling therapists to simulate interventions, track mood patterns, and develop personalized treatment plans.',
    href: 'https://twin-ai-one.vercel.app/',
    github: 'https://github.com/Benjam11n/TwinAI',
    texture: '/textures/project/project1.mp4',
    logo: '/projects/project1-logo.png',
    logoStyle: {
      backgroundColor: '#151a11',
      border: '0.2px solid #233814',
      boxShadow: '0px 0px 60px 0px #324d1f',
    },
    spotlight: '/assets/spotlight4.png',
    techStack: [
      {
        name: 'React',
        color: '#001b59',
        size: 'xl',
        path: '/assets/react.svg',
      },
      {
        name: 'Tailwind',
        color: '#0F766E',
        size: 'xl',
        path: '/assets/tailwindcss.png',
      },
      {
        name: 'TypeScript',
        color: '#3178C6',
        size: 'xl',
        path: '/assets/typescript.svg',
      },
      {
        name: 'MongoDB',
        color: '#023430',
        size: 'lg',
        path: '/assets/mongodb.svg',
      },
      {
        name: 'Google Gemini',
        color: '#0D4C87',
        size: 'lg',
        path: '/assets/google-gemini.svg',
      },
      {
        name: 'Pytorch',
        color: '#0D4C87',
        size: 'lg',
        path: '/assets/pytorch.svg',
      },
    ],
    features: [
      'Real-time voice-based therapy sessions',
      'Interactive AI patient simulations',
      'Contextual, condition-specific responses',
      'Learning from therapeutic techniques',
      'Voice processing for seamless interaction',
    ],
  },
  quickie: {
    id: 'quickie',
    title: 'Quickie - AI-Powered Marketplace',
    description:
      'Quickie is an innovative e-commerce platform that leverages AI technology to provide personalized perfume recommendations to users.',
    subdesc:
      'Built as a unique e-commerce app with Next.js 15, Tailwind CSS, TypeScript, Framer Motion, shadcn/ui, Zustand, React Query and MongoDB, Quickie is designed to be beautiful and memorable yet performant.',
    status: 'in-development',
    github: 'https://github.com/Benjam11n/Quickie',
    texture: '/textures/project/project2.mp4',
    logo: '/projects/project2-logo.png',
    logoStyle: {
      backgroundColor: '#170040',
      border: '0.2px solid #0f0226',
      boxShadow: '0px 0px 60px 0px #4f248f',
    },
    spotlight: '/assets/spotlight1.png',
    techStack: [
      {
        name: 'React',
        color: '#001b59',
        size: 'xl',
        path: '/assets/react.svg',
      },
      {
        name: 'Tailwind',
        color: '#0F766E',
        size: 'xl',
        path: '/assets/tailwindcss.png',
      },
      {
        name: 'TypeScript',
        color: '#3178C6',
        size: 'xl',
        path: '/assets/typescript.svg',
      },
      {
        name: 'Framer Motion',
        color: '#2e00a1',
        size: 'lg',
        path: '/assets/framer.png',
      },
      {
        name: 'Zustand',
        color: '#E67E22',
        size: 'lg',
        path: '/assets/zustand.png',
      },
      {
        name: 'MongoDB',
        color: '#023430',
        size: 'lg',
        path: '/assets/mongodb.svg',
      },
    ],
    features: [
      'Product search and filtering',
      'AI-powered recommendation system',
      'Waitlist system',
      'User authentication and profiles',
      'Email confirmation and notifications',
    ],
  },
  chip: {
    id: 'chip',
    title: 'Chip - Play poker anytime, anywhere',
    description:
      'A digital poker chip tracker that lets you and your friends enjoy poker games without physical chips. Perfect for casual games anywhere.',
    subdesc:
      'Built with Next.js, React, TypeScript, Framer motion, TailwindCSS and Supabase, Chip provides a seamless and reliable poker experience with real-time updates and easy chip management.',
    href: 'https://chip-sg.vercel.app/',
    status: 'completed',
    github: 'https://github.com/Benjam11n/Chip',
    texture: '/textures/project/project3.mp4',
    logo: '/projects/project3-logo.png',
    logoStyle: {
      backgroundColor: '#000000',
      border: '0.2px solid #24020b',
      boxShadow: '0px 0px 60px 0px #380310',
    },
    spotlight: '/assets/spotlight3.png',
    techStack: [
      {
        name: 'React',
        color: '#001b59',
        size: 'xl',
        path: '/assets/react.svg',
      },
      {
        name: 'Tailwind',
        color: '#0F766E',
        size: 'xl',
        path: '/assets/tailwindcss.png',
      },
      {
        name: 'TypeScript',
        color: '#3178C6',
        size: 'xl',
        path: '/assets/typescript.svg',
      },
      {
        name: 'Framer Motion',
        color: '#2e00a1',
        size: 'lg',
        path: '/assets/framer.png',
      },
      {
        name: 'Supabase',
        color: '#525252',
        size: 'lg',
        path: '/assets/supabase.svg',
      },
    ],
    features: [
      'Real-time chip count tracking',
      'Multiple table support',
      'Customizable starting stacks',
      'Blind timer and level management',
      'Game history and statistics',
    ],
  },
  'birds-of-a-feather': {
    id: 'birds-of-a-feather',
    title: 'Birds of a Feather - Community Forum',
    description:
      'Birds of a Feather is a community forum designed for bird lovers to connect, share knowledge, and discuss their passion for birds.',
    subdesc:
      'Built with React, Typescript Tailwind CSS, shadcn/ui, React Query and Docker, Birds of a Feather is a modern forum that brings bird enthusiasts together.',
    github: 'https://github.com/Benjam11n/Birds-of-a-Feather-frontend',
    texture: '/textures/project/project4.mp4',
    logo: '/projects/project4-logo.png',
    logoStyle: {
      backgroundColor: '#16015c',
      border: '0.2px solid #0c0036',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    techStack: [
      {
        name: 'React',
        color: '#001b59',
        size: 'xl',
        path: '/assets/react.svg',
      },
      {
        name: 'Tailwind',
        color: '#0F766E',
        size: 'xl',
        path: '/assets/tailwindcss.png',
      },
      {
        name: 'TypeScript',
        color: '#3178C6',
        size: 'xl',
        path: '/assets/typescript.svg',
      },
      {
        name: 'PostgreSQL',
        color: '#2F5E8D',
        size: 'lg',
        path: '/assets/pgsql.svg',
      },
      {
        name: 'Docker',
        color: '#1D63ED',
        size: 'md',
        path: '/assets/docker.svg',
      },
    ],
    features: [
      'Real-time community discussions',
      'Photo and video sharing for bird sightings',
      'Group creation and management',
      'User profiles with bird watching history',
      'Bird species identification assistance',
    ],
  },
  worldquant: {
    id: 'worldquant',
    title: 'WorldQuant NUS Alphathon - 4th Place Winner',
    description:
      'WorldQuant NUS Alphathon is a prestigious competition that challenges students to develop quantitative trading strategies.',
    texture: '/textures/project/project5.mp4',
    logo: '/projects/project5-logo.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    techStack: [],
  },
};

export const getProjectsArray = () => Object.values(PROJECTS);
export const getProjectById = (id: string) => PROJECTS[id];
export const getProjectsForDisplay = () =>
  Object.values(PROJECTS).map((project) => ({
    title: project.title,
    desc: project.description,
    subdesc: project.subdesc,
    href: project.href,
    texture: project.texture,
    logo: project.logo,
    logoStyle: project.logoStyle,
    spotlight: project.spotlight,
    tags: project.techStack.map((tech, id) => ({
      id: id + 1,
      name: tech.name,
      path: tech.path,
    })),
  }));

export const calculateSizes = (isMobile: boolean) => {
  return {
    labPosition: isMobile ? [0.5, -6, 0] : [0, -5.5, 0],
    spotlightPosition: isMobile ? [0, 7, 3] : [0, 5, 3],
    avatarPosition: isMobile ? [0, -6, 0.3] : [0, -5.5, 0.3],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'WorldQuant BRAIN',
    pos: 'Research Consultant',
    duration: '2024 - Present',
    title:
      'Creating and testing quantitative trading strategies using machine learning and statistical models. Conducting research on financial markets and developing new trading strategies.',
    icon: '/experiences/experience1-logo.png',
    texture: '/textures/experience/experience1.mp4',
  },
  {
    id: 2,
    name: 'Computing for Voluntary Welfare Organizations',
    pos: 'Full stack Software Engineer',
    duration: 'May 2024 - Aug 2024',
    title:
      'I collaborated in a 10-member cross-functional team to develop and scale an enterprise IT management system for Voluntary Welfare Organizations (VWOs). I also designed and created an automated appointment management system with SMS integration, enabling 20+ VWOs to reduce missed appointments.',
    icon: '/experiences/experience2-logo.png',
    texture: '/textures/experience/experience2.mp4',
  },
];

export const SECTIONS_DISTANCE = 10;

export const leftWhiteboardTexts = [
  { content: 'Hi! I am Benjamin, a sophomre at' },
  { content: 'the National University of' },
  { content: 'Singapore. I specialize in Javascript/' },
  { content: 'Typescript with a focus on React' },
  { content: 'and Next.js ecosystems.' },
];

export const rightWhiteboardTexts = [
  { content: 'I also have a deep passion for', size: 0.1 },
  { content: 'AI and Deep Learning.', size: 0.1 },
];

interface ExploreInfo {
  title: string;
  sections: string[];
  home: {
    title: string;
    subtitle: string;
  };
  experiences: {
    name: string;
    description: string;
    image: string;
  }[];
  projects: {
    name: string;
    description: string;
    image: string;
    link?: string;
  }[];
  contact: {
    name: string;
    address: string;
    socials: {
      linkedin: string;
      github: string;
    };
    mail: string;
  };
}

export const exploreInfo: ExploreInfo = {
  title: "Benjamin's portfolio",
  sections: ['home', 'about', 'experience', 'projects', 'contact'],
  home: {
    title: 'BENJAMIN',
    subtitle: 'WANG',
  },
  experiences: [
    {
      name: 'Computing for Voluntary Welfare Organisations',
      description:
        'Full stack software development for non-profit organisations',
      image: 'experiences/experience1.png',
    },
    {
      name: 'WorldQuant Research Consultant',
      description: 'Creating and testing quantitative trading strategies',
      image: 'experiences/experience2.png',
    },
  ],
  projects: [
    {
      name: 'TwinAI',
      description: 'AI-Powered Digital Twins for Mental Health Therapy',
      image: 'projects/project1.png',
      link: 'https://twin-ai-one.vercel.app/',
    },
    {
      name: 'Perfume Marketplace',
      description:
        'An innovative perfume merketplace featuring AI recommendations',
      image: 'projects/project2.png',
    },
    {
      name: 'Chip',
      description:
        'A digital poker chip tracker that lets you play poker anywhere!',
      image: 'projects/project3.png',
      link: 'https://chip-sg.vercel.app/',
    },
    {
      name: 'Birds of a Feather Forum',
      description: 'A forum for all bird lovers to flock together!',
      image: 'projects/project4.jpg',
    },
    {
      name: 'World Quant NUS Alphathon',
      description: '4th place winner in the World Quant NUS Alphathon 2024',
      image: 'projects/project5.png',
    },
  ],
  contact: {
    name: 'Benjamin Wang',
    address: 'Singapore, Singapore',
    socials: {
      linkedin: LINKEDIN_URL,
      github: GITHUB_URL,
    },
    mail: EMAIL,
  },
};
