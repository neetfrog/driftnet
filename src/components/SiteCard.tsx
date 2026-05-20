import { useState } from "react";
import { DriftSite } from "../data/sites";
import { ExternalLink, Archive, Globe, BookOpen, MessageSquare, Sparkles, Zap } from "lucide-react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  blog: <BookOpen size={12} />,
  forum: <MessageSquare size={12} />,
  webring: <Globe size={12} />,
  personal: <Sparkles size={12} />,
  weird: <Zap size={12} />,
  archive: <Archive size={12} />,
  tool: <Globe size={12} />,
  community: <MessageSquare size={12} />,
};

const MOOD_COLORS: Record<string, string> = {
  "3am": "bg-indigo-900/60 text-indigo-300 border-indigo-700/50",
  nostalgic: "bg-amber-900/60 text-amber-300 border-amber-700/50",
  weird: "bg-green-900/60 text-green-300 border-green-700/50",
  cozy: "bg-rose-900/60 text-rose-300 border-rose-700/50",
  hypnotic: "bg-purple-900/60 text-purple-300 border-purple-700/50",
  educational: "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
  retro: "bg-lime-900/60 text-lime-300 border-lime-700/50",
};

interface SiteCardProps {
  site: DriftSite;
  isHighlighted?: boolean;
  onDrift?: (site: DriftSite) => void;
}

export default function SiteCard({ site, isHighlighted = false, onDrift }: SiteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const targetUrl = site.archiveUrl || site.url;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isHighlighted
          ? "border-violet-500/60 bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 shadow-lg shadow-violet-900/20"
          : "border-slate-700/50 bg-slate-900/60 hover:border-slate-500/60 hover:bg-slate-800/80"
        }
        ${isHovered ? "scale-[1.015] shadow-xl" : "scale-100"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300
          ${isHighlighted
            ? "opacity-100 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"
            : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500"
          }
        `}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                {TYPE_ICONS[site.type]}
                {site.type}
              </span>
              <span className="text-[10px] font-mono text-slate-600">{site.decade}</span>
            </div>
            <h3 className="font-bold text-slate-100 text-base leading-tight">{site.title}</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{site.era}</p>
          </div>

          {isHighlighted && (
            <div className="shrink-0 w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
              <Sparkles size={12} className="text-violet-400" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{site.description}</p>

        {/* Vibe tag */}
        <div className="mb-4">
          <span className="text-[11px] italic text-slate-500">"{site.vibe}"</span>
        </div>

        {/* Mood tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {site.mood.map((m) => (
            <span
              key={m}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${MOOD_COLORS[m] || "bg-slate-800 text-slate-400 border-slate-700"}`}
            >
              {m}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg
              bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600
              text-slate-300 hover:text-white transition-all duration-200"
          >
            <ExternalLink size={11} />
            Visit Site
          </a>
          {onDrift && (
            <button
              onClick={() => onDrift(site)}
              className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg
                bg-violet-900/40 hover:bg-violet-800/60 border border-violet-700/50 hover:border-violet-500/70
                text-violet-400 hover:text-violet-300 transition-all duration-200"
            >
              <Zap size={11} />
              Drift
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
