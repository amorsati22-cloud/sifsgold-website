"use client";

import { useState } from "react";
import { followAdvocate } from "@/lib/advocate-feed/actions";

export function FollowAdvocateButton({ advocateId }: { advocateId: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      disabled={done}
      onClick={async () => {
        const res = await followAdvocate(advocateId);
        if (res.ok) setDone(true);
      }}
      className="rounded-full border border-gold px-4 py-2 text-sm font-medium text-gold disabled:opacity-60"
    >
      {done ? "Following" : "Follow advocate"}
    </button>
  );
}
