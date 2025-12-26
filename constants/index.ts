import {
  Award,
  Briefcase,
  Hammer,
  Home,
  Linkedin,
  Mail,
  MapPin,
  Send,
  User,
} from "lucide-react";
import type React from "react";

export const GITHUB_URL = "https://github.com/Benjam11n";
export const LINKEDIN_URL = "https://www.linkedin.com/in/benjaminwang-sg/";
export const EMAIL = "youcanfindbenjamin@gmail.com";

export const NAVITEMS = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: Hammer },
  { name: "Certifications", href: "#certifications", icon: Award },
  { name: "Contact", href: "#contact", icon: Mail },
];

export const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    value: EMAIL,
    link: `mailto:${EMAIL}`,
  },
  {
    icon: Send,
    title: "Telegram",
    value: "@benjaminwjy",
    link: "https://t.me/benjaminwjy",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Singapore, Singapore",
    link: "https://www.google.com/maps?sca_esv=be29cc62fc8e0244&output=search&q=singapore&source=lnms&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpmDtIGL1r84kuKz6yAcD_ivAVmKZxU_UoutG-TG5lqbs6lRwhrq5ZB_F86GMJ9ziSEjGRiIlIm49QFZ29HJnTOtclbEBLRvQNU_hFpwv3LwPOP_-zf-eYJHllGGkzKgeHQLdB6B3-VlFzSxJCns_CBWmxXgHXIh2DMBlpTcTUYuIudKaBVuiYfrixm0RVLzkD2wC-zA&entry=mc&ved=1t:200715&ictx=111",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/benjaminwang-sg/",
  },
];

type ProjectTechnology = {
  name: string;
  colorLight: string;
  colorDark: string;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: (props: { className: string }) => React.JSX.Element;
  path: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  subdesc?: string;
  year: string;
  client: string;
  services: string;
  location: string;
  status?: "completed" | "in-development" | "planned";

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
};

export const PROJECTS: Record<string, Project> = {
  twinAI: {
    id: "twinAI",
    title: "TwinAI - AI-Powered Digital Twins for Therapy",
    description:
      "A platform that uses AI-powered digital twins to revolutionize mental health therapy and treatment.",
    subdesc:
      "TwinAI creates virtual representations of patients’ psychological states, enabling therapists to simulate interventions, track mood patterns, and develop personalized treatment plans.",
    year: "2024",
    client: "Personal Project",
    services: "AI, Web Development",
    location: "Singapore",
    href: "https://twin-ai-one.vercel.app/",
    github: "https://github.com/Benjam11n/TwinAI",
    texture: "/textures/project/project1.mp4",
    logo: "/projects/project1-logo.png",
    logoStyle: {
      backgroundColor: "#151a11",
      border: "0.2px solid #233814",
      boxShadow: "0px 0px 60px 0px #324d1f",
    },
    spotlight: "/assets/spotlight4.png",
    techStack: [
      {
        name: "React",
        colorLight: "#E0F7FA",
        colorDark: "#001b59",
        size: "xl",
        path: "/assets/react.svg",
      },
      {
        name: "Tailwind",
        colorLight: "#E0F2F1",
        colorDark: "#0F766E",
        size: "xl",
        path: "/assets/tailwindcss.png",
      },
      {
        name: "TypeScript",
        colorLight: "#E3F2FD",
        colorDark: "#3178C6",
        size: "xl",
        path: "/assets/typescript.svg",
      },
      {
        name: "MongoDB",
        colorLight: "#E8F5E9",
        colorDark: "#023430",
        size: "lg",
        path: "/assets/mongodb.svg",
      },
      {
        name: "Google Gemini",
        colorLight: "#E3F2FD",
        colorDark: "#0D4C87",
        size: "lg",
        path: "/assets/google-gemini.svg",
      },
      {
        name: "Pytorch",
        colorLight: "#E1F5FE",
        colorDark: "#0D4C87",
        size: "lg",
        path: "/assets/pytorch.svg",
      },
    ],
    features: [
      "Real-time voice-based therapy sessions",
      "Interactive AI patient simulations",
      "Contextual, condition-specific responses",
      "Learning from therapeutic techniques",
      "Voice processing for seamless interaction",
    ],
  },
  quickie: {
    id: "quickie",
    title: "Quickie - AI-Powered Marketplace",
    description:
      "Quickie is an innovative e-commerce platform that leverages AI technology to provide personalized perfume recommendations to users.",
    subdesc:
      "Built as a unique e-commerce app with Next.js 15, Tailwind CSS, TypeScript, Framer Motion, shadcn/ui, Zustand, React Query and MongoDB, Quickie is designed to be beautiful and memorable yet performant.",
    year: "2024",
    client: "Personal Project",
    services: "E-commerce, AI",
    location: "Singapore",
    status: "in-development",
    github: "https://github.com/Benjam11n/Quickie",
    texture: "/textures/project/project2.mp4",
    logo: "/projects/project2-logo.png",
    logoStyle: {
      backgroundColor: "#170040",
      border: "0.2px solid #0f0226",
      boxShadow: "0px 0px 60px 0px #4f248f",
    },
    spotlight: "/assets/spotlight1.png",
    techStack: [
      {
        name: "React",
        colorLight: "#E0F7FA",
        colorDark: "#001b59",
        size: "xl",
        path: "/assets/react.svg",
      },
      {
        name: "Tailwind",
        colorLight: "#E0F2F1",
        colorDark: "#0F766E",
        size: "xl",
        path: "/assets/tailwindcss.png",
      },
      {
        name: "TypeScript",
        colorLight: "#E3F2FD",
        colorDark: "#3178C6",
        size: "xl",
        path: "/assets/typescript.svg",
      },
      {
        name: "Framer Motion",
        colorLight: "#F3E5F5",
        colorDark: "#2e00a1",
        size: "lg",
        path: "/assets/framer.png",
      },
      {
        name: "Zustand",
        colorLight: "#FFF3E0",
        colorDark: "#E67E22",
        size: "lg",
        path: "/assets/zustand.png",
      },
      {
        name: "MongoDB",
        colorLight: "#E8F5E9",
        colorDark: "#023430",
        size: "lg",
        path: "/assets/mongodb.svg",
      },
    ],
    features: [
      "Product search and filtering",
      "AI-powered recommendation system",
      "Waitlist system",
      "User authentication and profiles",
      "Email confirmation and notifications",
    ],
  },
  chip: {
    id: "chip",
    title: "Chip - Play poker anytime, anywhere",
    description:
      "A digital poker chip tracker that lets you and your friends enjoy poker games without physical chips. Perfect for casual games anywhere.",
    subdesc:
      "Built with Next.js, React, TypeScript, Framer motion, TailwindCSS and Supabase, Chip provides a seamless and reliable poker experience with real-time updates and easy chip management.",
    year: "2024",
    client: "Personal Project",
    services: "Web App, Real-time",
    location: "Singapore",
    href: "https://chip-sg.vercel.app/",
    status: "completed",
    github: "https://github.com/Benjam11n/Chip",
    texture: "/textures/project/project3.mp4",
    logo: "/projects/project3-logo.png",
    logoStyle: {
      backgroundColor: "#000000",
      border: "0.2px solid #24020b",
      boxShadow: "0px 0px 60px 0px #380310",
    },
    spotlight: "/assets/spotlight3.png",
    techStack: [
      {
        name: "React",
        colorLight: "#E0F7FA",
        colorDark: "#001b59",
        size: "xl",
        path: "/assets/react.svg",
      },
      {
        name: "Tailwind",
        colorLight: "#E0F2F1",
        colorDark: "#0F766E",
        size: "xl",
        path: "/assets/tailwindcss.png",
      },
      {
        name: "TypeScript",
        colorLight: "#E3F2FD",
        colorDark: "#3178C6",
        size: "xl",
        path: "/assets/typescript.svg",
      },
      {
        name: "Framer Motion",
        colorLight: "#F3E5F5",
        colorDark: "#2e00a1",
        size: "lg",
        path: "/assets/framer.png",
      },
      {
        name: "Supabase",
        colorLight: "#E8F5E9",
        colorDark: "#525252",
        size: "lg",
        path: "/assets/supabase.svg",
      },
    ],
    features: [
      "Real-time chip count tracking",
      "Multiple table support",
      "Customizable starting stacks",
      "Blind timer and level management",
      "Game history and statistics",
    ],
  },
  "birds-of-a-feather": {
    id: "birds-of-a-feather",
    title: "Birds of a Feather - Community Forum",
    description:
      "Birds of a Feather is a community forum designed for bird lovers to connect, share knowledge, and discuss their passion for birds.",
    subdesc:
      "Built with React, Typescript Tailwind CSS, shadcn/ui, React Query and Docker, Birds of a Feather is a modern forum that brings bird enthusiasts together.",
    year: "2024",
    client: "Personal Project",
    services: "Community, Forum",
    location: "Singapore",
    github: "https://github.com/Benjam11n/Birds-of-a-Feather-frontend",
    texture: "/textures/project/project4.mp4",
    logo: "/projects/project4-logo.png",
    logoStyle: {
      backgroundColor: "#16015c",
      border: "0.2px solid #0c0036",
      boxShadow: "0px 0px 60px 0px #2F6DB54D",
    },
    spotlight: "/assets/spotlight2.png",
    techStack: [
      {
        name: "React",
        colorLight: "#E0F7FA",
        colorDark: "#001b59",
        size: "xl",
        path: "/assets/react.svg",
      },
      {
        name: "Tailwind",
        colorLight: "#E0F2F1",
        colorDark: "#0F766E",
        size: "xl",
        path: "/assets/tailwindcss.png",
      },
      {
        name: "TypeScript",
        colorLight: "#E3F2FD",
        colorDark: "#3178C6",
        size: "xl",
        path: "/assets/typescript.svg",
      },
      {
        name: "PostgreSQL",
        colorLight: "#E3F2FD",
        colorDark: "#2F5E8D",
        size: "lg",
        path: "/assets/pgsql.svg",
      },
      {
        name: "Docker",
        colorLight: "#E1F5FE",
        colorDark: "#1D63ED",
        size: "md",
        path: "/assets/docker.svg",
      },
    ],
    features: [
      "Real-time community discussions",
      "Photo and video sharing for bird sightings",
      "Group creation and management",
      "User profiles with bird watching history",
      "Bird species identification assistance",
    ],
  },
  worldquant: {
    id: "worldquant",
    title: "WorldQuant NUS Alphathon - 4th Place Winner",
    description:
      "WorldQuant NUS Alphathon is a prestigious competition that challenges students to develop quantitative trading strategies.",
    year: "2024",
    client: "WorldQuant",
    services: "Quantitative Finance",
    location: "Singapore",
    texture: "/textures/project/project5.mp4",
    logo: "/projects/project5-logo.png",
    logoStyle: {
      backgroundColor: "#0E1F38",
      border: "0.2px solid #0E2D58",
      boxShadow: "0px 0px 60px 0px #2F67B64D",
    },
    spotlight: "/assets/spotlight4.png",
    techStack: [],
  },
};

export const workExperiences = [
  {
    id: 1,
    name: "TechCloud Private Limited",
    pos: "Full Stack Software Engineer Intern",
    duration: "May 2025 - August 2025",
    title:
      "Architected and developed a comprehensive enterprise CRM system for technology service providers, integrating financial management, work order tracking, domain monitoring, and business analytics into a unified platform serving 20+ clients. Constructed a scalable full-stack application using Next.js 15, TypeScript, Prisma ORM, and PostgreSQL, featuring 40+ interconnected database models, robust authentication, role-based access control, and real-time updates. Implemented Xero accounting integration with bidirectional data synchronisation, automated invoice processing, and webhook-based real-time financial updates, reducing manual data entry by 80%. Developed automated domain monitoring system capable of tracking 200+ domains with domain expiry monitoring and up-time statistics, ensuring 99.9% service availability.",
    icon: "/experiences/experience3-logo.png",
    texture: "/textures/experience/experience3.mp4",
  },
  {
    id: 2,
    name: "WorldQuant BRAIN",
    pos: "Research Consultant",
    duration: "Dec 2024 - Present",
    title:
      "Conduct in-depth quantitative research on diverse datasets and algorithms to identify patterns and opportunities. Devise and hone quantitative models using Fast Expression Language on the BRAIN platform, resulting in greater performances.",
    icon: "/experiences/experience2-logo.png",
    texture: "/textures/experience/experience2.mp4",
  },
  {
    id: 3,
    name: "Computing for Voluntary Welfare Organizations",
    pos: "Full Stack Software Engineer Intern",
    duration: "May 2024 - Aug 2024",
    title:
      "Collaborated in a 10-member cross-functional team to upgrade and scale an enterprise IT management system for Voluntary Welfare Organisations, resulting in boosted operational efficiency and increased service delivery. Refactored a mobile application using the Ionic framework to design a flexible template system, empowering more than 20 volunteer welfare organisations to customise workflows and streamline operations based on specific needs. Designed and created an automated appointment management system with SMS integration, helping over 20 volunteer welfare organisations to reduce missed appointments.",
    icon: "/experiences/experience1-logo.png",
    texture: "/textures/experience/experience1.mp4",
  },
];

export const SECTIONS_DISTANCE = 10;

// Certifications data for the 3D card carousel
export type Certification = {
  name: string;
  organization: string;
  date: string; // e.g. 'Jan 2025'
  image: string; // path under /public
  description: string;
};

export const certifications: Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    organization: "Amazon Web Services (AWS)",
    date: "Nov 2024",
    image: "/projects/project3.png",
    description:
      "Foundational certification validating cloud fluency and understanding of AWS global cloud infrastructure, services, security, and billing models.",
  },
  {
    name: "Meta Front-End Developer",
    organization: "Meta",
    date: "Aug 2024",
    image: "/projects/project1.png",
    description:
      "Hands-on program covering modern front-end development including responsive design, accessibility, React ecosystem, state management, and performance optimization.",
  },
  {
    name: "Google Data Analytics Professional Certificate",
    organization: "Google",
    date: "Jan 2025",
    image: "/projects/project2.png",
    description:
      "Comprehensive training in data analytics workflows: data cleaning, analysis, visualization, and decision-making using SQL, spreadsheets, and dashboards.",
  },
];

export const STACKS = [
  {
    name: "React",
    icon: "/assets/react.svg",
    category: "Frontend",
    colorLight: "#E0F7FA", // Light Cyan
    colorDark: "#001b59", // Dark Blue
  },
  {
    name: "Next.js",
    icon: "/assets/nextjs.svg",
    category: "Framework",
    colorLight: "#F3F4F6", // Gray 100
    colorDark: "#000000", // Black
  },
  {
    name: "TypeScript",
    icon: "/assets/typescript.svg",
    category: "Language",
    colorLight: "#E3F2FD", // Light Blue
    colorDark: "#00273F", // Dark Blue
  },
  {
    name: "Tailwind",
    icon: "/assets/tailwindcss.png",
    category: "Styling",
    colorLight: "#E0F2F1", // Teal 50
    colorDark: "#0B2830", // Dark Teal
  },
  {
    name: "Framer",
    icon: "/assets/framer.png",
    category: "Animation",
    colorLight: "#F3E5F5", // Purple 50
    colorDark: "#180036", // Dark Purple
  },
  {
    name: "MongoDB",
    icon: "/assets/mongodb.svg",
    category: "Database",
    colorLight: "#E8F5E9", // Green 50
    colorDark: "#001E0E", // Dark Green
  },
  {
    name: "PostgreSQL",
    icon: "/assets/pgsql.svg",
    category: "Database",
    colorLight: "#E3F2FD", // Blue 50
    colorDark: "#0E1A2B", // Dark Navy
  },
  {
    name: "Docker",
    icon: "/assets/docker.svg",
    category: "DevOps",
    colorLight: "#E1F5FE", // Light Blue 50
    colorDark: "#0D2C4A", // Dark Blue
  },
  {
    name: "Node.js",
    icon: "/assets/node.svg",
    category: "Backend",
    colorLight: "#F1F8E9", // Light Green
    colorDark: "#162612", // Dark Green
  },
  {
    name: "Python",
    icon: "/assets/python.svg",
    category: "Language",
    colorLight: "#E3F2FD", // Blue 50
    colorDark: "#1E2D3B", // Dark Blue-Grey
  },
];
