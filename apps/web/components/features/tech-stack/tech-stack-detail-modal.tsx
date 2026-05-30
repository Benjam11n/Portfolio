"use client";

import dynamic from "next/dynamic";

import type { TechStackItemData } from "@/components/features/tech-stack/constants";

const DynamicTechDetailModal = dynamic(
  async () => {
    const mod =
      await import("@/components/features/tech-stack/tech-detail-modal");
    return mod.TechDetailModal;
  },
  {
    loading: () => null,
    ssr: false,
  }
);

interface TechStackDetailModalProps {
  selectedTech: TechStackItemData | null;
  onClose: () => void;
}

export const TechStackDetailModal = ({
  selectedTech,
  onClose,
}: TechStackDetailModalProps) => {
  if (!selectedTech) {
    return null;
  }

  return (
    <DynamicTechDetailModal
      isOpen={true}
      onClose={onClose}
      tech={selectedTech}
    />
  );
};
