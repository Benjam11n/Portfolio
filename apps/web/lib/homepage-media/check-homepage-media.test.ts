import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { workExperiences } from "../constants/experience";
import { PROJECTS } from "../constants/projects";
import { auditHomepageMedia } from "./check-homepage-media";

const tempDirs: string[] = [];

const writeFileOfSize = (
  baseDir: string,
  relativePath: string,
  size: number
) => {
  const filePath = path.join(baseDir, relativePath.replace(/^\/+/, ""));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.alloc(size, 1));
};

const createPublicDir = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homepage-media-"));
  tempDirs.push(tempDir);
  return tempDir;
};

const seedValidHomepageMedia = (publicDir: string) => {
  writeFileOfSize(publicDir, "/projects/zucchini/hero.png", 70_000);
  writeFileOfSize(publicDir, "/projects/zucchini/preview-poster.jpg", 18_000);
  writeFileOfSize(publicDir, "/projects/zucchini/preview.mp4", 33_000);
  writeFileOfSize(publicDir, "/projects/disknee/hero.png", 58_000);
  writeFileOfSize(publicDir, "/projects/disknee/preview-poster.jpg", 20_000);
  writeFileOfSize(publicDir, "/projects/disknee/preview.mp4", 25_000);
  writeFileOfSize(publicDir, "/projects/twinAI/hero.png", 271_000);
  writeFileOfSize(publicDir, "/projects/twinAI/preview-poster.jpg", 22_000);
  writeFileOfSize(publicDir, "/projects/twinAI/preview.mp4", 53_000);
  writeFileOfSize(publicDir, "/projects/chip/hero.png", 152_000);
  writeFileOfSize(publicDir, "/projects/chip/preview-poster.jpg", 13_000);
  writeFileOfSize(publicDir, "/projects/chip/preview.mp4", 17_000);
  writeFileOfSize(publicDir, "/projects/worldquant/hero.png", 98_000);
  writeFileOfSize(publicDir, "/projects/worldquant/preview-poster.jpg", 28_000);
  writeFileOfSize(publicDir, "/projects/worldquant/preview.mp4", 36_000);
  writeFileOfSize(publicDir, "/projects/birds-of-a-feather/hero.png", 160_000);
  writeFileOfSize(
    publicDir,
    "/projects/birds-of-a-feather/preview-poster.jpg",
    8000
  );
  writeFileOfSize(
    publicDir,
    "/projects/birds-of-a-feather/preview.mp4",
    10_000
  );
  writeFileOfSize(publicDir, "/certifications/rag-agentic-ai.avif", 40_000);
  writeFileOfSize(
    publicDir,
    "/certifications/deep-learning-specialization.png",
    126_000
  );
  writeFileOfSize(publicDir, "/certifications/docker-kubernetes.png", 200_000);
  writeFileOfSize(
    publicDir,
    "/certifications/pytorch-deep-learning.png",
    190_000
  );
  writeFileOfSize(publicDir, "/certifications/machine-learning.avif", 33_000);
  writeFileOfSize(publicDir, "/certifications/react-ultimate.png", 217_000);
  writeFileOfSize(publicDir, "/experiences/govtech-preview.mp4", 22_000);
  writeFileOfSize(publicDir, "/experiences/govtech-preview-poster.jpg", 18_000);
  writeFileOfSize(publicDir, "/experiences/aumovio.png", 4000);
  writeFileOfSize(publicDir, "/experiences/techcloud.png", 44_000);
  writeFileOfSize(publicDir, "/experiences/worldquant.png", 151_000);
  writeFileOfSize(publicDir, "/experiences/cvwo.png", 78_000);
};

describe(auditHomepageMedia, () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { force: true, recursive: true });
    }
  });

  it("passes for valid homepage media", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);

    const result = auditHomepageMedia({ publicDir });

    expect(result.issues).toStrictEqual([]);
  });

  it("fails oversized preview video", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    writeFileOfSize(publicDir, "/projects/chip/preview.mp4", 70_000);

    const result = auditHomepageMedia({ publicDir });

    expect(
      result.issues.some(
        (issue) => issue.itemId === "chip" && issue.field === "preview_video"
      )
    ).toBeTruthy();
  });

  it("fails oversized poster", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    writeFileOfSize(
      publicDir,
      "/projects/worldquant/preview-poster.jpg",
      40_000
    );

    const result = auditHomepageMedia({ publicDir });

    expect(
      result.issues.some(
        (issue) =>
          issue.itemId === "worldquant" && issue.field === "preview_poster"
      )
    ).toBeTruthy();
  });

  it("fails oversized hero image", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    writeFileOfSize(publicDir, "/projects/twinAI/hero.png", 400_000);

    const result = auditHomepageMedia({ publicDir });

    expect(
      result.issues.some(
        (issue) => issue.itemId === "twinAI" && issue.field === "hero_image"
      )
    ).toBeTruthy();
  });

  it("fails when preview points at full demo video", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    writeFileOfSize(publicDir, "/projects/chip/video.mp4", 10_000);
    const projects = PROJECTS.map((project) =>
      project.id === "chip"
        ? { ...project, preview_video: "/projects/chip/video.mp4" }
        : project
    );

    const result = auditHomepageMedia({ projects, publicDir });

    expect(
      result.issues.some(
        (issue) => issue.itemId === "chip" && issue.field === "preview_video"
      )
    ).toBeTruthy();
  });

  it("fails homepage GIF reference", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    writeFileOfSize(publicDir, "/projects/zucchini/hero.gif", 10_000);
    const projects = PROJECTS.map((project) =>
      project.id === "zucchini"
        ? { ...project, hero_image: "/projects/zucchini/hero.gif" }
        : project
    );

    const result = auditHomepageMedia({
      projects,
      publicDir,
    });

    expect(
      result.issues.some((issue) => issue.path?.endsWith(".gif"))
    ).toBeTruthy();
  });

  it("fails missing file", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    fs.rmSync(path.join(publicDir, "projects/disknee/preview.mp4"));

    const result = auditHomepageMedia({ publicDir });

    expect(
      result.issues.some(
        (issue) =>
          issue.itemId === "disknee" && issue.message.includes("missing")
      )
    ).toBeTruthy();
  });

  it("fails experience video without poster fallback", () => {
    const publicDir = createPublicDir();
    seedValidHomepageMedia(publicDir);
    const experiences = workExperiences.map((experience) =>
      experience.name === "GovTech"
        ? { ...experience, preview_poster: undefined }
        : experience
    );

    const result = auditHomepageMedia({ experiences, publicDir });

    expect(
      result.issues.some(
        (issue) =>
          issue.itemId === "GovTech" && issue.field === "preview_poster"
      )
    ).toBeTruthy();
  });
});
