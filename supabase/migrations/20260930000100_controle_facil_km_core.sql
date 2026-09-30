-- Controle Fácil KM
-- Core data model v1
-- Independent personal-use mileage and expense application.
-- No enterprise/Movvant dependencies.

create extension if not exists pgcrypto;

create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Shared trigger helpers
-- ---------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.set_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.version = 1;
  else
    new.version = old.version + 1;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  default_vehicle_id uuid,
  currency text not null default 'BRL',
  distance_unit text not null default 'km',
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Vehicles
-- ---------------------------------------------------------------------------

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  model text,
  year integer check (year is null or year between 1886 and 2200),
  plate text,
  fuel_type text not null default 'flex'
    check (fuel_type in ('gasoline','ethanol','flex','diesel','electric','hybrid','other')),
  initial_odometer_m bigint not null default 0 check (initial_odometer_m >= 0),
  current_odometer_m bigint not null default 0 check (current_odometer_m >= 0),
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles
  drop constraint if exists profiles_default_vehicle_id_fkey;

alter table public.profiles
  add constraint profiles_default_vehicle_id_fkey
  foreign key (default_vehicle_id) references public.vehicles(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Trips
-- ---------------------------------------------------------------------------

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  trip_date date not null default current_date,
  start_time timestamptz,
  end_time timestamptz,
  origin text,
  destination text,
  start_odometer_m bigint not null check (start_odometer_m >= 0),
  end_odometer_m bigint check (end_odometer_m is null or end_odometer_m >= 0),
  distance_m bigint generated always as (
    case
      when end_odometer_m is not null and end_odometer_m >= start_odometer_m
      then end_odometer_m - start_odometer_m
      else null
    end
  ) stored,
  trip_type text not null default 'personal'
    check (trip_type in ('personal','work','other')),
  purpose text,
  notes text,
  status text not null default 'draft'
    check (status in ('draft','completed','cancelled')),
  latitude_start double precision,
  longitude_start double precision,
  latitude_end double precision,
  longitude_end double precision,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (end_odometer_m is null or end_odometer_m >= start_odometer_m),
  check (end_time is null or start_time is null or end_time >= start_time)
);

-- ---------------------------------------------------------------------------
-- Trip stops
-- ---------------------------------------------------------------------------

create table if not exists public.trip_stops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  sequence integer not null check (sequence > 0),
  name text not null,
  address text,
  latitude double precision,
  longitude double precision,
  arrival_at timestamptz,
  departure_at timestamptz,
  notes text,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (trip_id, sequence)
);

-- ---------------------------------------------------------------------------
-- Expense categories
-- ---------------------------------------------------------------------------

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  color text,
  sort_order integer not null default 0,
  is_system boolean not null default false,
  is_active boolean not null default true,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, name)
);

-- ---------------------------------------------------------------------------
-- Expenses
-- ---------------------------------------------------------------------------

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  trip_id uuid references public.trips(id) on delete set null,
  category_id uuid not null references public.expense_categories(id) on delete restrict,
  expense_date date not null default current_date,
  description text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  odometer_m bigint check (odometer_m is null or odometer_m >= 0),
  merchant text,
  payment_method text
    check (payment_method is null or payment_method in ('cash','debit','credit','pix','transfer','other')),
  notes text,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Attachments / receipt metadata
-- ---------------------------------------------------------------------------

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expense_id uuid references public.expenses(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  storage_path text not null unique,
  original_filename text,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  sha256 text,
  width integer,
  height integer,
  uploaded_at timestamptz,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    (expense_id is not null and trip_id is null)
    or
    (expense_id is null and trip_id is not null)
  )
);

-- ---------------------------------------------------------------------------
-- Odometer history
-- ---------------------------------------------------------------------------

create table if not exists public.odometer_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  odometer_m bigint not null check (odometer_m >= 0),
  recorded_at timestamptz not null default now(),
  source text not null default 'manual'
    check (source in ('manual','trip_start','trip_end','import')),
  trip_id uuid references public.trips(id) on delete set null,
  notes text,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- User settings
-- ---------------------------------------------------------------------------

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  default_trip_type text not null default 'personal'
    check (default_trip_type in ('personal','work','other')),
  default_vehicle_id uuid references public.vehicles(id) on delete set null,
  currency text not null default 'BRL',
  distance_unit text not null default 'km',
  auto_backup_enabled boolean not null default true,
  biometric_enabled boolean not null default false,
  pin_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists vehicles_user_id_idx
  on public.vehicles(user_id);

create index if not exists vehicles_user_active_idx
  on public.vehicles(user_id, is_active);

create index if not exists trips_user_id_idx
  on public.trips(user_id);

create index if not exists trips_user_date_idx
  on public.trips(user_id, trip_date desc);

create index if not exists trips_vehicle_date_idx
  on public.trips(vehicle_id, trip_date desc);

create index if not exists trips_user_status_idx
  on public.trips(user_id, status);

create index if not exists trip_stops_user_id_idx
  on public.trip_stops(user_id);

create index if not exists trip_stops_trip_sequence_idx
  on public.trip_stops(trip_id, sequence);

create index if not exists expense_categories_user_id_idx
  on public.expense_categories(user_id);

create index if not exists expense_categories_user_active_idx
  on public.expense_categories(user_id, is_active);

create index if not exists expenses_user_id_idx
  on public.expenses(user_id);

create index if not exists expenses_user_date_idx
  on public.expenses(user_id, expense_date desc);

create index if not exists expenses_vehicle_date_idx
  on public.expenses(vehicle_id, expense_date desc);

create index if not exists expenses_trip_id_idx
  on public.expenses(trip_id);

create index if not exists expenses_category_id_idx
  on public.expenses(category_id);

create index if not exists attachments_user_id_idx
  on public.attachments(user_id);

create index if not exists attachments_expense_id_idx
  on public.attachments(expense_id);

create index if not exists attachments_trip_id_idx
  on public.attachments(trip_id);

create index if not exists odometer_user_id_idx
  on public.odometer_entries(user_id);

create index if not exists odometer_vehicle_recorded_idx
  on public.odometer_entries(vehicle_id, recorded_at desc);

-- ---------------------------------------------------------------------------
-- Ownership consistency constraints/triggers
-- ---------------------------------------------------------------------------

create or replace function private.validate_trip_vehicle_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.vehicles v
    where v.id = new.vehicle_id
      and v.user_id = new.user_id
      and v.deleted_at is null
  ) then
    raise exception 'vehicle does not belong to user';
  end if;
  return new;
end;
$$;

create or replace function private.validate_stop_trip_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.trips t
    where t.id = new.trip_id
      and t.user_id = new.user_id
  ) then
    raise exception 'trip does not belong to user';
  end if;
  return new;
end;
$$;

create or replace function private.validate_expense_ownership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.vehicles v
    where v.id = new.vehicle_id and v.user_id = new.user_id
  ) then
    raise exception 'expense vehicle does not belong to user';
  end if;

  if not exists (
    select 1 from public.expense_categories c
    where c.id = new.category_id and c.user_id = new.user_id
  ) then
    raise exception 'expense category does not belong to user';
  end if;

  if new.trip_id is not null and not exists (
    select 1 from public.trips t
    where t.id = new.trip_id and t.user_id = new.user_id
  ) then
    raise exception 'expense trip does not belong to user';
  end if;

  return new;
end;
$$;

create or replace function private.validate_attachment_ownership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.expense_id is not null and not exists (
    select 1 from public.expenses e
    where e.id = new.expense_id and e.user_id = new.user_id
  ) then
    raise exception 'attachment expense does not belong to user';
  end if;

  if new.trip_id is not null and not exists (
    select 1 from public.trips t
    where t.id = new.trip_id and t.user_id = new.user_id
  ) then
    raise exception 'attachment trip does not belong to user';
  end if;

  return new;
end;
$$;

create or replace function private.validate_odometer_ownership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.vehicles v
    where v.id = new.vehicle_id and v.user_id = new.user_id
  ) then
    raise exception 'odometer vehicle does not belong to user';
  end if;

  if new.trip_id is not null and not exists (
    select 1 from public.trips t
    where t.id = new.trip_id and t.user_id = new.user_id
  ) then
    raise exception 'odometer trip does not belong to user';
  end if;

  return new;
end;
$$;

drop trigger if exists trips_validate_vehicle_owner on public.trips;
create trigger trips_validate_vehicle_owner
before insert or update on public.trips
for each row execute function private.validate_trip_vehicle_owner();

drop trigger if exists trip_stops_validate_owner on public.trip_stops;
create trigger trip_stops_validate_owner
before insert or update on public.trip_stops
for each row execute function private.validate_stop_trip_owner();

drop trigger if exists expenses_validate_ownership on public.expenses;
create trigger expenses_validate_ownership
before insert or update on public.expenses
for each row execute function private.validate_expense_ownership();

drop trigger if exists attachments_validate_ownership on public.attachments;
create trigger attachments_validate_ownership
before insert or update on public.attachments
for each row execute function private.validate_attachment_ownership();

drop trigger if exists odometer_validate_ownership on public.odometer_entries;
create trigger odometer_validate_ownership
before insert or update on public.odometer_entries
for each row execute function private.validate_odometer_ownership();

-- ---------------------------------------------------------------------------
-- updated_at / version triggers
-- ---------------------------------------------------------------------------

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

drop trigger if exists vehicles_version on public.vehicles;
create trigger vehicles_version
before update on public.vehicles
for each row execute function private.set_version();

drop trigger if exists trips_version on public.trips;
create trigger trips_version
before update on public.trips
for each row execute function private.set_version();

drop trigger if exists trip_stops_version on public.trip_stops;
create trigger trip_stops_version
before update on public.trip_stops
for each row execute function private.set_version();

drop trigger if exists expense_categories_version on public.expense_categories;
create trigger expense_categories_version
before update on public.expense_categories
for each row execute function private.set_version();

drop trigger if exists expenses_version on public.expenses;
create trigger expenses_version
before update on public.expenses
for each row execute function private.set_version();

drop trigger if exists attachments_version on public.attachments;
create trigger attachments_version
before update on public.attachments
for each row execute function private.set_version();

drop trigger if exists odometer_entries_version on public.odometer_entries;
create trigger odometer_entries_version
before update on public.odometer_entries
for each row execute function private.set_version();

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
before update on public.user_settings
for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_stops enable row level security;
alter table public.expense_categories enable row level security;
alter table public.expenses enable row level security;
alter table public.attachments enable row level security;
alter table public.odometer_entries enable row level security;
alter table public.user_settings enable row level security;

revoke all on table
  public.profiles,
  public.vehicles,
  public.trips,
  public.trip_stops,
  public.expense_categories,
  public.expenses,
  public.attachments,
  public.odometer_entries,
  public.user_settings
from anon;

grant select, insert, update, delete on table
  public.profiles,
  public.vehicles,
  public.trips,
  public.trip_stops,
  public.expense_categories,
  public.expenses,
  public.attachments,
  public.odometer_entries,
  public.user_settings
to authenticated;

-- Profiles use id as the auth identity.
create policy profiles_select_own on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy profiles_delete_own on public.profiles
for delete to authenticated
using ((select auth.uid()) = id);

-- All remaining user-owned tables use user_id.
do $$
declare
  t text;
begin
  foreach t in array array[
    'vehicles',
    'trips',
    'trip_stops',
    'expense_categories',
    'expenses',
    'attachments',
    'odometer_entries'
  ]
  loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t || '_select_own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t || '_insert_own', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t || '_update_own', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t || '_delete_own', t);
  end loop;
end $$;

create policy user_settings_select_own on public.user_settings
for select to authenticated
using ((select auth.uid()) = user_id);

create policy user_settings_insert_own on public.user_settings
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy user_settings_update_own on public.user_settings
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy user_settings_delete_own on public.user_settings
for delete to authenticated
using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Private receipt bucket and object policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do update set public = false;

create policy receipts_select_own
on storage.objects for select
to authenticated
using (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy receipts_insert_own
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy receipts_update_own
on storage.objects for update
to authenticated
using (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy receipts_delete_own
on storage.objects for delete
to authenticated
using (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- ---------------------------------------------------------------------------
-- Default categories
-- ---------------------------------------------------------------------------

create or replace function private.seed_default_categories()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.expense_categories (user_id, name, icon, is_system, sort_order)
  values
    (new.id, 'Combustível', 'fuel', true, 10),
    (new.id, 'Pedágio', 'toll', true, 20),
    (new.id, 'Estacionamento', 'parking', true, 30),
    (new.id, 'Alimentação', 'restaurant', true, 40),
    (new.id, 'Manutenção', 'wrench', true, 50),
    (new.id, 'Lavagem', 'car-wash', true, 60),
    (new.id, 'Seguro', 'shield', true, 70),
    (new.id, 'IPVA', 'file-text', true, 80),
    (new.id, 'Outros', 'more-horizontal', true, 90)
  on conflict (user_id, name) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke execute on function private.seed_default_categories() from public;
revoke execute on function private.seed_default_categories() from anon, authenticated;

drop trigger if exists profile_defaults_after_insert on public.profiles;
create trigger profile_defaults_after_insert
after insert on public.profiles
for each row execute function private.seed_default_categories();

-- ---------------------------------------------------------------------------
-- Cleanup permissions for private schema
-- ---------------------------------------------------------------------------

revoke all on schema private from public;
revoke all on all functions in schema private from public;
