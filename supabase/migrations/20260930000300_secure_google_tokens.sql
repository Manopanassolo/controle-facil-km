-- Move Google OAuth secrets out of user-readable calendar_connections.

create table if not exists public.calendar_oauth_secrets (
  connection_id uuid primary key references public.calendar_connections(id) on delete cascade,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  token_type text not null default 'Bearer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

revoke all on table public.calendar_oauth_secrets from anon, authenticated;
alter table public.calendar_oauth_secrets enable row level security;

-- No authenticated policies intentionally.
-- Backend service-role access only.

insert into public.calendar_oauth_secrets(connection_id, access_token, refresh_token, token_expires_at)
select id, access_token, refresh_token, token_expires_at
from public.calendar_connections
where access_token is not null or refresh_token is not null
on conflict (connection_id) do update set
  access_token = excluded.access_token,
  refresh_token = coalesce(excluded.refresh_token, public.calendar_oauth_secrets.refresh_token),
  token_expires_at = excluded.token_expires_at,
  updated_at = now();

alter table public.calendar_connections
  drop column if exists access_token,
  drop column if exists refresh_token,
  drop column if exists token_expires_at;

create index if not exists calendar_oauth_secrets_expiry_idx
  on public.calendar_oauth_secrets(token_expires_at);

create or replace function private.calendar_secret_updated()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists calendar_oauth_secrets_updated_at on public.calendar_oauth_secrets;
create trigger calendar_oauth_secrets_updated_at
before update on public.calendar_oauth_secrets
for each row execute function private.calendar_secret_updated();

revoke execute on function private.calendar_secret_updated() from public, anon, authenticated;
