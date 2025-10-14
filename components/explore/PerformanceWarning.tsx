interface PerformanceWarningProps {
  onSwitch: () => void;
  onDismiss: () => void;
}

const PerformanceWarning: React.FC<PerformanceWarningProps> = ({ onSwitch, onDismiss }) => {
  const handleDismiss = () => {
    // Store timestamp when user clicked "Stay Here"
    localStorage.setItem('performanceWarningDismissed', Date.now().toString());
    onDismiss();
  };

  return (
    <div className="fixed inset-x-4 top-4 z-50 max-w-sm rounded-lg border border-border bg-background/80 p-4 shadow-lg backdrop-blur-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500"></div>
          <p className="font-medium text-foreground">Performance Warning</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Your device might struggle with 3D view. Consider switching to list mode for a better
          experience.
        </p>
        <div className="mt-2 flex justify-end gap-3">
          <button
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            onClick={handleDismiss}
          >
            Stay Here
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={onSwitch}
          >
            Switch to List View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceWarning;
