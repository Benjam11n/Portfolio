export const getStatusColor = (fpsValue: number) => {
  if (fpsValue < 30) {
    return "text-red-500";
  }

  if (fpsValue < 50) {
    return "text-yellow-500";
  }

  return "text-green-500";
};

export const getThemeClasses = (theme?: string) => {
  if (theme === "dark") {
    return {
      background: "bg-black/80 backdrop-blur-sm",
      bar: "bg-gray-700",
      label: "text-gray-400",
      text: "text-gray-200",
    };
  }

  return {
    background: "bg-white/80 backdrop-blur-sm",
    bar: "bg-gray-300",
    label: "text-gray-600",
    text: "text-gray-800",
  };
};
