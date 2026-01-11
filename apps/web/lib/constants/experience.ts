import type { Experience } from "@/lib/types";

export const workExperiences: Experience[] = [
  {
    id: 1,
    name: "Aumovio",
    pos: "AI Web Developer Intern",
    duration: "Jan 2026 - Jun 2026",
    points: [],
    icon: "/experiences/aumovio.png",
  },
  {
    id: 2,
    name: "TechCloud Private Limited",
    pos: "Full Stack Software Engineer Intern",
    duration: "May 2025 - August 2025",
    points: [
      "Architected and developed a comprehensive **enterprise CRM system** for technology service providers, serving **20+ clients**.",
      "Constructed a scalable full-stack application using **Next.js 15, TypeScript, Prisma ORM, and PostgreSQL** with **40+ database models**.",
      "Implemented **Xero accounting integration** with automated invoice processing, reducing manual data entry by **80%**.",
      "Developed automated **domain monitoring system** tracking **200+ domains** with real-time uptime statistics.",
    ],
    icon: "/experiences/techcloud.png",
  },
  {
    id: 3,
    name: "WorldQuant BRAIN",
    pos: "Research Consultant",
    duration: "Dec 2024 - Present",
    points: [
      "Conduct in-depth **quantitative research** on diverse datasets and algorithms to identify patterns and opportunities.",
      "Devise and hone quantitative models using **Fast Expression Language** on the BRAIN platform, resulting in greater performances.",
    ],
    icon: "/experiences/worldquant.png",
  },
  {
    id: 4,
    name: "Computing for Voluntary Welfare Organizations (CVWO)",
    pos: "Full Stack Software Engineer Intern",
    duration: "May 2024 - Aug 2024",
    points: [
      "Collaborated in a **10-member team** to upgrade an enterprise IT management system for Voluntary Welfare Organisations.",
      "Refactored a mobile application using **Ionic framework** to design a flexible template system for **20+ organisations**.",
      "Designed and created an automated **appointment management system** with SMS integration to reduce missed appointments.",
    ],
    icon: "/experiences/cvwo.png",
  },
];
