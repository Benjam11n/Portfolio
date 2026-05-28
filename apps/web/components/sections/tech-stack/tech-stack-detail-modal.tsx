"use client";

import dynamic from "next/dynamic";

import type { TechStackItemData } from "@/components/sections/tech-stack/types";

const DynamicTechDetailModal = dynamic(
  async () => {
    const mod = await import("@/components/modals/tech-detail-modal");
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
