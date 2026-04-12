import fs from "node:fs";
import path from "node:path";

import { CERTIFICATIONS } from "../constants/certifications";
import { workExperiences } from "../constants/experience";
import {
  HOMEPAGE_MEDIA_BUDGETS,
  HOMEPAGE_MEDIA_EXTENSIONS,
} from "../constants/homepage-media-budgets";
import type { HomepageMediaRule } from "../constants/homepage-media-budgets";
import { PROJECTS } from "../constants/projects";
import type { Certification, Experience, Project } from "../types";

export interface HomepageMediaIssue {
  actualBytes?: number;
  field: string;
  itemId: string;
  limitBytes?: number;
  message: string;
  path?: string;
}

export interface HomepageMediaAuditResult {
  issues: HomepageMediaIssue[];
}

interface CheckMediaReferenceOptions {
  field: string;
  itemId: string;
  publicDir: string;
  relativePath?: string;
  rule: HomepageMediaRule;
}

const isGifPath = (value: string) =>
  value.toLowerCase().endsWith(HOMEPAGE_MEDIA_EXTENSIONS.gif);

const isFullDemoVideoPath = (value: string) =>
  value.toLowerCase().endsWith(HOMEPAGE_MEDIA_EXTENSIONS.fullDemoVideo);

const isPreviewVideoPath = (value: string) =>
  value.toLowerCase().endsWith(HOMEPAGE_MEDIA_EXTENSIONS.previewVideo);

const toPublicFilePath = (publicDir: string, assetPath: string) =>
  path.join(publicDir, assetPath.replace(/^\/+/, ""));

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

const createIssue = (issue: HomepageMediaIssue): HomepageMediaIssue => issue;

const checkMediaReference = ({
  field,
  itemId,
  publicDir,
  relativePath,
  rule,
}: CheckMediaReferenceOptions): HomepageMediaIssue[] => {
  if (!relativePath) {
    return [];
  }

  const issues: HomepageMediaIssue[] = [];

  if (isGifPath(relativePath)) {
    issues.push(
      createIssue({
        field,
        itemId,
        message: `${field} uses GIF media, which is disallowed on homepage`,
        path: relativePath,
      })
    );
  }

  if (field !== "video_overview" && isFullDemoVideoPath(relativePath)) {
    issues.push(
      createIssue({
        field,
        itemId,
        message: `${field} points at full demo video instead of preview media`,
        path: relativePath,
      })
    );
  }

  const filePath = toPublicFilePath(publicDir, relativePath);
  if (!fs.existsSync(filePath)) {
    issues.push(
      createIssue({
        field,
        itemId,
        message: `${field} points at missing file`,
        path: relativePath,
      })
    );
    return issues;
  }

  const stats = fs.statSync(filePath);
  if (stats.size > rule.bytes) {
    issues.push(
      createIssue({
        actualBytes: stats.size,
        field,
        itemId,
        limitBytes: rule.bytes,
        message: `${field} exceeds ${rule.label} budget (${formatSize(stats.size)} > ${formatSize(rule.bytes)})`,
        path: relativePath,
      })
    );
  }

  return issues;
};

export const auditHomepageMedia = ({
  certifications = CERTIFICATIONS,
  experiences = workExperiences,
  projects = PROJECTS,
  publicDir,
}: {
  certifications?: Certification[];
  experiences?: Experience[];
  publicDir: string;
  projects?: Project[];
}): HomepageMediaAuditResult => {
  const issues: HomepageMediaIssue[] = [];

  for (const project of projects) {
    if (project.preview_video && !isPreviewVideoPath(project.preview_video)) {
      issues.push(
        createIssue({
          field: "preview_video",
          itemId: project.id,
          message: "preview_video must point at preview.mp4",
          path: project.preview_video,
        })
      );
    }

    issues.push(
      ...checkMediaReference({
        field: "hero_image",
        itemId: project.id,
        publicDir,
        relativePath: project.hero_image,
        rule: HOMEPAGE_MEDIA_BUDGETS.projects.heroImage,
      }),
      ...checkMediaReference({
        field: "preview_poster",
        itemId: project.id,
        publicDir,
        relativePath: project.preview_poster,
        rule: HOMEPAGE_MEDIA_BUDGETS.projects.previewPoster,
      }),
      ...checkMediaReference({
        field: "preview_video",
        itemId: project.id,
        publicDir,
        relativePath: project.preview_video,
        rule: HOMEPAGE_MEDIA_BUDGETS.projects.previewVideo,
      })
    );

    if (project.video_overview && isGifPath(project.video_overview)) {
      issues.push(
        createIssue({
          field: "video_overview",
          itemId: project.id,
          message: "video_overview must not be a GIF",
          path: project.video_overview,
        })
      );
    }
  }

  for (const certification of certifications) {
    issues.push(
      ...checkMediaReference({
        field: "image",
        itemId: certification.name,
        publicDir,
        relativePath: certification.image,
        rule: HOMEPAGE_MEDIA_BUDGETS.certifications.image,
      })
    );
  }

  for (const experience of experiences) {
    issues.push(
      ...checkMediaReference({
        field: "icon",
        itemId: experience.name,
        publicDir,
        relativePath: experience.icon,
        rule: HOMEPAGE_MEDIA_BUDGETS.experiences.image,
      })
    );

    if (experience.preview_video) {
      issues.push(
        ...checkMediaReference({
          field: "preview_video",
          itemId: experience.name,
          publicDir,
          relativePath: experience.preview_video,
          rule: HOMEPAGE_MEDIA_BUDGETS.experiences.previewVideo,
        })
      );
    }

    if (experience.preview_poster) {
      issues.push(
        ...checkMediaReference({
          field: "preview_poster",
          itemId: experience.name,
          publicDir,
          relativePath: experience.preview_poster,
          rule: HOMEPAGE_MEDIA_BUDGETS.experiences.poster,
        })
      );
    }
  }

  return { issues };
};
