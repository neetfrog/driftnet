

interface ThreeAMOverlayProps {
  active: boolean;
}

export default function ThreeAMOverlay({ active }: ThreeAMOverlayProps) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      {/* Deep vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,0,20,0.85) 100%)" }} />
      {/* Scanlines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.8) 3px, rgba(255,255,255,0.8) 4px)" }} />
      {/* Corner glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-64 h-64 blur-3xl rounded-full" style={{ background: "rgba(55,48,163,0.1)" }} />
      {/* Corner glow top-right */}
      <div className="absolute top-0 right-0 w-48 h-48 blur-3xl rounded-full" style={{ background: "rgba(88,28,220,0.08)" }} />
    </div>
  );
}
