"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  initialStep: number;
  agreementSigned: boolean;
  connectOnboarded: boolean;
  ftcAcknowledged: boolean;
  displayName: string;
  bio: string;
  specialtyTags: string[];
  sampleUrls: string[];
};

export function AdvocateOnboardingWizard({
  initialStep,
  agreementSigned,
  connectOnboarded,
  ftcAcknowledged,
  displayName: initialName,
  bio: initialBio,
  specialtyTags: initialTags,
  sampleUrls: initialSamples,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [agreementAccepted, setAgreementAccepted] = useState(agreementSigned);
  const [ftcAck, setFtcAck] = useState(ftcAcknowledged);
  const [displayName, setDisplayName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [specialties, setSpecialties] = useState(initialTags.join(", "));
  const [sample1, setSample1] = useState(initialSamples[0] ?? "");
  const [sample2, setSample2] = useState(initialSamples[1] ?? "");

  const connectDone = searchParams.get("connect") === "done" || connectOnboarded;

  const patch = useCallback(async (body: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/advocates/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data.error as string) ?? "Something went wrong");
      return false;
    }
    return true;
  }, []);

  async function acceptAgreement() {
    if (!agreementAccepted) {
      setError("You must accept the Advocate Agreement to continue.");
      return;
    }
    const ok = await patch({ step: "agreement", accepted: true });
    if (ok) setStep(2);
  }

  async function startStripeConnect() {
    setLoading(true);
    const res = await fetch("/api/stripe/connect-onboard", { method: "POST" });
    setLoading(false);
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      setError((data.error as string) ?? "Could not start Stripe onboarding");
    }
  }

  async function acknowledgeFtc() {
    if (!ftcAck) {
      setError("Please acknowledge FTC training.");
      return;
    }
    const ok = await patch({ step: "ftc_training", acknowledged: true });
    if (ok) setStep(4);
  }

  async function saveProfile() {
    const tags = specialties
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const samples = [sample1, sample2].filter(Boolean);
    const ok = await patch({
      step: "profile",
      display_name: displayName,
      bio,
      specialty_tags: tags,
      sample_content_urls: samples,
    });
    if (ok) {
      router.push("/dashboard/advocate");
      router.refresh();
    }
  }

  async function refreshConnect() {
    await fetch("/api/advocates/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "connect_refresh" }),
    });
    router.refresh();
  }

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold";

  return (
    <div className="max-w-xl">
      <ol className="mb-8 flex flex-wrap gap-2 font-body text-xs text-gold-body">
        {["Agreement", "Stripe Connect", "FTC training", "Profile", "Done"].map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-gold/20 text-gold" : "bg-navy-lift"}`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {error && (
        <p className="mb-4 rounded-brand-sm border border-red-500/40 bg-red-950/30 px-3 py-2 font-body text-sm text-red-200">
          {error}
        </p>
      )}

      {step === 1 && (
        <section>
          <h2 className="font-heading text-xl text-gold">Sif&apos;s Advocate Agreement</h2>
          <p className="mt-2 font-body text-sm text-cream/80">
            Review the agreement, then confirm acceptance below.
          </p>
          <a
            href="/legal/sifs-advocate-agreement.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-body text-sm text-gold underline"
          >
            Open agreement (PDF)
          </a>
          <label className="mt-6 flex items-start gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              className="mt-1"
            />
            I have read and agree to the Sif&apos;s Advocate Agreement, including FTC §255 disclosure
            requirements and payout terms.
          </label>
          <GoldButton
            label={loading ? "Saving…" : "Continue"}
            variant="solid"
            className="mt-6"
            onClick={acceptAgreement}
            disabled={loading}
          />
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="font-heading text-xl text-gold">Stripe Connect Express</h2>
          <p className="mt-2 font-body text-sm text-cream/80">
            Connect your bank account for brand deal payouts. Powered by Stripe — KYC required.
          </p>
          {connectDone ? (
            <>
              <p className="mt-4 font-body text-sm text-green-300">Stripe Connect linked.</p>
              <GoldButton label="Continue" variant="solid" className="mt-4" onClick={() => setStep(3)} />
            </>
          ) : (
            <>
              <GoldButton
                label={loading ? "Loading…" : "Connect with Stripe"}
                variant="solid"
                className="mt-6"
                onClick={startStripeConnect}
                disabled={loading}
              />
              <button
                type="button"
                onClick={refreshConnect}
                className="mt-4 block font-body text-sm text-gold underline"
              >
                I finished onboarding — refresh status
              </button>
            </>
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          <h2 className="font-heading text-xl text-gold">FTC training</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-sm text-cream/90">
            <li>Use #partner or #ad on Instagram and TikTok sponsored posts.</li>
            <li>Include &quot;Paid partnership with [Brand]&quot; clearly in captions.</li>
            <li>YouTube: disclose sponsorship in the video description above the fold.</li>
            <li>Three FTC violations may suspend marketplace access.</li>
          </ul>
          <label className="mt-6 flex items-start gap-3 font-body text-sm text-cream">
            <input type="checkbox" checked={ftcAck} onChange={(e) => setFtcAck(e.target.checked)} className="mt-1" />
            I understand and will follow FTC 16 CFR Part 255 on every sponsored post.
          </label>
          <GoldButton
            label={loading ? "Saving…" : "Continue"}
            variant="solid"
            className="mt-6"
            onClick={acknowledgeFtc}
            disabled={loading}
          />
        </section>
      )}

      {step === 4 && (
        <section>
          <h2 className="font-heading text-xl text-gold">Your advocate profile</h2>
          <label className="mt-4 block font-body text-sm text-gold">
            Display name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} />
          </label>
          <label className="mt-4 block font-body text-sm text-gold">
            Bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass} rows={4} />
          </label>
          <label className="mt-4 block font-body text-sm text-gold">
            Specialties (comma-separated)
            <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} className={inputClass} />
          </label>
          <label className="mt-4 block font-body text-sm text-gold">
            Sample content URL
            <input type="url" value={sample1} onChange={(e) => setSample1(e.target.value)} className={inputClass} />
          </label>
          <label className="mt-4 block font-body text-sm text-gold">
            Second sample (optional)
            <input type="url" value={sample2} onChange={(e) => setSample2(e.target.value)} className={inputClass} />
          </label>
          <GoldButton
            label={loading ? "Saving…" : "Finish onboarding"}
            variant="solid"
            className="mt-6"
            onClick={saveProfile}
            disabled={loading}
          />
        </section>
      )}
    </div>
  );
}
