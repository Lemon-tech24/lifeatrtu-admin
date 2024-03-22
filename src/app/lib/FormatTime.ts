export function formatTimeDays(time: number) {
  const millisecondsPerSecond = 1000;
  const secondsPerMinute = 60;
  const minutesPerHour = 60;
  const hoursPerDay = 24;

  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(time / millisecondsPerSecond);

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(
    totalSeconds / (hoursPerDay * minutesPerHour * secondsPerMinute),
  );
  const hours = Math.floor(
    (totalSeconds % (hoursPerDay * minutesPerHour * secondsPerMinute)) /
      (minutesPerHour * secondsPerMinute),
  );
  const minutes = Math.floor(
    (totalSeconds % (minutesPerHour * secondsPerMinute)) / secondsPerMinute,
  );
  const seconds = totalSeconds % secondsPerMinute;

  // Construct formatted time string
  const formattedTime = [];

  if (days > 0) {
    formattedTime.push(`${days} days`);
  }

  formattedTime.push(` ${hours.toString().padStart(2, "0")} hr's`);
  formattedTime.push(` ${minutes.toString().padStart(2, "0")} min's`);
  formattedTime.push(` ${seconds.toString().padStart(2, "0")} sec's`);

  return formattedTime.join(" ");
}

export const getRemainingTime = (startingTime: any, days: number) => {
  const currentTime = Math.floor(Date.now() / 1000);

  const remaining = Math.max(
    0,
    Math.floor(startingTime + days * 60 * 60 * 1000 - currentTime),
  );

  return remaining;
};
