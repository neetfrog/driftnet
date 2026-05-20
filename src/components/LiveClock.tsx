import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const is3AMRange = hours >= 0 && hours < 5;

  const formatted = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <span
      className={`text-xs font-mono tabular-nums transition-colors duration-1000
        ${is3AMRange ? "text-indigo-600" : "text-slate-700"}
      `}
    >
      {formatted}
    </span>
  );
}
