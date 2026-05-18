"use client";

type Props = {
  onConsent: (consented: boolean) => void;
  loading?: boolean;
};

export function RecordingConsent({ onConsent, loading }: Props) {
  return (
    <div
      role="dialog"
      aria-labelledby="recording-consent-title"
      className="rounded-brand-lg border border-amber-500/40 bg-amber-950/30 p-4"
    >
      <h3 id="recording-consent-title" className="font-display text-sm text-gold">
        Recording consent required
      </h3>
      <p className="mt-2 font-body text-sm text-cream/80">
        This call may be recorded. All participants must agree before recording can start. If you
        offer medical consultations, recording is discouraged for HIPAA compliance.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => onConsent(true)}
          className="rounded-full bg-gold px-4 py-2 font-body text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50"
        >
          I consent to recording
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => onConsent(false)}
          className="rounded-full border border-gold/40 px-4 py-2 font-body text-sm text-gold hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
