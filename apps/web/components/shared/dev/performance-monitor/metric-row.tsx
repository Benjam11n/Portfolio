import type { ReactNode } from "react";

interface MetricRowProps {
  label: string;
  value: ReactNode;
  valueClassName: string;
}

export const MetricRow = ({ label, value, valueClassName }: MetricRowProps) => (
  <div className="flex items-center justify-between">
    <span>{label}:</span>
    <span className={valueClassName}>{value}</span>
  </div>
);
