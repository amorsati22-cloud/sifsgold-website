"use client";

import { Web3FormsContact } from "@/components/marketing/Web3FormsContact";

type HelpContactFormProps = {
  accessKey: string;
};

const USER_TYPES = [
  "Student",
  "Professional",
  "Client",
  "School",
  "Salon",
  "Storefront",
  "Brand",
  "Other",
] as const;

export function HelpContactForm({ accessKey }: HelpContactFormProps) {
  return (
    <Web3FormsContact accessKey={accessKey} subject="Help Request">
      <div>
        <label htmlFor="help-name" className="block text-sm font-medium text-offwhite">
          Name
        </label>
        <input
          id="help-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="help-user-type" className="block text-sm font-medium text-offwhite">
          User type
        </label>
        <select
          id="help-user-type"
          name="user_type"
          required
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 focus:border-gold focus:ring-4"
          defaultValue=""
        >
          <option value="" disabled>
            Select…
          </option>
          {USER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="help-message" className="block text-sm font-medium text-offwhite">
          Message
        </label>
        <textarea
          id="help-message"
          name="message"
          required
          rows={6}
          className="mt-1.5 w-full resize-y rounded-xl border border-white/20 bg-navy-dark/60 px-4 py-3 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          placeholder="Describe your question or issue."
        />
      </div>
    </Web3FormsContact>
  );
}
