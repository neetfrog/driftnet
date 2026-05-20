import { useState, useEffect } from "react";
import { DriftSite } from "../data/sites";
import { ExternalLink, RefreshCw, X, Archive } from "lucide-react";
import GlitchText from "./GlitchText";

interface RandomPortalProps {
  site: DriftSite | null;
  onClose: () => void;
  onNewDrift: () => void;
}

export default function RandomPortal({ site, onClose, onNewDrift }: RandomPortalProps) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (site) {
      setVisible(true);
      setGlitchActive(true);
      const t = setTimeout(() => setGlitchActive(false), 1200);
      return () => clearTimeout(t);
    }
  }, [site]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!site) return null;

  const targetUrl = site.archiveUrl || site.url;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Portal Card */}
      <div
        className={`relative w-full max-w-lg transition-all duration-300
          ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Animated border */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 opacity-70 blur-[1px]" />

        <div className="relative rounded-2xl bg-slate-950 overflow-hidden border border-slate-800">
          {/* Animated scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none opacity-30" />

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
                Drift Destination
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <div className="mb-4">
              <h2 className="text-2xl font-black text-white mb-1">
                <GlitchText text={site.title} active={glitchActive} />
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-fuchsia-400">{site.era}</span>
                <span className="text-slate-700">•</span>
                <span className="text-xs font-mono text-slate-500">{site.type}</span>
                <span className="text-slate-700">•</span>
                <span className="text-xs italic text-slate-500">"{site.vibe}"</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              {site.description}
            </p>

            {/* Mood pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {site.mood.map((m) => (
                <span key={m} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {m}
                </span>
              ))}
              {site.topics.map((t) => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/50 text-violet-400 border border-violet-800/50">
                  {t}
                </span>
              ))}
            </div>

            {/* URL preview */}
            <div className="mb-5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-hidden">
              {site.archiveUrl ? (
                <Archive size={12} className="text-amber-500 shrink-0" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              )}
              <span className="text-[11px] font-mono text-slate-500 truncate">{targetUrl}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                  bg-gradient-to-br from-violet-600 to-fuchsia-700 hover:from-violet-500 hover:to-fuchsia-600
                  text-white font-bold text-sm border border-violet-500/40
                  shadow-lg shadow-violet-900/30 transition-all duration-200 hover:shadow-violet-800/40"
              >
                <ExternalLink size={14} />
                Open Site
              </a>
              <button
                onClick={onNewDrift}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                  bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600
                  text-slate-300 hover:text-white font-medium text-sm
                  transition-all duration-200"
              >
                <RefreshCw size={14} />
                Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
