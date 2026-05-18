import type { VaultDocumentType } from "@/lib/vault/constants";

export type VaultSettings = {
  id: string;
  pin_hash: string | null;
  pin_set_at: string | null;
  failed_attempts: number;
  locked_until: string | null;
  reauthenticate_after_minutes: number;
  backup_email: string | null;
  backup_email_verified: boolean;
  auto_lock_on_tab_close: boolean;
};

export type VaultFolder = {
  id: string;
  user_id: string;
  parent_folder_id: string | null;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
};

export type VaultDocument = {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  document_type: VaultDocumentType;
  file_url: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  thumbnail_url: string | null;
  encrypted_metadata: string | null;
  linked_client_id: string | null;
  linked_appointment_id: string | null;
  expiry_date: string | null;
  reminder_days_before: number | null;
  starred: boolean;
  created_at: string;
  updated_at: string;
};

export type VaultAccessLogEntry = {
  id: string;
  action: string;
  target_document_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type VaultDocumentMetadata = {
  notes?: string;
  tags?: string[];
};
