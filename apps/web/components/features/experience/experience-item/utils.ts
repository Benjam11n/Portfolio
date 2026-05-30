import type { Experience } from "@/lib/types";
import { formatMonthYearRange } from "@/lib/utils/format-month-year-range";

export const getExperienceAriaIds = (id: Experience["id"]) => ({
  contentId: `experience-content-${id}`,
  headingId: `experience-heading-${id}`,
});

export const getExperienceDurationLabel = (item: Experience) =>
  formatMonthYearRange({
    end: item.endDate,
    start: item.startDate,
  });
