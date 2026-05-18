import { InventoryCostClient } from "@/components/tools/InventoryCostClient";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { toolPageMetadata } from "@/lib/tools/metadata";

export const metadata = toolPageMetadata("inventory-cost");

export default function Page() {
  return (
    <ToolPageShell slug="inventory-cost" title="Inventory cost" description="Product cost per service and markup suggestions.">
      <InventoryCostClient />
    </ToolPageShell>
  );
}
