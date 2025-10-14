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
    <div className="border-border bg-background/80 fixed inset-x-4 top-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg backdrop-blur-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500"></div>
          <p className="text-foreground font-medium">Performance Warning</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Your device might struggle with 3D view. Consider switching to list mode for a better
          experience.
        </p>
        <div className="mt-2 flex justify-end gap-3">
          <button
            className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm transition-colors"
            onClick={handleDismiss}
          >
            Stay Here
          </button>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm transition-colors"
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
