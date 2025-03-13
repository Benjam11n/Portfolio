interface PerformanceWarningProps {
  onSwitch: () => void;
  onDismiss: () => void;
}

const PerformanceWarning: React.FC<PerformanceWarningProps> = ({
  onSwitch,
  onDismiss,
}) => {
  const handleDismiss = () => {
    // Store timestamp when user clicked "Stay Here"
    localStorage.setItem('performanceWarningDismissed', Date.now().toString());
    onDismiss();
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-lg border border-border rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <p className="text-foreground font-medium">Performance Warning</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Your device might struggle with 3D view. Consider switching to list
          mode for a better experience.
        </p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
            onClick={handleDismiss}
          >
            Stay Here
          </button>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-primary hover:bg-primary/90 transition-colors text-primary-foreground"
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
