"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  displayName: string;
  bio: string;
  specialtyTags: string[];
  sampleUrls: string[];
  featured: boolean;
};

export function AdvocateProfileEditor({
  displayName: initialName,
  bio: initialBio,
  specialtyTags: initialTags,
  sampleUrls: initialSamples,
  featured,
}: Props) {
  const [displayName, setDisplayName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [specialties, setSpecialties] = useState(initialTags.join(", "));
  const [sample1, setSample1] = useState(initialSamples[0] ?? "");
  const [sample2, setSample2] = useState(initialSamples[1] ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold";

  async function save() {
    setSaving(true);
    setMessage(null);
    const tags = specialties
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/advocates/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: "profile",
        display_name: displayName,
        bio,
        specialty_tags: tags,
        sample_content_urls: [sample1, sample2].filter(Boolean),
      }),
    });
    setSaving(false);
    setMessage(res.ok ? "Profile saved." : "Could not save profile.");
  }

  async function startBoost(days: 7 | 30) {
    const res = await fetch("/api/advocates/profile-boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url as string;
    else setMessage((data.error as string) ?? "Boost unavailable");
  }

  return (
    <div className="max-w-xl space-y-4">
      {featured && (
        <p className="rounded-brand-sm border border-gold/30 bg-gold/10 px-3 py-2 font-body text-sm text-gold">
          Your profile is currently featured in the marketplace.
        </p>
      )}

      <label className="block font-body text-sm text-gold">
        Display name
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} />
      </label>
      <label className="block font-body text-sm text-gold">
        Bio
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass} rows={5} />
      </label>
      <label className="block font-body text-sm text-gold">
        Specialties
        <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} className={inputClass} />
      </label>
      <label className="block font-body text-sm text-gold">
        Sample URL
        <input type="url" value={sample1} onChange={(e) => setSample1(e.target.value)} className={inputClass} />
      </label>
      <label className="block font-body text-sm text-gold">
        Second sample
        <input type="url" value={sample2} onChange={(e) => setSample2(e.target.value)} className={inputClass} />
      </label>

      {message && <p className="font-body text-sm text-gold-body">{message}</p>}

      <GoldButton label={saving ? "Saving…" : "Save profile"} variant="solid" onClick={save} disabled={saving} />

      <section className="mt-10 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
        <h2 className="font-heading text-lg text-gold">Boost my profile</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Get featured placement in the brand deal marketplace for 7 or 30 days.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <GoldButton label="7 days · $19" variant="ghost" size="sm" onClick={() => startBoost(7)} />
          <GoldButton label="30 days · $49" variant="ghost" size="sm" onClick={() => startBoost(30)} />
        </div>
      </section>
    </div>
  );
}
