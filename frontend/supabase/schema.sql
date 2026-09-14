-- ============================================================
-- CAdwuma — Full Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES  (extends auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  first_name   text,
  last_name    text,
  phone        text,
  address      text,
  avatar_url   text,
  role         text not null default 'customer' check (role in ('customer', 'provider')),
  created_at   timestamptz default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. ARTISAN PROFILES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.artisan_profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  bio               text,
  category          text check (category in ('Domestic','Commercial','Industrial','Professional')),
  subcategory       text,
  region            text,
  area              text,
  starting_price    numeric(12,2) default 0,
  experience_years  int default 0,
  is_verified       boolean default false,
  is_available      boolean default true,
  rating            numeric(3,1) default 0,
  jobs_completed    int default 0,
  skills            jsonb default '[]'::jsonb,
  portfolio_images  jsonb default '[]'::jsonb,
  created_at        timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. SERVICE REQUESTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.service_requests (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.profiles(id) on delete cascade,
  artisan_id      uuid references public.artisan_profiles(id) on delete set null,
  request_type    text not null check (request_type in ('flex','premium')),
  category        text,
  subcategory     text,
  title           text not null,
  description     text,
  location        text,
  scheduled_at    timestamptz,
  budget_type     text default 'open' check (budget_type in ('fixed','open')),
  budget_amount   numeric(12,2),
  status          text not null default 'pending'
                    check (status in ('pending','in_progress','completed','cancelled')),
  images          jsonb default '[]'::jsonb,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. MESSAGES (real-time chat)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.service_requests(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  text        text not null,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 5. WALLET & TRANSACTIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.wallets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.profiles(id) on delete cascade,
  balance    numeric(12,2) not null default 0 check (balance >= 0),
  created_at timestamptz default now()
);

-- Auto-create wallet when profile is created
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

create table if not exists public.wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('deposit','withdrawal','escrow_hold','escrow_release','payout')),
  amount      numeric(12,2) not null,
  description text,
  status      text not null default 'pending' check (status in ('pending','success','failed')),
  reference   text,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 6. REVIEWS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid references public.service_requests(id) on delete set null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  artisan_id  uuid not null references public.artisan_profiles(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now(),
  unique (request_id, customer_id)   -- one review per request
);

-- Update artisan rating after each review
create or replace function public.update_artisan_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.artisan_profiles
  set rating = (
    select round(avg(rating)::numeric, 1)
    from public.reviews
    where artisan_id = new.artisan_id
  )
  where id = new.artisan_id;
  return new;
end;
$$;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert or update on public.reviews
  for each row execute procedure public.update_artisan_rating();