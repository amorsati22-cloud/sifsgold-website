"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import {
  generateSocialCaption,
  suggestSocialPostTimes,
  type SocialPlatform,
} from "@/lib/tools/formulas";

export function SocialSchedulerClient() {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [serviceType, setServiceType] = useState("dimensional color");
  const [tone, setTone] = useState<"educational" | "behind_the_chair" | "promo">("behind_the_chair");

  const times = useMemo(() => suggestSocialPostTimes(platform), [platform]);
  const caption = useMemo(
    () => generateSocialCaption({ serviceType, tone }),
    [serviceType, tone],
  );

  return (
    <Calculator
      toolName="social-media-scheduler"
      getPresetData={() => ({ platform, serviceType, tone })}
      disclaimers={["Posting times are heuristic — test with your audience insights."]}
      results={
        <div className="space-y-4">
          <div>
            <p className="text-sm text-goldBody">Suggested times ({platform})</p>
            <ul className="mt-2 list-disc pl-5 text-cream/85">
              {times.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-goldBody">Caption draft (Sif&apos;s Gold voice)</p>
            <p className="mt-2 rounded-brand border border-gold/20 bg-navy-deep/60 p-4 text-sm text-cream/90">
              {caption}
            </p>
            <button
              type="button"
              className="mt-2 text-xs text-gold hover:underline"
              onClick={() => navigator.clipboard?.writeText(caption)}
            >
              Copy caption
            </button>
          </div>
        </div>
      }
    >
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      >
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="facebook">Facebook</option>
        <option value="pinterest">Pinterest</option>
      </select>
      <GlassInput value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Service type" />
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value as typeof tone)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      >
        <option value="behind_the_chair">Behind the chair</option>
        <option value="educational">Educational</option>
        <option value="promo">Promo / booking</option>
      </select>
    </Calculator>
  );
}
