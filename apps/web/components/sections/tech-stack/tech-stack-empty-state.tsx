import { motion } from "framer-motion";

interface TechStackEmptyStateProps {
  skipAnimations: boolean;
}

export const TechStackEmptyState = ({
  skipAnimations,
}: TechStackEmptyStateProps) => (
  <motion.p
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full py-8 text-center text-muted-foreground text-sm"
    initial={{
      opacity: skipAnimations ? 1 : 0,
      y: skipAnimations ? 0 : 10,
    }}
    layout
  >
    No technologies found.
  </motion.p>
);
