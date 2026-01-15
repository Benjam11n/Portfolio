import { z } from "zod";

// TechCategory enum from types
export const techCategorySchema = z.enum([
  "AI/ML",
  "Animation",
  "Mobile",
  "Framework",
  "Backend",
  "Frontend",
  "Styling",
  "Language",
  "Database",
  "DevOps",
]);

// TechStack validation schema
export const techStackSchema = z.object({
  name: z
    .string()
    .min(1, "Tech stack name must be at least 1 character")
    .max(100, "Tech stack name must be at most 100 characters"),
  icon: z
    .string()
    .min(1, "Icon path must be at least 1 character")
    .max(500, "Icon path must be at most 500 characters"),
  category: techCategorySchema,
  colorLight: z
    .string()
    .min(1, "Color light must be at least 1 character")
    .max(50, "Color light must be at most 50 characters"),
  colorDark: z
    .string()
    .min(1, "Color dark must be at least 1 character")
    .max(50, "Color dark must be at most 50 characters"),
});

// Certification validation schema
export const certificationSchema = z.object({
  name: z
    .string()
    .min(1, "Certification name must be at least 1 character")
    .max(300, "Certification name must be at most 300 characters"),
  organization: z
    .string()
    .min(1, "Organization must be at least 1 character")
    .max(300, "Organization must be at most 300 characters"),
  date: z
    .string()
    .min(1, "Date must be at least 1 character")
    .max(50, "Date must be at most 50 characters"),
  image: z
    .string()
    .min(1, "Image path must be at least 1 character")
    .max(500, "Image path must be at most 500 characters"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(1000, "Description must be at most 1000 characters"),
});

// Experience validation schema
export const experienceSchema = z.object({
  id: z.number().int("ID must be an integer"),
  name: z
    .string()
    .min(1, "Company name must be at least 1 character")
    .max(300, "Company name must be at most 300 characters"),
  pos: z
    .string()
    .min(1, "Position must be at least 1 character")
    .max(300, "Position must be at most 300 characters"),
  duration: z
    .string()
    .min(1, "Duration must be at least 1 character")
    .max(100, "Duration must be at most 100 characters"),
  points: z.array(
    z
      .string()
      .min(1, "Point must be at least 1 character")
      .max(1000, "Point must be at most 1000 characters")
  ),
  icon: z
    .string()
    .min(1, "Icon path must be at least 1 character")
    .max(500, "Icon path must be at most 500 characters"),
});

// Project validation schema
export const projectSchema = z.object({
  id: z
    .string()
    .min(1, "Project ID must be at least 1 character")
    .max(100, "Project ID must be at most 100 characters"),
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(300, "Title must be at most 300 characters"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(2000, "Description must be at most 2000 characters"),
  subdesc: z
    .string()
    .max(5000, "Subdescription must be at most 5000 characters")
    .optional(),
  year: z
    .string()
    .min(1, "Year must be at least 1 character")
    .max(10, "Year must be at most 10 characters"),
  client: z
    .string()
    .min(1, "Client must be at least 1 character")
    .max(300, "Client must be at most 300 characters"),
  services: z
    .string()
    .min(1, "Services must be at least 1 character")
    .max(300, "Services must be at most 300 characters"),
  location: z
    .string()
    .min(1, "Location must be at least 1 character")
    .max(300, "Location must be at most 300 characters"),
  status: z.enum(["completed", "in-development", "planned"]).optional(),
  href: z.string().max(1000, "Href must be at most 1000 characters").optional(),
  link: z.string().max(1000, "Link must be at most 1000 characters").optional(),
  github: z
    .string()
    .max(1000, "GitHub must be at most 1000 characters")
    .optional(),
  video_overview: z
    .string()
    .max(500, "Video overview path must be at most 500 characters")
    .optional(),
  hero_image: z
    .string()
    .max(500, "Hero image path must be at most 500 characters")
    .optional(),
  logo: z
    .string()
    .min(1, "Logo path must be at least 1 character")
    .max(500, "Logo path must be at most 500 characters"),
  logoStyle: z.record(z.unknown()).optional(),
  techStack: z.array(
    z
      .string()
      .min(1, "Tech stack item must be at least 1 character")
      .max(100, "Tech stack item must be at most 100 characters")
  ),
  features: z
    .array(
      z
        .string()
        .min(1, "Feature must be at least 1 character")
        .max(500, "Feature must be at most 500 characters")
    )
    .optional(),
});

export const techStackArraySchema = z.array(techStackSchema);
export const certificationsArraySchema = z.array(certificationSchema);
export const experiencesArraySchema = z.array(experienceSchema);
export const projectsArraySchema = z.array(projectSchema);
