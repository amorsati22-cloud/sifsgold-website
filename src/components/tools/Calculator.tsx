"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { saveToolPreset } from "@/lib/tools/actions";

type Props = {
  toolName: string;
  children: ReactNode;
  results: ReactNode;
  getPresetData: () => Record<string, unknown>;
  disclaimers?: string[];
};

export function Calculator({
  toolName,
  children,
  results,
  getPresetData,
  disclaimers = [],
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const presetNameId = useId();
  const [presetName, setPresetName] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setSaveMsg(null);
    setPresetName("");
  }, []);

  async function handleSave() {
    const name = presetName.trim() || `Preset ${new Date().toLocaleDateString()}`;
    const res = await saveToolPreset({
      toolName,
      presetName: name,
      presetData: getPresetData(),
    });
    setSaveMsg(res.ok ? "Preset saved." : res.error ?? "Could not save.");
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const w = window.open("", "_blank", "width=640,height=800");
    if (!w) return;
    w.document.write(
      `<html><head><title>Sif's Gold — ${toolName}</title></head><body style="font-family:sans-serif;padding:24px">${el.innerHTML}</body></html>`,
    );
    w.document.close();
    w.print();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div ref={printRef} className="space-y-8">
        <div key={resetKey} className="space-y-6">
          {children}
        </div>
        <div className="rounded-brand-lg border border-gold/30 bg-navy-deep/80 p-6">{results}</div>
      </div>

      {disclaimers.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-cream/55">
          {disclaimers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-gold/15 pt-6">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Print / export
        </button>
        <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={presetNameId}>
            Preset name
          </label>
          <input
            id={presetNameId}
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="min-w-[120px] flex-1 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-offwhite focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          <button
            type="button"
            onClick={() => void handleSave()}
            className="rounded-full border border-gold bg-gold px-4 py-2 text-sm font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Save preset
          </button>
        </div>
      </div>
      {saveMsg ? <p className="text-xs text-goldBody">{saveMsg}</p> : null}
      <p className="text-xs text-cream/50">
        Sign in to save presets to your account. All calculators work without signing in.
      </p>
    </div>
  );
}
