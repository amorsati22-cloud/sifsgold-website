"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  contractId: string;
  role: "brand" | "advocate";
  signed: boolean;
};

export function ContractSignButton({ contractId, role, signed }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(signed);

  async function sign() {
    setLoading(true);
    const res = await fetch(`/api/contracts/${contractId}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return <p className="font-body text-sm text-teal">Signed in-app (timestamp + IP recorded)</p>;
  }

  return (
    <GoldButton
      label={loading ? "Signing…" : "Sign contract"}
      onClick={() => void sign()}
      variant="solid"
      size="sm"
    />
  );
}
