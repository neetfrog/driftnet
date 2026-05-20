import { DECADES } from "../data/sites";

interface DecadeFilterProps {
  selected: string;
  onChange: (decade: string) => void;
}

export default function DecadeFilter({ selected, onChange }: DecadeFilterProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {DECADES.map((decade) => {
        const isActive = selected === decade.id;
        return (
          <button
            key={decade.id}
            onClick={() => onChange(decade.id)}
            className={`
              px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all duration-200
              ${isActive
                ? "border-fuchsia-500/60 bg-fuchsia-950/60 text-fuchsia-300"
                : "border-slate-700/50 bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50"
              }
            `}
          >
            {decade.label}
          </button>
        );
      })}
    </div>
  );
}
