import "server-only";

import EasyPostClient from "@easypost/api";
import type { ShippingAddress, ShippingRateOption } from "@/lib/shop/types";

type ParcelInput = {
  weightOz: number;
  lengthIn?: number;
  widthIn?: number;
  heightIn?: number;
};

function getEasyPost(): InstanceType<typeof EasyPostClient> | null {
  const key = process.env.EASYPOST_API_KEY;
  if (!key) return null;
  return new EasyPostClient(key);
}

export async function getShippingRates(params: {
  fromZip: string;
  toAddress: ShippingAddress;
  parcels: ParcelInput[];
}): Promise<ShippingRateOption[]> {
  const client = getEasyPost();
  if (!client) {
    return fallbackFlatRates(params.parcels);
  }

  try {
    const fromAddress = await client.Address.create({
      zip: params.fromZip,
      country: "US",
    });

    const toAddress = await client.Address.create({
      street1: params.toAddress.line1,
      street2: params.toAddress.line2,
      city: params.toAddress.city,
      state: params.toAddress.state,
      zip: params.toAddress.postal_code,
      country: params.toAddress.country || "US",
    });

    const totalWeight = params.parcels.reduce((s, p) => s + p.weightOz, 0) || 16;

    const shipment = await client.Shipment.create({
      from_address: fromAddress,
      to_address: toAddress,
      parcel: {
        weight: totalWeight,
      },
    });

    return (shipment.rates ?? []).map((rate) => ({
      id: rate.id,
      carrier: rate.carrier,
      service: rate.service,
      rate: parseFloat(rate.rate),
      currency: rate.currency,
      estimated_days: rate.delivery_days ?? null,
    }));
  } catch {
    return fallbackFlatRates(params.parcels);
  }
}

function fallbackFlatRates(parcels: ParcelInput[]): ShippingRateOption[] {
  const totalWeight = parcels.reduce((s, p) => s + p.weightOz, 0) || 16;
  const base = totalWeight > 32 ? 12.99 : totalWeight > 16 ? 8.99 : 5.99;

  return [
    {
      id: "flat_standard",
      carrier: "USPS",
      service: "Ground Advantage",
      rate: base,
      currency: "USD",
      estimated_days: 5,
    },
    {
      id: "flat_priority",
      carrier: "USPS",
      service: "Priority Mail",
      rate: base + 6,
      currency: "USD",
      estimated_days: 2,
    },
  ];
}

export async function purchaseReturnLabel(params: {
  fromAddress: ShippingAddress;
  toZip: string;
  weightOz: number;
}): Promise<{ labelUrl: string | null; trackingNumber: string | null }> {
  const client = getEasyPost();
  if (!client) {
    return { labelUrl: null, trackingNumber: null };
  }

  try {
    const from = await client.Address.create({
      street1: params.fromAddress.line1,
      street2: params.fromAddress.line2,
      city: params.fromAddress.city,
      state: params.fromAddress.state,
      zip: params.fromAddress.postal_code,
      country: params.fromAddress.country || "US",
    });

    const to = await client.Address.create({
      zip: params.toZip,
      country: "US",
    });

    const shipment = await client.Shipment.create({
      from_address: from,
      to_address: to,
      parcel: { weight: params.weightOz || 16 },
      is_return: true,
    });

    const rate = shipment.lowestRate();
    const bought = await client.Shipment.buy(shipment.id, rate);

    return {
      labelUrl: bought.postage_label?.label_url ?? null,
      trackingNumber: bought.tracking_code ?? null,
    };
  } catch {
    return { labelUrl: null, trackingNumber: null };
  }
}
