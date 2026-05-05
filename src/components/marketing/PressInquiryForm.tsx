"use client";

import { Web3FormsContact } from "@/components/marketing/Web3FormsContact";

type PressInquiryFormProps = {
  accessKey: string;
};

export function PressInquiryForm({ accessKey }: PressInquiryFormProps) {
  return (
    <Web3FormsContact accessKey={accessKey} subject="Press Inquiry">
      <div>
        <label htmlFor="press-name" className="block text-sm font-medium text-offwhite">
          Name
        </label>
        <input
          id="press-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="press-publication" className="block text-sm font-medium text-offwhite">
          Publication
        </label>
        <input
          id="press-publication"
          name="publication"
          type="text"
          required
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Outlet or beat"
        />
      </div>
      <div>
        <label htmlFor="press-query" className="block text-sm font-medium text-offwhite">
          Query
        </label>
        <textarea
          id="press-query"
          name="query"
          required
          rows={5}
          className="mt-1.5 w-full resize-y rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="What can we help with?"
        />
      </div>
    </Web3FormsContact>
  );
}
