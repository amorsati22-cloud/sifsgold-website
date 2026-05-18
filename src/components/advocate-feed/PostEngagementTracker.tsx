"use client";

import { useEffect } from "react";
import { recordPostEngagement } from "@/lib/advocate-feed/actions";

export function PostEngagementTracker({ postId }: { postId: string }) {
  useEffect(() => {
    void recordPostEngagement(postId, "view");
  }, [postId]);
  return null;
}
