import { MOODS } from "../data/sites";

interface MoodSelectorProps {
  selected: string;
  onChange: (mood: string) => void;
  is3AM: boolean;
}

export default function MoodSelector({ selected, onChange, is3AM }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => {
        const isActive = selected === mood.id;
        const is3AMMode = mood.id === "3am" && is3AM;

        return (
          <button
            key={mood.id}
            onClick={() => onChange(mood.id)}
            className={`
              group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              border transition-all duration-200
              ${isActive
                ? "border-violet-500/70 bg-violet-900/50 text-violet-200 shadow-sm shadow-violet-900/30"
                : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-600/60"
              }
              ${is3AMMode ? "animate-pulse" : ""}
            `}
          >
            <span className="text-sm">{mood.emoji}</span>
            <span>{mood.label}</span>
            {isActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}
