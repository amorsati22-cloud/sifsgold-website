import "server-only";

import { getStripe } from "@/lib/stripe";
import type { ShippingAddress } from "@/lib/shop/types";
import { centsFromDecimal } from "@/lib/shop/format";

export async function calculateTax(params: {
  subtotal: number;
  shipping: number;
  address: ShippingAddress;
  lineItems: { amount: number; reference: string; tax_code?: string }[];
}): Promise<{ tax: number; taxCalculationId?: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { tax: estimateTaxFallback(params.subtotal, params.address.state) };
  }

  try {
    const calculation = await stripe.tax.calculations.create({
      currency: "usd",
      customer_details: {
        address: {
          line1: params.address.line1,
          line2: params.address.line2,
          city: params.address.city,
          state: params.address.state,
          postal_code: params.address.postal_code,
          country: params.address.country || "US",
        },
        address_source: "shipping",
      },
      line_items: params.lineItems.map((item) => ({
        amount: centsFromDecimal(item.amount),
        reference: item.reference,
        tax_code: item.tax_code ?? "txcd_99999999",
      })),
      shipping_cost: { amount: centsFromDecimal(params.shipping) },
    });

    return {
      tax: (calculation.tax_amount_exclusive ?? 0) / 100,
      taxCalculationId: calculation.id ?? undefined,
    };
  } catch {
    return { tax: estimateTaxFallback(params.subtotal, params.address.state) };
  }
}

function estimateTaxFallback(subtotal: number, state: string): number {
  const rates: Record<string, number> = {
    CA: 0.0725,
    NY: 0.08,
    TX: 0.0625,
    FL: 0.06,
    IL: 0.0625,
  };
  const rate = rates[state?.toUpperCase()] ?? 0.05;
  return Math.round(subtotal * rate * 100) / 100;
}
