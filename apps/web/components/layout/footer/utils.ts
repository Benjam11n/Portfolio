export const formatFooterTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    timeZoneName: "short",
  });

export const getNextMinuteDelay = (date: Date) =>
  Math.max((60 - date.getSeconds()) * 1000 - date.getMilliseconds(), 1000);
