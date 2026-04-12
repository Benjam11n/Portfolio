export interface HomepageMediaRule {
  bytes: number;
  label: string;
}

export interface HomepageRouteBudget {
  homepageMediaBytes: number;
  maxGifRequests: number;
  maxFullDemoVideoRequests: number;
  maxPreviewVideoRequests: number;
}

export interface HomepageMediaBudgets {
  certifications: {
    image: HomepageMediaRule;
  };
  experiences: {
    image: HomepageMediaRule;
    poster: HomepageMediaRule;
    previewVideo: HomepageMediaRule;
  };
  projects: {
    heroImage: HomepageMediaRule;
    previewPoster: HomepageMediaRule;
    previewVideo: HomepageMediaRule;
  };
  route: HomepageRouteBudget;
}

const KB = 1024;
const MB = KB * 1024;

export const HOMEPAGE_MEDIA_BUDGETS: HomepageMediaBudgets = {
  certifications: {
    image: {
      bytes: 225 * KB,
      label: "Certification image",
    },
  },
  experiences: {
    image: {
      bytes: 175 * KB,
      label: "Experience image",
    },
    poster: {
      bytes: 175 * KB,
      label: "Experience poster",
    },
    previewVideo: {
      bytes: 60 * KB,
      label: "Experience preview video",
    },
  },
  projects: {
    heroImage: {
      bytes: 300 * KB,
      label: "Project hero image",
    },
    previewPoster: {
      bytes: 30 * KB,
      label: "Project preview poster",
    },
    previewVideo: {
      bytes: 60 * KB,
      label: "Project preview video",
    },
  },
  route: {
    homepageMediaBytes: 2 * MB,
    maxFullDemoVideoRequests: 0,
    maxGifRequests: 0,
    maxPreviewVideoRequests: 0,
  },
};

export const HOMEPAGE_MEDIA_EXTENSIONS = {
  fullDemoVideo: "video.mp4",
  gif: ".gif",
  previewVideo: "preview.mp4",
} as const;
