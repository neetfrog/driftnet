import { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";

interface DriftButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  label?: string;
}

export default function DriftButton({ onClick, isLoading = false, label = "Drift" }: DriftButtonProps) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    onClick();
  };

  useEffect(() => {
    if (ripple) {
      const t = setTimeout(() => setRipple(false), 600);
      return () => clearTimeout(t);
    }
  }, [ripple]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative overflow-hidden group
        flex items-center gap-3 px-8 py-4 rounded-2xl
        bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700
        hover:from-violet-500 hover:via-violet-600 hover:to-fuchsia-600
        border border-violet-500/40 hover:border-violet-400/60
        text-white font-bold text-lg
        shadow-lg shadow-violet-900/40 hover:shadow-violet-800/60
        transition-all duration-300 hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      `}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      </div>

      {/* Ripple */}
      {ripple && (
        <span className="absolute inset-0 rounded-2xl animate-ping bg-violet-400/20" />
      )}

      <Shuffle
        size={22}
        className={`transition-transform duration-300 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`}
      />
      <span>{label}</span>
    </button>
  );
}
