"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { validateUsername } from "@/lib/username";
import type { BookStatus, ProProfile } from "@/types/pro-profile";
import { PORTFOLIO_CATEGORIES } from "@/types/pro-profile";

type ProfileEditorProps = {
  initial: ProProfile | null;
  userId: string;
};

const BOOK_STATUSES: BookStatus[] = ["fully_open", "request_only", "closed", "exclusive"];

export function ProfileEditor({ initial, userId }: ProfileEditorProps) {
  const theme = useTheme();
  const [profile, setProfile] = useState<Partial<ProProfile>>(
    initial ?? {
      id: userId,
      username: "",
      display_name: "",
      visible_in_search: true,
      accepting_new_clients: true,
      book_status: "fully_open",
      location_country: "US",
      specialties: [],
      languages_spoken: [],
    },
  );
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const previewUsername = profile.username || "your-username";

  const update = useCallback(<K extends keyof ProProfile>(key: K, value: ProProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  }, []);

  async function uploadImage(
    file: File,
    bucket: "pro-avatars" | "pro-covers",
  ): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });
    if (uploadError) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const usernameCheck = validateUsername(profile.username ?? "");
    if (!usernameCheck.valid) {
      setStatus("error");
      setError(usernameCheck.error);
      return;
    }

    if (!profile.display_name?.trim()) {
      setStatus("error");
      setError("Display name is required.");
      return;
    }

    try {
      const supabase = createClient();
      const payload = {
        id: userId,
        username: usernameCheck.username,
        display_name: profile.display_name.trim(),
        headline: profile.headline ?? null,
        bio: profile.bio ?? null,
        location_city: profile.location_city ?? null,
        location_state: profile.location_state ?? null,
        location_country: profile.location_country ?? "US",
        specialties: profile.specialties ?? [],
        license_state: profile.license_state ?? null,
        years_experience: profile.years_experience ?? null,
        languages_spoken: profile.languages_spoken ?? [],
        avatar_url: profile.avatar_url ?? null,
        cover_image_url: profile.cover_image_url ?? null,
        instagram_handle: profile.instagram_handle ?? null,
        tiktok_handle: profile.tiktok_handle ?? null,
        pinterest_handle: profile.pinterest_handle ?? null,
        website_url: profile.website_url ?? null,
        book_status: profile.book_status ?? "fully_open",
        accepting_new_clients: profile.accepting_new_clients ?? true,
        visible_in_search: profile.visible_in_search ?? true,
        pronouns: profile.pronouns ?? null,
        accessibility_notes: profile.accessibility_notes ?? null,
      };

      const { error: saveError } = await supabase.from("pro_profiles").upsert(payload);
      if (saveError) throw saveError;
      setStatus("saved");
    } catch {
      setStatus("error");
      setError("Could not save profile. Check your connection and try again.");
    }
  }

  function addSpecialty() {
    const tag = specialtyInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!tag) return;
    const list = profile.specialties ?? [];
    if (!list.includes(tag)) update("specialties", [...list, tag]);
    setSpecialtyInput("");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={handleSave} className="space-y-5">
        <h2 className="font-heading text-xl text-gold">Edit public profile</h2>

        <label className="block font-body text-sm text-cream">
          Username
          <input
            required
            value={profile.username ?? ""}
            onChange={(e) => update("username", e.target.value)}
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            autoComplete="off"
          />
        </label>

        <label className="block font-body text-sm text-cream">
          Display name
          <input
            required
            value={profile.display_name ?? ""}
            onChange={(e) => update("display_name", e.target.value)}
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>

        <label className="block font-body text-sm text-cream">
          Headline
          <input
            value={profile.headline ?? ""}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="Licensed cosmetologist · Brooklyn"
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>

        <label className="block font-body text-sm text-cream">
          Bio
          <textarea
            value={profile.bio ?? ""}
            onChange={(e) => update("bio", e.target.value)}
            rows={6}
            maxLength={4000}
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 font-heading text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-body text-sm text-cream">
            City
            <input
              value={profile.location_city ?? ""}
              onChange={(e) => update("location_city", e.target.value)}
              className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
          <label className="block font-body text-sm text-cream">
            State
            <input
              value={profile.location_state ?? ""}
              onChange={(e) => update("location_state", e.target.value)}
              className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
        </div>

        <label className="block font-body text-sm text-cream">
          Booking status
          <select
            value={profile.book_status ?? "fully_open"}
            onChange={(e) => update("book_status", e.target.value as BookStatus)}
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {BOOK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3">
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={profile.visible_in_search ?? true}
              onChange={(e) => update("visible_in_search", e.target.checked)}
              className="h-4 w-4 rounded border-gold/30 text-gold focus-visible:ring-gold"
            />
            Show profile in search and public URL
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={profile.accepting_new_clients ?? true}
              onChange={(e) => update("accepting_new_clients", e.target.checked)}
              className="h-4 w-4 rounded border-gold/30 text-gold focus-visible:ring-gold"
            />
            Accepting new clients
          </label>
        </div>

        <div>
          <span className="font-body text-sm text-cream">Specialties</span>
          <div className="mt-2 flex gap-2">
            <input
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              list="specialty-suggestions"
              className="flex-1 rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
            <datalist id="specialty-suggestions">
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={addSpecialty}
              className="rounded-brand-md border border-gold/30 px-3 py-2 text-sm text-gold hover:bg-gold/10"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {(profile.specialties ?? []).map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "specialties",
                      (profile.specialties ?? []).filter((t) => t !== tag),
                    )
                  }
                  className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-cream hover:border-red-400/50"
                  aria-label={`Remove ${tag}`}
                >
                  {tag} ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label className="block font-body text-sm text-cream">
          Avatar
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm text-cream/70"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImage(file, "pro-avatars");
              if (url) update("avatar_url", url);
            }}
          />
        </label>

        <label className="block font-body text-sm text-cream">
          Cover image
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm text-cream/70"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImage(file, "pro-covers");
              if (url) update("cover_image_url", url);
            }}
          />
        </label>

        <label className="block font-body text-sm text-cream">
          Accessibility notes
          <textarea
            value={profile.accessibility_notes ?? ""}
            onChange={(e) => update("accessibility_notes", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-navy hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save profile"}
        </button>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {status === "saved" ? <p className="text-sm text-teal">Profile saved.</p> : null}
      </form>

      <aside aria-label="Live preview" className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-heading text-xl text-gold">Preview</h2>
        <div
          className="mt-4 overflow-hidden rounded-brand-lg border border-gold/20"
          style={{ backgroundColor: theme.colors.navyDeep }}
        >
          <div
            className="h-24"
            style={{
              background: profile.cover_image_url
                ? `linear-gradient(to bottom, transparent, ${theme.colors.navyDeep}), url(${profile.cover_image_url}) center/cover`
                : `linear-gradient(160deg, ${theme.colors.navyDeep}, ${theme.colors.navy})`,
            }}
          />
          <div className="relative px-4 pb-4">
            <div className="relative -mt-10 h-20 w-20 overflow-hidden rounded-brand-md border-2 border-gold/30 bg-navy">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt="" fill className="object-cover" sizes="80px" />
              ) : (
                <span className="flex h-full items-center justify-center font-heading text-2xl text-gold">
                  {(profile.display_name ?? "?").charAt(0)}
                </span>
              )}
            </div>
            <p className="mt-2 font-heading text-lg text-gold">{profile.display_name || "Your name"}</p>
            <p className="font-body text-sm text-cream/80">{profile.headline || "Your headline"}</p>
            <div className="mt-3 flex flex-col gap-1">
              <Link
                href={`/${previewUsername}`}
                className="font-body text-sm text-gold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View public profile →
              </Link>
              <Link href="/dashboard/services" className="font-body text-sm text-gold-body hover:text-gold">
                Manage services menu →
              </Link>
              <Link href="/dashboard/pro/home" className="font-body text-sm text-gold-body hover:text-gold">
                Pro home →
              </Link>
              <Link href="/dashboard/pro/schedule" className="font-body text-sm text-gold-body hover:text-gold">
                Schedule →
              </Link>
              <Link href="/dashboard/pro/clients" className="font-body text-sm text-gold-body hover:text-gold">
                Clients →
              </Link>
              <Link href="/dashboard/availability" className="font-body text-sm text-gold-body hover:text-gold">
                Availability →
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
