import { TOPICS } from "../data/sites";

interface TopicDriftProps {
  selected: string;
  onChange: (topic: string) => void;
}

const TOPIC_EMOJIS: Record<string, string> = {
  philosophy: "🤔",
  art: "🎨",
  music: "🎵",
  technology: "💻",
  science: "🔬",
  fiction: "📖",
  gaming: "🎮",
  nature: "🌿",
  history: "📜",
  culture: "🌍",
  personal: "🏠",
  humor: "😂",
  poetry: "✍️",
  conspiracy: "🕵️",
  paranormal: "👻",
  linguistics: "🗣️",
  math: "🔢",
  film: "🎬",
};

export default function TopicDrift({ selected, onChange }: TopicDriftProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
          ${selected === ""
            ? "border-emerald-500/60 bg-emerald-950/60 text-emerald-300"
            : "border-slate-700/50 bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50"
          }
        `}
      >
        All Topics
      </button>
      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => onChange(topic === selected ? "" : topic)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
            ${selected === topic
              ? "border-emerald-500/60 bg-emerald-950/60 text-emerald-300"
              : "border-slate-700/50 bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50"
            }
          `}
        >
          <span>{TOPIC_EMOJIS[topic] || "•"}</span>
          {topic}
        </button>
      ))}
    </div>
  );
}
