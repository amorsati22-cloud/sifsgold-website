"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import {
  CAMPAIGN_OBJECTIVES,
  CAMPAIGN_TYPES,
  COMPENSATION_TYPES,
  DEFAULT_FTC_DISCLOSURE_TEMPLATE,
  DELIVERABLE_TYPES,
} from "@/lib/brand-deals/constants";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type FormValues = {
  title: string;
  description: string;
  objective: string;
  campaign_type: string;
  total_budget: number;
  max_advocates: number;
  per_advocate_compensation: number;
  compensation_type: string;
  application_deadline: string;
  delivery_deadline: string;
  ftc_disclosure_template: string;
  exclusivity_clause: string;
  usage_rights: string;
  deliverable_type: string;
  deliverable_requirements: string;
};

function EscrowPayment({ campaignId, onFunded }: { campaignId: string; onFunded: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirmEscrow() {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: err } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (err) {
      setError(err.message ?? "Payment failed");
      setLoading(false);
      return;
    }
    const fundRes = await fetch(`/api/brand-campaigns/${campaignId}/escrow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fund: true }),
    });
    setLoading(false);
    if (!fundRes.ok) {
      const data = await fundRes.json();
      setError((data as { error?: string }).error ?? "Could not mark escrow funded");
      return;
    }
    onFunded();
  }

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-cream/80">
        Fund the full campaign budget upfront. Escrow releases 70% to advocates on approval; platform retains 30%.
      </p>
      <PaymentElement />
      {error && (
        <p className="font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <GoldButton
        label={loading ? "Processing…" : "Fund escrow & publish"}
        onClick={() => void confirmEscrow()}
        variant="solid"
      />
    </div>
  );
}

export function CampaignWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [escrowSecret, setEscrowSecret] = useState<string | null>(null);

  const { register, getValues } = useForm<FormValues>({
    defaultValues: {
      objective: "awareness",
      campaign_type: "sponsored_post",
      compensation_type: "flat_fee",
      ftc_disclosure_template: DEFAULT_FTC_DISCLOSURE_TEMPLATE,
      exclusivity_clause: "none",
      usage_rights: "organic_only",
      deliverable_type: "instagram_post",
      max_advocates: 5,
    },
  });

  const steps = ["Basics", "Budget", "Deliverables", "Targeting", "Legal", "Escrow"];

  async function saveDraft(): Promise<string | null> {
    const v = getValues();
    const res = await fetch("/api/brand-campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...v,
        deliverables: [{ type: v.deliverable_type, count: 1, requirements: v.deliverable_requirements }],
        platforms_required: ["instagram"],
      }),
    });
    const data = await res.json();
    const id = data.campaign?.id as string | undefined;
    if (id) setCampaignId(id);
    return id ?? null;
  }

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy";

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2" aria-label="Campaign wizard steps">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-brand-full px-3 py-1 font-body text-xs ${
              i === step ? "bg-gold text-navy" : "border border-gold/30 text-cream/70"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="max-w-2xl space-y-4">
        {step === 0 && (
          <>
            <label className="block font-body text-sm text-gold">
              Title
              <input {...register("title", { required: true })} className={inputClass} />
            </label>
            <label className="block font-body text-sm text-gold">
              Description
              <textarea {...register("description", { required: true })} className={inputClass} rows={4} />
            </label>
            <label className="block font-body text-sm text-gold">
              Objective
              <select {...register("objective")} className={inputClass}>
                {CAMPAIGN_OBJECTIVES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block font-body text-sm text-gold">
              Campaign type
              <select {...register("campaign_type")} className={inputClass}>
                {CAMPAIGN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <label className="block font-body text-sm text-gold">
              Total budget (USD)
              <input type="number" {...register("total_budget", { valueAsNumber: true })} className={inputClass} />
            </label>
            <label className="block font-body text-sm text-gold">
              Max advocates
              <input type="number" {...register("max_advocates", { valueAsNumber: true })} className={inputClass} />
            </label>
            <label className="block font-body text-sm text-gold">
              Per-advocate compensation
              <input
                type="number"
                {...register("per_advocate_compensation", { valueAsNumber: true })}
                className={inputClass}
              />
            </label>
            <label className="block font-body text-sm text-gold">
              Compensation type
              <select {...register("compensation_type")} className={inputClass}>
                {COMPENSATION_TYPES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="font-body text-xs text-gold-body">
              Advocates receive 70% on approved deliverables; 30% platform fee supports FTC compliance tooling.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block font-body text-sm text-gold">
              Deliverable type
              <select {...register("deliverable_type")} className={inputClass}>
                {DELIVERABLE_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block font-body text-sm text-gold">
              Requirements
              <textarea {...register("deliverable_requirements")} className={inputClass} rows={3} />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block font-body text-sm text-gold">
              Application deadline
              <input type="date" {...register("application_deadline")} className={inputClass} />
            </label>
            <label className="block font-body text-sm text-gold">
              Delivery deadline
              <input type="date" {...register("delivery_deadline")} className={inputClass} />
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <label className="block font-body text-sm text-gold">
              FTC disclosure template (16 CFR Part 255)
              <textarea {...register("ftc_disclosure_template")} className={inputClass} rows={5} />
            </label>
            <label className="block font-body text-sm text-gold">
              Exclusivity
              <select {...register("exclusivity_clause")} className={inputClass}>
                <option value="none">None</option>
                <option value="category_30_day">Category 30 days</option>
                <option value="category_60_day">Category 60 days</option>
              </select>
            </label>
            <label className="block font-body text-sm text-gold">
              Usage rights
              <select {...register("usage_rights")} className={inputClass}>
                <option value="organic_only">Organic only</option>
                <option value="paid_amplification_allowed">Paid amplification allowed</option>
                <option value="full_rights">Full rights</option>
              </select>
            </label>
          </>
        )}

        {step === 5 && campaignId && escrowSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret: escrowSecret, appearance: { theme: "night" } }}>
            <EscrowPayment campaignId={campaignId} onFunded={() => router.push(`/dashboard/brand-deals/${campaignId}`)} />
          </Elements>
        )}

        <div className="flex flex-wrap gap-3 pt-4">
          {step > 0 && step < 5 && (
            <GoldButton label="Back" onClick={() => setStep((s) => s - 1)} variant="outlined" type="button" />
          )}
          <GoldButton label="Save draft" onClick={() => void saveDraft()} variant="ghost" type="button" />
          {step < 4 && (
            <GoldButton label="Next" onClick={() => setStep((s) => s + 1)} variant="solid" type="button" />
          )}
          {step === 4 && (
            <GoldButton
              label="Continue to escrow"
              onClick={async () => {
                const id = campaignId ?? (await saveDraft());
                if (!id) return;
                const res = await fetch(`/api/brand-campaigns/${id}/escrow`, { method: "POST" });
                const data = await res.json();
                setEscrowSecret(data.client_secret);
                setStep(5);
              }}
              variant="solid"
              type="button"
            />
          )}
        </div>
      </div>
    </div>
  );
}
