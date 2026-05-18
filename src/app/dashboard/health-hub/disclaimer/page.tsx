import Link from "next/link";

export default function HealthHubDisclaimerPage() {
  return <DisclaimerContent />;
}

function DisclaimerContent() {
  return (
    <article className="prose-health space-y-6 font-body text-cream/90">
      <h2 className="font-heading text-2xl font-bold text-gold">
        Sif&apos;s Gold Health Hub — Wellness disclaimer
      </h2>

      <p>
        <strong className="text-cream">Sif&apos;s Gold Health Hub is a wellness tracking tool, not medical advice.</strong>{" "}
        Nothing in Health Hub diagnoses, treats, or prevents any condition. Always talk to your healthcare
        provider for medical decisions.
      </p>

      <h3 className="font-heading text-lg text-gold">What Health Hub is</h3>
      <ul className="list-disc space-y-2 pl-5 text-cream/85">
        <li>Optional tools to notice patterns in your own day — energy, sleep, hydration, cycle awareness, medication logging, and pre-shift rituals.</li>
        <li>Designed for beauty, grooming, fitness, and fashion professionals and their clients.</li>
        <li>Client-side pattern insights only — no AI medical inference.</li>
      </ul>

      <h3 className="font-heading text-lg text-gold">What Health Hub is not</h3>
      <ul className="list-disc space-y-2 pl-5 text-cream/85">
        <li>Not a substitute for licensed medical care, mental health treatment, or emergency services.</li>
        <li>Not fertility prediction or contraceptive guidance — cycle sync is wellness-only.</li>
        <li>Not medication dosing recommendations — tracking and reminders only.</li>
        <li>Not weight-loss or extreme diet programming — pre-shift ritual focuses on recovery and mindfulness.</li>
      </ul>

      <h3 className="font-heading text-lg text-gold">Privacy & data</h3>
      <ul className="list-disc space-y-2 pl-5 text-cream/85">
        <li>Health Hub data is encrypted at rest using AES-256 (pgcrypto) in your Supabase account.</li>
        <li>Sif&apos;s Gold staff cannot access individual user health data; service role access is explicitly denied.</li>
        <li>We never share, sell, or use Health Hub data for advertising, brand partner analytics, or third-party marketing.</li>
        <li>Health data is not stored in browser localStorage — only in your encrypted cloud account after opt-in.</li>
        <li>You can export or permanently delete your Health Hub data at any time in Settings.</li>
      </ul>

      <p className="text-sm text-goldBody">
        See also our{" "}
        <Link href="/legal/privacy" className="text-gold underline-offset-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/legal/hipaa" className="text-gold underline-offset-2 hover:underline">
          HIPAA information
        </Link>
        .
      </p>
    </article>
  );
}
