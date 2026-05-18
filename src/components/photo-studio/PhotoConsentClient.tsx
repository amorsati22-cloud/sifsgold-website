"use client";

import Link from "next/link";
import { useState } from "react";
import { grantPhotoConsent } from "@/lib/photo-studio/actions";
import { GoldButton } from "@/components/ui/GoldButton";

export function PhotoConsentClient({
  appointmentId,
  token,
}: {
  appointmentId: string;
  token: string;
}) {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleAllow() {
    if (!token) {
      setError("Invalid consent link. Ask your professional to send a new request.");
      setStatus("error");
      return;
    }
    const result = await grantPhotoConsent(appointmentId, token);
    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="mt-8 rounded-brand-lg border border-teal/30 bg-teal/10 p-6 font-body text-cream">
        Thank you. Your professional may now mark approved photos for their public portfolio. You can revoke
        this anytime by contacting them directly.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <ul className="list-disc space-y-2 pl-5 font-body text-sm text-cream/80">
        <li>Only photos you approve can be used in marketing galleries.</li>
        <li>Sif&apos;s Gold does not sell your images to third parties.</li>
        <li>You must be signed in with the email used for this appointment.</li>
      </ul>

      {status === "error" && error ? (
        <p className="font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <GoldButton label="Allow Sif's Gold to use my photo" variant="solid" onClick={handleAllow} />

      <p className="font-body text-xs text-goldBody">
        <Link href="/sign-in" className="text-gold underline">
          Sign in
        </Link>{" "}
        if prompted. Not medical advice — portfolio and marketing use only.
      </p>
    </div>
  );
}
