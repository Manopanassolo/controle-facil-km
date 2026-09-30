-- Controle Fácil KM V1: isolated Google OAuth state + idempotency hardening.
-- This migration is independent from Movvant.

create table if not exists public.calendar_oauth_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  state_hash text not null unique,
  redirect_uri text not null,
  code_verifier text,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.calendar_oauth_states enable row level security;
revoke all on table public.calendar_oauth_states from anon, authenticated;

create index if not exists calendar_oauth_states_expiry_idx
  on public.calendar_oauth_states(expires_at);

create unique index if not exists calendar_connections_one_google_per_user_idx
  on public.calendar_connections(user_id, provider);

create unique index if not exists calendar_events_google_identity_idx
  on public.calendar_events(connection_id, google_event_id)
  where google_event_id is not null;

create index if not exists calendar_events_local_identity_idx
  on public.calendar_events(connection_id, local_event_id)
  where local_event_id is not null;

create or replace function private.cleanup_calendar_oauth_states()
returns void
language sql
set search_path = ''
as $$
  delete from public.calendar_oauth_states
  where expires_at < now() or used_at is not null;
$$;

revoke execute on function private.cleanup_calendar_oauth_states() from public, anon, authenticated;
