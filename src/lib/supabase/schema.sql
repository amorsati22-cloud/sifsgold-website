-- Sif's Gold — Auth & profiles schema
-- Paste into Supabase SQL Editor (Dashboard → SQL → New query).
-- Run in order. Safe to re-run only where noted; prefer fresh project for first apply.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Pricing tier registry (referenced by profiles.subscription_tier)
-- ---------------------------------------------------------------------------
create schema if not exists pricing;

create table if not exists pricing.tiers (
  id text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

insert into pricing.tiers (id, label) values
  ('student-free', 'Student Free'),
  ('student', 'Student'),
  ('licensed-pro-standard', 'Licensed Pro Standard'),
  ('licensed-pro-pro', 'Licensed Pro Pro'),
  ('licensed-pro-premium', 'Licensed Pro Premium'),
  ('school-free', 'School Free'),
  ('school-pro', 'School Pro'),
  ('school-premium', 'School Premium'),
  ('salon-standard', 'Salon Standard'),
  ('salon-pro', 'Salon Pro'),
  ('salon-premium', 'Salon Premium'),
  ('brand-partner', 'Brand Partner'),
  ('client-free', 'Client Free')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text unique not null,
  full_name text,
  avatar_url text,
  user_type text check (
    user_type is null or user_type in (
      'client',
      'student',
      'licensed_pro',
      'salon',
      'school',
      'brand_partner',
      'sifs_advocate',
      'fashion_pro'
    )
  ),
  founding_member boolean not null default false,
  founding_member_at timestamptz,
  email_verified boolean not null default false,
  onboarded boolean not null default false,
  subscription_tier text references pricing.tiers (id),
  subscription_status text not null default 'none' check (
    subscription_status in ('active', 'past_due', 'canceled', 'none')
  ),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  locale text not null default 'en-US',
  timezone text,
  marketing_emails boolean not null default true,
  transactional_emails boolean not null default true
);

-- ---------------------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text not null,
  user_type text,
  referral_code text,
  converted_to_user boolean not null default false,
  user_id uuid references public.profiles (id) on delete set null
);

create index if not exists waitlist_email_idx on public.waitlist (lower(email));
create index if not exists waitlist_source_idx on public.waitlist (source);

-- ---------------------------------------------------------------------------
-- advocate_applications
-- ---------------------------------------------------------------------------
create table if not exists public.advocate_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  full_name text not null,
  social_handles text,
  specialty text,
  sample_content_urls text[],
  license_status text,
  reason text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'waitlist')
  ),
  reviewed_at timestamptz,
  reviewer_notes text
);

create index if not exists advocate_applications_email_idx on public.advocate_applications (lower(email));

-- ---------------------------------------------------------------------------
-- email_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.email_preferences (
  id uuid primary key references public.profiles (id) on delete cascade,
  marketing boolean not null default true,
  product_updates boolean not null default true,
  brand_partner_offers boolean not null default false,
  founding_member_updates boolean not null default true,
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.waitlist enable row level security;
alter table public.advocate_applications enable row level security;
alter table public.email_preferences enable row level security;

-- profiles
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Service role reads all profiles" on public.profiles;
create policy "Service role reads all profiles"
  on public.profiles for select
  to service_role
  using (true);

-- waitlist
drop policy if exists "Anyone can insert waitlist" on public.waitlist;
create policy "Anyone can insert waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Service role reads all waitlist" on public.waitlist;
create policy "Service role reads all waitlist"
  on public.waitlist for select
  to service_role
  using (true);

-- advocate_applications
drop policy if exists "Anyone can insert advocate applications" on public.advocate_applications;
create policy "Anyone can insert advocate applications"
  on public.advocate_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Applicants read own advocate application" on public.advocate_applications;
create policy "Applicants read own advocate application"
  on public.advocate_applications for select
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "Service role reads all advocate applications" on public.advocate_applications;
create policy "Service role reads all advocate applications"
  on public.advocate_applications for select
  to service_role
  using (true);

-- email_preferences
drop policy if exists "Users read own email preferences" on public.email_preferences;
create policy "Users read own email preferences"
  on public.email_preferences for select
  using (auth.uid() = id);

drop policy if exists "Users update own email preferences" on public.email_preferences;
create policy "Users update own email preferences"
  on public.email_preferences for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Service role reads all email preferences" on public.email_preferences;
create policy "Service role reads all email preferences"
  on public.email_preferences for select
  to service_role
  using (true);

-- ---------------------------------------------------------------------------
-- Triggers: profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb;
  resolved_user_type text;
  resolved_full_name text;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  resolved_user_type := nullif(meta ->> 'user_type', '');
  resolved_full_name := nullif(meta ->> 'full_name', '');

  insert into public.profiles (
    id,
    email,
    full_name,
    user_type,
    email_verified,
    marketing_emails,
    transactional_emails
  )
  values (
    new.id,
    new.email,
    resolved_full_name,
    resolved_user_type,
    coalesce(new.email_confirmed_at is not null, false),
    coalesce((meta ->> 'marketing_emails')::boolean, true),
    true
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    user_type = coalesce(excluded.user_type, public.profiles.user_type),
    email_verified = coalesce(new.email_confirmed_at is not null, public.profiles.email_verified);

  insert into public.email_preferences (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists trigger_create_profile_on_signup on auth.users;
create trigger trigger_create_profile_on_signup
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Triggers: updated_at on profiles
-- ---------------------------------------------------------------------------
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_update_profile_timestamp on public.profiles;
create trigger trigger_update_profile_timestamp
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- ---------------------------------------------------------------------------
-- Sync email_verified when auth.users confirms email
-- ---------------------------------------------------------------------------
create or replace function public.sync_profile_email_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and (old.email_confirmed_at is null or old.email_confirmed_at <> new.email_confirmed_at) then
    update public.profiles
    set email_verified = true
    where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_sync_profile_email_verified on auth.users;
create trigger trigger_sync_profile_email_verified
  after update of email_confirmed_at on auth.users
  for each row execute function public.sync_profile_email_verified();
