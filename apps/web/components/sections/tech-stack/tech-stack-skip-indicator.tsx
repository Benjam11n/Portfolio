interface TechStackSkipIndicatorProps {
  visible: boolean;
}

export const TechStackSkipIndicator = ({
  visible,
}: TechStackSkipIndicatorProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="fade-in animate-in text-muted-foreground text-sm opacity-0 duration-300">
      Animations skipped
    </div>
  );
};
