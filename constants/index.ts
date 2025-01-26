export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Experience',
    href: '#experience',
  },
  {
    id: 4,
    name: 'Projects',
    href: '#projects',
  },

  {
    id: 5,
    name: 'Contact',
    href: '#contact',
  },
];

interface Project {
  title: string;
  href?: string;
  desc: string;
  subdesc?: string;
  texture: string;
  logo: string;
  logoStyle: React.CSSProperties;
  spotlight: string;
  tags: {
    id: number;
    name: string;
    path: string;
  }[];
}

export const myProjects: Project[] = [
  {
    title: 'Quickie - AI-Powered Marketplace',
    desc: 'Quickie is an innovative e-commerce platform that leverages AI technology to provide personalized perfume recommendations to users. It offers a seamless shopping experience, with features like social media sharing and secure payment processing.',
    subdesc:
      'Built as a unique e-commerce app with Next.js 15, Tailwind CSS, TypeScript, Framer Motion, shadcn/ui, Zustand, React Query and MongoDB, Quickie is designed to be beautiful and memorable yet performant.',
    href: '/list/projects/quickie',
    texture: '/textures/project/project1.mp4',
    logo: '/projects/project1-logo.png',
    logoStyle: {
      backgroundColor: '#170040',
      border: '0.2px solid #0f0226',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    // Add Shadcn UI and React Query and Zustand/ MongoDB
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
      {
        id: 5,
        name: 'Zustand',
        path: '/assets/zustand.png',
      },
      {
        id: 6,
        name: 'MongoDB',
        path: '/assets/mongodb.svg',
      },
    ],
  },
  {
    title: 'Birds of a Feather - Community Forum',
    desc: 'Birds of a Feather is a community forum designed for bird lovers to connect, share knowledge, and discuss their passion for birds. It offers a user-friendly interface, with features like real-time messaging, notifications, and user profiles. With Birds of a Feather, users can create and join groups, share photos and videos, and participate in discussions. ',
    subdesc:
      'Built with React, Typescript Tailwind CSS, shadcn/ui, React Query and Docker, Birds of a Feather is a modern forum that brings bird enthusiasts together.',
    // href: 'https://www.youtube.com/watch?v=y5vE8y_f_OM',
    texture: '/textures/project/project2.mp4',
    logo: '/projects/project2-logo.png',
    logoStyle: {
      backgroundColor: '#16015c',
      border: '0.2px solid #0c0036',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'PostgreSQL',
        path: '/assets/pgsql.svg',
      },
      {
        id: 5,
        name: 'Docker',
        path: '/assets/docker.svg',
      },
    ],
  },
  {
    title: 'CampusQ - Stackoverflow Clone for University Students',
    desc: 'A practice project to create a Stackoverflow clone for university students. CampusQ is a platform where students can ask questions, get answers, and share knowledge with their peers. It offers a user-friendly interface, with features like real-time messaging, notifications, and user profiles.',
    subdesc:
      'Built with Next.js 15, React, Typescript, Tailwind CSS, and MongoDB, CampusQ is a modern forum that brings university students together.',
    // href: 'https://www.youtube.com/watch?v=lEflo_sc82g',
    texture: '/textures/project/project3.mp4',
    logo: '/projects/project3-logo.png',
    logoStyle: {
      backgroundColor: '#913800',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'MongoDB',
        path: '/assets/mongodb.svg',
      },
    ],
  },
  {
    title: 'WorldQuant NUS Alphathon - 4th Place Winner',
    desc: 'WorldQuant NUS Alphathon is a prestigious competition that challenges students to develop quantitative trading strategies using machine learning and statistical models. Horizon is a banking app that offers a seamless and secure banking experience, with features like real-time messaging, notifications, and user profiles.',
    // href: 'https://www.youtube.com/watch?v=PuOVqP_cjkE',
    texture: '/textures/project/project4.mp4',
    logo: '/projects/project4-logo.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [],
  },
];

// eslint-disable-next-line no-unused-vars
export const calculateSizes = (
  isSmall: boolean,
  isMobile: boolean,
  isTablet: boolean
) => {
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

export const exploreInfo = {
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
      name: 'Perfume Marketplace',
      description:
        'An innovative perfume merketplace featuring AI recommendations',
      image: 'projects/project1.png',
      // link: 'example.com',
    },
    {
      name: 'Birds of a Feather Forum',
      description: 'A forum for all bird lovers to flock together!',
      image: 'projects/project2.jpg',
      // link: 'example.com',
    },
    {
      name: 'CampusQ',
      description:
        'A practice project to create a stackoverflow clone for university students',
      image: 'projects/project3.png',
      // link: 'example.com',
    },
    {
      name: 'World Quant NUS Alphathon',
      description: '4th place winner in the World Quant NUS Alphathon 2024',
      image: 'projects/project4.png',
      // link: 'example.com',
    },
  ],
  contact: {
    name: 'Benjamin Wang',
    address: 'Singapore, Singapore',
    socials: {
      linkedin: 'https://www.linkedin.com/in/benjaminwang-sg/',
      github: 'https://github.com/Benjam11n',
    },
    mail: 'youcanfindbenjamin@gmail.com',
  },
};
