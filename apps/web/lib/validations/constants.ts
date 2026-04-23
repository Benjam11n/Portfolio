import { z } from "zod";

import { TECH_IDS } from "@/lib/types";
import type { Month } from "@/lib/types";

// Certification validation schema
const certificationSchema = z.object({
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(1000, "Description must be at most 1000 characters"),
  image: z
    .string()
    .min(1, "Image path must be at least 1 character")
    .max(500, "Image path must be at most 500 characters"),
  issuedAt: z.object({
    month: z.custom<Month>(
      (value) =>
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 12,
      "Month must be an integer from 1 to 12"
    ),
    year: z.number().int().min(1900).max(3000),
  }),
  name: z
    .string()
    .min(1, "Certification name must be at least 1 character")
    .max(300, "Certification name must be at most 300 characters"),
  organization: z
    .string()
    .min(1, "Organization must be at least 1 character")
    .max(300, "Organization must be at most 300 characters"),
});

// Experience validation schema
const monthYearSchema = z.object({
  month: z.custom<Month>(
    (value) =>
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 12,
    "Month must be an integer from 1 to 12"
  ),
  year: z.number().int().min(1900).max(3000),
});

const experienceSchema = z.object({
  endDate: monthYearSchema.optional(),
  icon: z
    .string()
    .min(1, "Icon path must be at least 1 character")
    .max(500, "Icon path must be at most 500 characters"),
  iconBackgroundColor: z
    .string()
    .max(50, "Icon background color must be at most 50 characters")
    .optional(),
  iconScale: z
    .number()
    .positive("Icon scale must be positive")
    .max(5, "Icon scale must be at most 5")
    .optional(),
  id: z.number().int("ID must be an integer"),
  name: z
    .string()
    .min(1, "Company name must be at least 1 character")
    .max(300, "Company name must be at most 300 characters"),
  points: z.array(
    z
      .string()
      .min(1, "Point must be at least 1 character")
      .max(1000, "Point must be at most 1000 characters")
  ),
  pos: z
    .string()
    .min(1, "Position must be at least 1 character")
    .max(300, "Position must be at most 300 characters"),
  preview_poster: z
    .string()
    .max(500, "Preview poster path must be at most 500 characters")
    .optional(),
  preview_video: z
    .string()
    .max(500, "Preview video path must be at most 500 characters")
    .optional(),
  startDate: monthYearSchema,
});

// Project validation schema
const projectSchema = z.object({
  client: z
    .string()
    .min(1, "Client must be at least 1 character")
    .max(300, "Client must be at most 300 characters"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(2000, "Description must be at most 2000 characters"),
  features: z
    .array(
      z
        .string()
        .min(1, "Feature must be at least 1 character")
        .max(500, "Feature must be at most 500 characters")
    )
    .optional(),
  github: z
    .string()
    .max(1000, "GitHub must be at most 1000 characters")
    .optional(),
  hero_image: z
    .string()
    .max(500, "Hero image path must be at most 500 characters")
    .optional(),
  href: z.string().max(1000, "Href must be at most 1000 characters").optional(),
  id: z
    .string()
    .min(1, "Project ID must be at least 1 character")
    .max(100, "Project ID must be at most 100 characters"),
  location: z
    .string()
    .min(1, "Location must be at least 1 character")
    .max(300, "Location must be at most 300 characters"),
  logo: z
    .string()
    .min(1, "Logo path must be at least 1 character")
    .max(500, "Logo path must be at most 500 characters"),
  logoStyle: z
    .object({
      backgroundColor: z.string().max(100).optional(),
      colorDark: z.string().max(100).optional(),
      colorLight: z.string().max(100).optional(),
    })
    .optional(),
  preview_poster: z
    .string()
    .max(500, "Preview poster path must be at most 500 characters")
    .optional(),
  preview_video: z
    .string()
    .max(500, "Preview video path must be at most 500 characters")
    .optional(),
  services: z
    .string()
    .min(1, "Services must be at least 1 character")
    .max(300, "Services must be at most 300 characters"),
  status: z.enum(["completed", "in-development", "planned"]).optional(),
  subdesc: z
    .string()
    .max(5000, "Subdescription must be at most 5000 characters")
    .optional(),
  techStack: z.array(z.enum(TECH_IDS)),
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(300, "Title must be at most 300 characters"),
  video_overview: z
    .string()
    .max(500, "Video overview path must be at most 500 characters")
    .optional(),
  year: z.number().int().min(1900).max(3000),
});

export const certificationsArraySchema = z.array(certificationSchema);
export const experiencesArraySchema = z.array(experienceSchema);
export const projectsArraySchema = z.array(projectSchema);

// Company validation schema
