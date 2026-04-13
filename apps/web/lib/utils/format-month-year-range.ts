import type { Month, MonthYear } from "@/lib/types";

const MONTH_LABELS: Record<Month, string> = {
  1: "Jan",
  10: "Oct",
  11: "Nov",
  12: "Dec",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
};

export const formatMonthYear = ({ month, year }: MonthYear) =>
  `${MONTH_LABELS[month]} ${year}`;

export const formatMonthYearRange = ({
  end,
  start,
}: {
  end?: MonthYear;
  start: MonthYear;
}) => `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : "Present"}`;
