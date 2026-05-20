import { useState } from "react";
import { ChevronLeft, ChevronRight, Link, ExternalLink } from "lucide-react";

const WEBRINGS = [
  {
    name: "Yesterweb Ring",
    description: "A webring for personal sites that remember the old web.",
    url: "https://yesterweb.org/webring/",
    members: 847,
    theme: "nostalgia",
  },
  {
    name: "XXIIVV Webring",
    description: "A curated ring of independent artists and makers.",
    url: "https://webring.xxiivv.com/",
    members: 300,
    theme: "creative",
  },
  {
    name: "Hotline Webring",
    description: "Personal sites and blogs from the indie web.",
    url: "https://hotlinewebring.club/",
    members: 120,
    theme: "indie",
  },
  {
    name: "Retronaut Webring",
    description: "Sites dedicated to vintage computing and retrotech.",
    url: "https://retronaut.co/",
    members: 65,
    theme: "retro",
  },
  {
    name: "Bucketfish Ring",
    description: "Art and personal expression on the small web.",
    url: "https://bucketfish.me/webring.html",
    members: 38,
    theme: "art",
  },
];

export default function WebringSidebar() {
  const [idx, setIdx] = useState(0);
  const ring = WEBRINGS[idx];

  const prev = () => setIdx((i) => (i - 1 + WEBRINGS.length) % WEBRINGS.length);
  const next = () => setIdx((i) => (i + 1) % WEBRINGS.length);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Link size={12} className="text-slate-600" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-600">
          Webrings
        </span>
      </div>

      <div className="min-h-[90px]">
        <h4 className="text-sm font-bold text-slate-200 mb-1">{ring.name}</h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-2">{ring.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-600">{ring.members} members</span>
          <a
            href={ring.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-violet-500 hover:text-violet-400 transition-colors"
          >
            <ExternalLink size={9} />
            Visit
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
        <button onClick={prev} className="p-1 rounded text-slate-600 hover:text-slate-400 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-1">
          {WEBRINGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-violet-500" : "bg-slate-700"}`}
            />
          ))}
        </div>
        <button onClick={next} className="p-1 rounded text-slate-600 hover:text-slate-400 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
