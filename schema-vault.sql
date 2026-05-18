-- The Vault — encrypted document storage for licensed pros
-- Run after public.profiles and public.appointments exist.
-- Client-side AES-256-GCM ciphertext in Storage; PIN hash (argon2) in vault_settings.
-- service_role has NO table access to vault data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- vault_settings (one row per pro, id = profile id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_settings (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  pin_hash text,
  pin_set_at timestamptz,
  failed_attempts integer DEFAULT 0,
  locked_until timestamptz,
  reauthenticate_after_minutes integer DEFAULT 5,
  backup_email text,
  backup_email_verified boolean DEFAULT false,
  auto_lock_on_tab_close boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- vault_folders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_folder_id uuid REFERENCES public.vault_folders(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_folders_user_idx ON public.vault_folders (user_id);
CREATE INDEX IF NOT EXISTS vault_folders_parent_idx ON public.vault_folders (parent_folder_id);

-- ---------------------------------------------------------------------------
-- vault_documents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES public.vault_folders(id) ON DELETE SET NULL,
  name text NOT NULL,
  document_type text NOT NULL DEFAULT 'other'
    CHECK (document_type IN (
      'license', 'insurance', 'contract', 'tax_form', 'client_record',
      'color_formula', 'receipt', 'certification', 'other'
    )),
  file_url text NOT NULL,
  file_size_bytes bigint,
  mime_type text,
  thumbnail_url text,
  encrypted_metadata text,
  linked_client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  linked_appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  expiry_date date,
  reminder_days_before integer,
  starred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_documents_user_idx ON public.vault_documents (user_id);
CREATE INDEX IF NOT EXISTS vault_documents_folder_idx ON public.vault_documents (folder_id);
CREATE INDEX IF NOT EXISTS vault_documents_expiry_idx ON public.vault_documents (user_id, expiry_date);

-- ---------------------------------------------------------------------------
-- vault_access_log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL
    CHECK (action IN (
      'unlock', 'view_document', 'download_document', 'edit_document',
      'delete_document', 'failed_pin', 'share_created', 'export_vault'
    )),
  target_document_id uuid REFERENCES public.vault_documents(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_access_log_user_idx ON public.vault_access_log (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- vault_shared_documents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_shared_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.vault_documents(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with_email text,
  share_link_token text UNIQUE,
  expires_at timestamptz,
  view_count integer DEFAULT 0,
  max_views integer,
  password_protected boolean DEFAULT false,
  password_hash text,
  view_only boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_shared_token_idx ON public.vault_shared_documents (share_link_token);

-- ---------------------------------------------------------------------------
-- RLS — authenticated users only; service_role denied below
-- ---------------------------------------------------------------------------
ALTER TABLE public.vault_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_shared_documents ENABLE ROW LEVEL SECURITY;

-- vault_settings
DROP POLICY IF EXISTS "Users access only own vault settings" ON public.vault_settings;
CREATE POLICY "Users access only own vault settings"
  ON public.vault_settings FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- vault_folders
DROP POLICY IF EXISTS "Users access only own vault folders" ON public.vault_folders;
CREATE POLICY "Users access only own vault folders"
  ON public.vault_folders FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- vault_documents
DROP POLICY IF EXISTS "Users access only own vault documents" ON public.vault_documents;
CREATE POLICY "Users access only own vault documents"
  ON public.vault_documents FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- vault_access_log (insert + select own)
DROP POLICY IF EXISTS "Users access only own vault access log" ON public.vault_access_log;
CREATE POLICY "Users access only own vault access log"
  ON public.vault_access_log FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- vault_shared_documents
DROP POLICY IF EXISTS "Users manage own vault shares" ON public.vault_shared_documents;
CREATE POLICY "Users manage own vault shares"
  ON public.vault_shared_documents FOR ALL
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Explicit DENY service_role (no admin / service_role reads of vault contents)
-- ---------------------------------------------------------------------------
REVOKE ALL ON public.vault_settings FROM service_role;
REVOKE ALL ON public.vault_folders FROM service_role;
REVOKE ALL ON public.vault_documents FROM service_role;
REVOKE ALL ON public.vault_access_log FROM service_role;
REVOKE ALL ON public.vault_shared_documents FROM service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vault_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vault_folders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vault_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vault_access_log TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vault_shared_documents TO authenticated;

-- Optional: encrypt metadata server-side with pgcrypto when a session key is supplied via RPC.
-- Primary encryption is client-side AES-256-GCM before upload.

CREATE OR REPLACE FUNCTION public.vault_encrypt_metadata(plaintext text, secret text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(pgp_sym_encrypt(plaintext, secret, 'cipher-algo=aes256'), 'base64');
$$;

CREATE OR REPLACE FUNCTION public.vault_decrypt_metadata(ciphertext text, secret text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pgp_sym_decrypt(decode(ciphertext, 'base64'), secret, 'cipher-algo=aes256');
$$;

REVOKE ALL ON FUNCTION public.vault_encrypt_metadata(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.vault_decrypt_metadata(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vault_encrypt_metadata(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vault_decrypt_metadata(text, text) TO authenticated;

-- Public share lookup by token only (no broad anon table access)
CREATE OR REPLACE FUNCTION public.get_vault_share_public(share_token text)
RETURNS TABLE (
  share_id uuid,
  document_id uuid,
  document_name text,
  expires_at timestamptz,
  view_count integer,
  max_views integer,
  password_protected boolean
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    s.id,
    s.document_id,
    d.name,
    s.expires_at,
    s.view_count,
    s.max_views,
    s.password_protected
  FROM public.vault_shared_documents s
  JOIN public.vault_documents d ON d.id = s.document_id
  WHERE s.share_link_token = share_token
    AND (s.expires_at IS NULL OR s.expires_at > now());
$$;

REVOKE ALL ON FUNCTION public.get_vault_share_public(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_vault_share_public(text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket: vault-documents (private)
-- Dashboard: Storage → New bucket → vault-documents (private)
-- Path pattern: {user_id}/{document_id}.bin
-- Policies (after bucket exists):
--   (storage.foldername(name))[1] = auth.uid()::text
-- ---------------------------------------------------------------------------
