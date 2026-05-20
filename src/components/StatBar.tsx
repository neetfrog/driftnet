import { DRIFT_SITES } from "../data/sites";

interface StatBarProps {
  filteredCount: number;
  driftCount: number;
}

export default function StatBar({ filteredCount, driftCount }: StatBarProps) {
  const total = DRIFT_SITES.length;

  return (
    <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
      <span>
        <span className="text-slate-400">{filteredCount}</span> sites in drift pool
      </span>
      <span className="text-slate-800">|</span>
      <span>
        <span className="text-slate-400">{total}</span> total archived
      </span>
      {driftCount > 0 && (
        <>
          <span className="text-slate-800">|</span>
          <span>
            <span className="text-violet-400">{driftCount}</span> drifts this session
          </span>
        </>
      )}
    </div>
  );
}
