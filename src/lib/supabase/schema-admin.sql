-- Sif's Gold — Admin command center schema
-- Paste into Supabase SQL Editor after schema.sql (Prompt 11).

-- ---------------------------------------------------------------------------
-- admin_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  admin_email text not null,
  action text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet
);

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_admin_email_idx on public.admin_audit_log (admin_email);

-- ---------------------------------------------------------------------------
-- email_campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  sent_by_email text not null,
  template_key text not null,
  segment text not null,
  custom_filter jsonb,
  recipient_count integer not null default 0,
  successful_sends integer not null default 0,
  failed_sends integer not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'sending', 'sent', 'failed')
  )
);

create index if not exists email_campaigns_created_at_idx on public.email_campaigns (created_at desc);

-- ---------------------------------------------------------------------------
-- support_tickets
-- ---------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  from_email text not null,
  subject text,
  body text not null,
  category text not null default 'general' check (
    category in ('billing', 'technical', 'advocate', 'brand_partner', 'general')
  ),
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'resolved', 'closed')
  ),
  assigned_to text,
  response text,
  responded_at timestamptz
);

create index if not exists support_tickets_status_idx on public.support_tickets (status);
create index if not exists support_tickets_created_at_idx on public.support_tickets (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger for support_tickets
-- ---------------------------------------------------------------------------
create or replace function public.set_support_tickets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_support_tickets_updated_at on public.support_tickets;
create trigger trigger_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_support_tickets_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — service_role only
-- ---------------------------------------------------------------------------
alter table public.admin_audit_log enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.support_tickets enable row level security;

drop policy if exists "Service role all admin_audit_log" on public.admin_audit_log;
create policy "Service role all admin_audit_log"
  on public.admin_audit_log for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role all email_campaigns" on public.email_campaigns;
create policy "Service role all email_campaigns"
  on public.email_campaigns for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role all support_tickets" on public.support_tickets;
create policy "Service role all support_tickets"
  on public.support_tickets for all
  to service_role
  using (true)
  with check (true);
