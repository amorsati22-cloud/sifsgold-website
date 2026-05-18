"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/shop/types";

const ReactImageMagnify = dynamic(() => import("react-image-magnify"), { ssr: false });

type Props = {
  images: ProductImage[];
  productName: string;
};

export function ProductImageGallery({ images, productName }: Props) {
  const sorted = [...(images ?? [])].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
  const [active, setActive] = useState(0);
  const current = sorted[active] ?? sorted[0];

  if (!current?.url) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-brand-md bg-navy-lift text-gold-body">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-brand-md bg-navy-deep">
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: current.alt_text || productName,
              isFluidWidth: true,
              src: current.url,
            },
            largeImage: {
              src: current.url,
              width: 1200,
              height: 1200,
            },
            enlargedImageContainerDimensions: { width: "150%", height: "150%" },
            isHintEnabled: true,
            shouldUsePositiveSpaceLens: true,
          }}
        />
      </div>
      {sorted.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" role="list">
          {sorted.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-brand-sm border-2 focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy ${
                  i === active ? "border-gold" : "border-transparent"
                }`}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
