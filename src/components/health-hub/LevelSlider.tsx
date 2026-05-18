"use client";

export function LevelSlider({
  id,
  name,
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex justify-between font-body text-sm text-cream">
        <span>{label}</span>
        <span className="font-semibold text-gold" aria-live="polite">
          {value}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      />
    </div>
  );
}
