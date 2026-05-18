"use client";

export function ReadinessGauge({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(50, percent));
  const rotation = ((clamped - 50) / 50) * 180 - 90;

  return (
    <div className="flex flex-col items-center" aria-label={`Estimated readiness ${clamped}%`}>
      <div className="relative h-28 w-56 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border-[10px] border-gold/20 border-b-gold/5 border-l-gold/5"
          style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-1 w-24 origin-bottom bg-gold transition-transform duration-700 motion-reduce:transition-none"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
      </div>
      <p className="mt-2 font-heading text-3xl text-gold">{clamped}%</p>
      <p className="text-xs text-cream/60">Estimated readiness (recent performance)</p>
    </div>
  );
}
