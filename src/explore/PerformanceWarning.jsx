const PerformanceWarning = ({ onSwitch, onDismiss }) => {
  const handleDismiss = () => {
    // Store timestamp when user clicked "Stay Here"
    localStorage.setItem('performanceWarningDismissed', Date.now().toString());
    onDismiss();
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-black-200 border border-black-300 rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <p className="text-white font-medium">Performance Warning</p>
        </div>

        <p className="text-gray-400 text-sm">
          Your device might struggle with 3D view. Consider switching to list
          mode for better experience.
        </p>

        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 text-sm rounded-lg border border-black-300 hover:bg-black-300 transition-colors text-white"
            onClick={handleDismiss}
          >
            Stay Here
          </button>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-white-800 hover:bg-white-700 transition-colors text-black"
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
