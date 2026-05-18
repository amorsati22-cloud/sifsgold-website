"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoyaltySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/loyalty/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        points_per_dollar: Number(fd.get("points_per_dollar")),
        points_per_appointment: Number(fd.get("points_per_appointment")),
        points_per_referral: Number(fd.get("points_per_referral")),
        enrollment_bonus: Number(fd.get("enrollment_bonus")),
        birthday_bonus: Number(fd.get("birthday_bonus")),
        expiration_months: Number(fd.get("expiration_months")),
        active: true,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard/loyalty");
  }

  const input = "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-sm text-cream";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-lg space-y-4">
      <h2 className="font-display text-lg text-gold">Loyalty program setup</h2>
      <label className="block text-sm text-cream">Program name<input name="name" required defaultValue="Gold Rewards" className={input} /></label>
      <label className="block text-sm text-cream">Points per dollar spent<input name="points_per_dollar" type="number" step="0.1" defaultValue={1} className={input} /></label>
      <label className="block text-sm text-cream">Bonus points per appointment<input name="points_per_appointment" type="number" defaultValue={25} className={input} /></label>
      <label className="block text-sm text-cream">Referral bonus (referrer)<input name="points_per_referral" type="number" defaultValue={100} className={input} /></label>
      <label className="block text-sm text-cream">Enrollment bonus<input name="enrollment_bonus" type="number" defaultValue={50} className={input} /></label>
      <label className="block text-sm text-cream">Birthday bonus<input name="birthday_bonus" type="number" defaultValue={50} className={input} /></label>
      <label className="block text-sm text-cream">Points expire after (months inactive)<input name="expiration_months" type="number" defaultValue={12} className={input} /></label>
      <button type="submit" disabled={loading} className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-navy">{loading ? "Saving…" : "Activate program"}</button>
    </form>
  );
}
