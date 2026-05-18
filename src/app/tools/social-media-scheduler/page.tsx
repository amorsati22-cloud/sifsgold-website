import { SocialSchedulerClient } from "@/components/tools/SocialSchedulerClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("social-media-scheduler");

export default function Page() {
  return (
    <ToolPageShell slug="social-media-scheduler" title="Social post planner" description="Best posting times and caption drafts in Sif's Gold brand voice.">
      <SocialSchedulerClient />
    </ToolPageShell>
  );
}
