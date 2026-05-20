interface DriftMeterProps {
  count: number;
}

const MILESTONES = [5, 10, 25, 50, 100];
const TITLES = ["Newcomer", "Wanderer", "Explorer", "Deep Drifter", "Ghost of the Old Web"];

export default function DriftMeter({ count }: DriftMeterProps) {
  const milestoneIdx = MILESTONES.findIndex((m) => count < m);
  const currentMilestone = milestoneIdx === -1 ? MILESTONES.length - 1 : milestoneIdx;
  const title = TITLES[Math.min(currentMilestone, TITLES.length - 1)];
  const nextMilestone = MILESTONES[currentMilestone] || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = currentMilestone > 0 ? MILESTONES[currentMilestone - 1] : 0;
  const progress = Math.min(((count - prevMilestone) / (nextMilestone - prevMilestone)) * 100, 100);

  if (count === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-slate-500">{title}</span>
        <span className="text-xs font-mono text-violet-500">{count} drifts</span>
      </div>
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {currentMilestone < MILESTONES.length && (
        <p className="text-[10px] text-slate-700 mt-1.5 font-mono">
          {nextMilestone - count} more to unlock: <span className="text-slate-500">{TITLES[currentMilestone + 1] || "Legend"}</span>
        </p>
      )}
    </div>
  );
}
