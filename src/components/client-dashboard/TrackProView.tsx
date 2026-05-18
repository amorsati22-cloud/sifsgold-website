"use client";

import { useEffect } from "react";

export function TrackProView({ proId }: { proId: string }) {
  useEffect(() => {
    void fetch("/api/client/pro-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_id: proId }),
    });
  }, [proId]);

  return null;
}
