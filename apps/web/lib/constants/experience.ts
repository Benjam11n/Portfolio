import type { Experience } from "@/lib/types";
import { experiencesArraySchema } from "@/lib/validations/constants";

const rawWorkExperiences: Experience[] = [
  {
    endDate: { month: 12, year: 2026 },
    icon: "/experiences/govtech-preview.mp4",
    iconBackgroundColor: "#fff",
    iconScale: 1.5,
    id: 5,
    name: "GovTech",
    points: [],
    pos: "Incoming Software Engineer Intern",
    preview_video: "/experiences/govtech-preview.mp4",
    startDate: { month: 6, year: 2026 },
  },
  {
    icon: "/experiences/aumovio.png",
    iconBackgroundColor: "#fff",
    iconScale: 1.5,
    id: 1,
    name: "Aumovio",
    points: [
      "Provisioned the project's **PostgreSQL database** using **Docker**, establishing a reproducible local development and deployment setup.",
      "Set up **LiteLLM middleware** for **LLM cost tracking**, giving the team clearer visibility into model usage and spend across the application.",
      "Improved a key part of the application workflow, increasing **evaluation results by more than 30%** through iterative optimization and testing.",
    ],
    pos: "AI Web Developer Intern",
    startDate: { month: 1, year: 2026 },
  },
  {
    endDate: { month: 8, year: 2025 },
    icon: "/experiences/techcloud.png",
    iconBackgroundColor: "#fff",
    id: 2,
    name: "TechCloud Private Limited",
    points: [
      "Architected and developed a comprehensive **enterprise CRM system** for technology service providers, serving **20+ clients**.",
      "Constructed a scalable full-stack application using **Next.js 15, TypeScript, Prisma ORM, and PostgreSQL** with **40+ database models**.",
      "Implemented **Xero accounting integration** with automated invoice processing, reducing manual data entry by **80%**.",
      "Developed automated **domain monitoring system** tracking **200+ domains** with real-time uptime statistics.",
    ],
    pos: "Full Stack Software Engineer Intern",
    startDate: { month: 5, year: 2025 },
  },
  {
    icon: "/experiences/worldquant.png",
    iconBackgroundColor: "#fff",
    id: 3,
    name: "WorldQuant BRAIN",
    points: [
      "Conduct in-depth **quantitative research** on diverse datasets and algorithms to identify patterns and opportunities.",
      "Devise and hone quantitative models using **Fast Expression Language** on the BRAIN platform, resulting in greater performances.",
    ],
    pos: "Research Consultant",
    startDate: { month: 12, year: 2024 },
  },
  {
    endDate: { month: 8, year: 2024 },
    icon: "/experiences/cvwo.png",
    iconBackgroundColor: "#fff7d6",
    iconScale: 1.5,
    id: 4,
    name: "Computing for Voluntary Welfare Organizations (CVWO)",
    points: [
      "Collaborated in a **10-member team** to upgrade an enterprise IT management system for Voluntary Welfare Organisations.",
      "Refactored a mobile application using **Ionic framework** to design a flexible template system for **20+ organisations**.",
      "Designed and created an automated **appointment management system** with SMS integration to reduce missed appointments.",
    ],
    pos: "Full Stack Software Engineer Intern",
    startDate: { month: 5, year: 2024 },
  },
];

const validatedWorkExperiences =
  experiencesArraySchema.parse(rawWorkExperiences);

export const workExperiences: Experience[] = validatedWorkExperiences;
