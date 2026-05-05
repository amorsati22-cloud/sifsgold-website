"use client";

import { Web3FormsContact } from "@/components/marketing/Web3FormsContact";

type CareersInquiryFormProps = {
  accessKey: string;
};

export function CareersInquiryForm({ accessKey }: CareersInquiryFormProps) {
  return (
    <Web3FormsContact accessKey={accessKey} subject="Careers Inquiry">
      <div>
        <label htmlFor="careers-name" className="block text-sm font-medium text-offwhite">
          Name
        </label>
        <input
          id="careers-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="careers-message" className="block text-sm font-medium text-offwhite">
          Message
        </label>
        <textarea
          id="careers-message"
          name="message"
          required
          rows={6}
          className="mt-1.5 w-full resize-y rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Tell us how you’d like to contribute or collaborate."
        />
      </div>
    </Web3FormsContact>
  );
}
