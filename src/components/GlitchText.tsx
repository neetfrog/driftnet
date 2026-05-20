import { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?";

interface GlitchTextProps {
  text: string;
  className?: string;
  active?: boolean;
}

export default function GlitchText({ text, className = "", active = true }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }

    frameRef.current = 0;
    const totalFrames = 20;

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;

      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            const revealThreshold = i / text.length;
            if (progress >= revealThreshold + 0.1) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (frameRef.current >= totalFrames + text.length) {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, active]);

  return <span className={className}>{displayText}</span>;
}
