import { DriftSite } from "../data/sites";
import { ExternalLink, Clock } from "lucide-react";

interface DriftHistoryProps {
  history: DriftSite[];
  onSelect: (site: DriftSite) => void;
}

export default function DriftHistory({ history, onSelect }: DriftHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} className="text-slate-600" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-600">
          Drift History
        </span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {history.slice().reverse().map((site, i) => (
          <button
            key={`${site.id}-${i}`}
            onClick={() => onSelect(site)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs
              border border-slate-800 bg-slate-900/50 text-slate-500
              hover:text-slate-300 hover:border-slate-700 transition-all duration-200"
          >
            <ExternalLink size={9} />
            {site.title}
          </button>
        ))}
      </div>
    </div>
  );
}
