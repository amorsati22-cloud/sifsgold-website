"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = { campaignId: string };

type FormValues = {
  pitch: string;
  proposed_timeline: string;
  portfolio_url_1: string;
  portfolio_url_2: string;
};

export function ApplicationForm({ campaignId }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    const samples = [values.portfolio_url_1, values.portfolio_url_2]
      .filter(Boolean)
      .map((url) => ({ url }));

    const res = await fetch(`/api/brand-deals/${campaignId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitch: values.pitch,
        proposed_timeline: values.proposed_timeline,
        portfolio_samples: samples,
      }),
    });

    if (res.ok) router.push("/dashboard/advocate/deals");
  }

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <label className="block font-body text-sm text-gold">
        Your pitch
        <textarea {...register("pitch", { required: true })} className={inputClass} rows={5} required />
      </label>
      <label className="block font-body text-sm text-gold">
        Proposed timeline
        <input {...register("proposed_timeline")} className={inputClass} />
      </label>
      <label className="block font-body text-sm text-gold">
        Portfolio sample URL
        <input {...register("portfolio_url_1")} type="url" className={inputClass} />
      </label>
      <label className="block font-body text-sm text-gold">
        Second sample (optional)
        <input {...register("portfolio_url_2")} type="url" className={inputClass} />
      </label>
      <p className="font-body text-xs text-gold-body">
        By applying you agree to include FTC disclosures (#partner / #ad) on all sponsored posts per 16 CFR Part 255.
      </p>
      <GoldButton label={formState.isSubmitting ? "Submitting…" : "Submit application"} type="submit" variant="solid" />
    </form>
  );
}
