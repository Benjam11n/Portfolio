import fs from "node:fs";
import path from "node:path";

import { CERTIFICATIONS } from "@/lib/constants/certifications";
import { workExperiences } from "@/lib/constants/experience";
import {
  HOMEPAGE_MEDIA_BUDGETS,
  HOMEPAGE_MEDIA_EXTENSIONS,
} from "@/lib/constants/homepage-media-budgets";
import { PROJECTS } from "@/lib/constants/projects";
import type { Certification, Experience, Project } from "@/lib/types";

interface HomepageMediaIssue {
  actualBytes?: number;
  field: string;
  itemId: string;
  limitBytes?: number;
  message: string;
  path?: string;
}

interface HomepageMediaAuditResult {
  issues: HomepageMediaIssue[];
}

interface CheckMediaReferenceOptions {
  field: string;
  itemId: string;
  publicDir: string;
  relativePath?: string;
  rule: {
    bytes: number;
    label: string;
  };
}

interface MediaReference {
  field: string;
  itemId: string;
  relativePath?: string;
  rule: CheckMediaReferenceOptions["rule"];
}

type MediaReferenceFactory<T> = (item: T) => MediaReference[];
type HomepageMediaRule = CheckMediaReferenceOptions["rule"];
type MediaReferenceEntry = [
  field: string,
  relativePath: string | undefined,
  rule: HomepageMediaRule,
];

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

const mediaPathRules = [
  {
    getMessage: (field: string) =>
      `${field} uses GIF media, which is disallowed on homepage`,
    matches: (_field: string, relativePath: string) => isGifPath(relativePath),
  },
  {
    getMessage: (field: string) =>
      `${field} points at full demo video instead of preview media`,
    matches: (field: string, relativePath: string) =>
      field !== "video_overview" && isFullDemoVideoPath(relativePath),
  },
];

const getMediaPathIssues = (
  field: string,
  itemId: string,
  relativePath: string
) =>
  mediaPathRules
    .filter((rule) => rule.matches(field, relativePath))
    .map((rule) =>
      createIssue({
        field,
        itemId,
        message: rule.getMessage(field),
        path: relativePath,
      })
    );

const getSizeIssue = (
  reference: Omit<CheckMediaReferenceOptions, "publicDir">,
  size: number
) =>
  size > reference.rule.bytes
    ? createIssue({
        actualBytes: size,
        field: reference.field,
        itemId: reference.itemId,
        limitBytes: reference.rule.bytes,
        message: `${reference.field} exceeds ${reference.rule.label} budget (${formatSize(size)} > ${formatSize(reference.rule.bytes)})`,
        path: reference.relativePath,
      })
    : null;

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

  const issues = getMediaPathIssues(field, itemId, relativePath);
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

  const sizeIssue = getSizeIssue(
    { field, itemId, relativePath, rule },
    fs.statSync(filePath).size
  );

  return sizeIssue ? [...issues, sizeIssue] : issues;
};

const checkMediaReferences = (
  publicDir: string,
  references: MediaReference[]
) =>
  references.flatMap((reference) =>
    checkMediaReference({ ...reference, publicDir })
  );

const auditItems = <T>(
  items: T[],
  publicDir: string,
  getReferences: MediaReferenceFactory<T>
) =>
  items.flatMap((item) => checkMediaReferences(publicDir, getReferences(item)));

const toMediaReferences = (
  itemId: string,
  entries: MediaReferenceEntry[]
): MediaReference[] =>
  entries.map(([field, relativePath, rule]) => ({
    field,
    itemId,
    relativePath,
    rule,
  }));

const projectMediaReferences: MediaReferenceFactory<Project> = (project) =>
  toMediaReferences(project.id, [
    [
      "hero_image",
      project.hero_image,
      HOMEPAGE_MEDIA_BUDGETS.projects.heroImage,
    ],
    [
      "preview_poster",
      project.preview_poster,
      HOMEPAGE_MEDIA_BUDGETS.projects.previewPoster,
    ],
    [
      "preview_video",
      project.preview_video,
      HOMEPAGE_MEDIA_BUDGETS.projects.previewVideo,
    ],
  ]);

const certificationMediaReferences: MediaReferenceFactory<Certification> = (
  certification
) => [
  {
    field: "image",
    itemId: certification.name,
    relativePath: certification.image,
    rule: HOMEPAGE_MEDIA_BUDGETS.certifications.image,
  },
];

const experienceMediaReferences: MediaReferenceFactory<Experience> = (
  experience
) =>
  toMediaReferences(experience.name, [
    ["icon", experience.icon, HOMEPAGE_MEDIA_BUDGETS.experiences.image],
    [
      "preview_video",
      experience.preview_video,
      HOMEPAGE_MEDIA_BUDGETS.experiences.previewVideo,
    ],
    [
      "preview_poster",
      experience.preview_poster,
      HOMEPAGE_MEDIA_BUDGETS.experiences.poster,
    ],
  ]);

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
      ...checkMediaReferences(publicDir, projectMediaReferences(project))
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

  issues.push(
    ...auditItems(certifications, publicDir, certificationMediaReferences),
    ...auditItems(experiences, publicDir, experienceMediaReferences)
  );

  return { issues };
};
