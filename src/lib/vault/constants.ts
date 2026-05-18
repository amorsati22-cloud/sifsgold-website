export const VAULT_STORAGE_BUCKET = "vault-documents";

/** Signed URL lifetime (seconds) */
export const VAULT_SIGNED_URL_EXPIRY_SEC = 60 * 5;

export const VAULT_MAX_PIN_ATTEMPTS = 5;
export const VAULT_LOCKOUT_MINUTES = 15;

export const VAULT_SESSION_KEY = "sifs_vault_session";
export const VAULT_CRYPTO_KEY_STORAGE = "sifs_vault_crypto_key";

export const DOCUMENT_TYPES = [
  { value: "license", label: "License" },
  { value: "insurance", label: "Insurance" },
  { value: "contract", label: "Contract" },
  { value: "tax_form", label: "Tax form" },
  { value: "client_record", label: "Client record" },
  { value: "color_formula", label: "Color formula" },
  { value: "receipt", label: "Receipt" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
] as const;

export type VaultDocumentType = (typeof DOCUMENT_TYPES)[number]["value"];

export const SHARE_EXPIRY_OPTIONS = [
  { value: 1, label: "1 hour" },
  { value: 24, label: "24 hours" },
  { value: 168, label: "7 days" },
] as const;
