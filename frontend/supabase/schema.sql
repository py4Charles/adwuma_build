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

  -- ─────────────────────────────────────────────────────────────
-- 7. SUPPORT TICKETS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.support_tickets (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  request_id   uuid references public.service_requests(id) on delete set null,
  subject_type text not null,
  description  text not null,
  status       text not null default 'open' check (status in ('open','in_review','resolved')),
  last_update  text,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  text       text not null,
  type       text default 'info' check (type in ('info','success','warning','error')),
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- 8b. PROVIDER REQUESTS (service-provider verification)
create table if not exists public.provider_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  proof       text not null,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 9. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.artisan_profiles    enable row level security;
alter table public.service_requests    enable row level security;
alter table public.messages            enable row level security;
alter table public.wallets             enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.reviews             enable row level security;
alter table public.support_tickets     enable row level security;
alter table public.notifications       enable row level security;
alter table public.provider_requests   enable row level security;

-- PROFILES
create policy "Profiles: public read"    on public.profiles for select using (true);
create policy "Profiles: own insert"     on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles: own update"     on public.profiles for update using (auth.uid() = id);

-- ARTISAN PROFILES
create policy "Artisans: public read"    on public.artisan_profiles for select using (true);
create policy "Artisans: own insert"     on public.artisan_profiles for insert with check (auth.uid() = user_id);
create policy "Artisans: own update"     on public.artisan_profiles for update using (auth.uid() = user_id);

-- SERVICE REQUESTS
create policy "Requests: own read"       on public.service_requests for select
  using (auth.uid() = customer_id or exists (
    select 1 from public.artisan_profiles ap where ap.id = artisan_id and ap.user_id = auth.uid()
  ));
create policy "Requests: customer insert" on public.service_requests for insert with check (auth.uid() = customer_id);
create policy "Requests: participants update" on public.service_requests for update
  using (auth.uid() = customer_id or exists (
    select 1 from public.artisan_profiles ap where ap.id = artisan_id and ap.user_id = auth.uid()
  ));

-- MESSAGES
create policy "Messages: participants read" on public.messages for select
  using (exists (
    select 1 from public.service_requests sr
    where sr.id = request_id
      and (sr.customer_id = auth.uid() or exists (
        select 1 from public.artisan_profiles ap where ap.id = sr.artisan_id and ap.user_id = auth.uid()
      ))
  ));
create policy "Messages: participants send" on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.service_requests sr
      where sr.id = request_id
        and (sr.customer_id = auth.uid() or exists (
          select 1 from public.artisan_profiles ap where ap.id = sr.artisan_id and ap.user_id = auth.uid()
        ))
    )
  );

-- WALLETS
create policy "Wallets: own read"        on public.wallets for select using (auth.uid() = user_id);
create policy "Wallets: own update"      on public.wallets for update using (auth.uid() = user_id);

-- WALLET TRANSACTIONS
create policy "Txns: own read"           on public.wallet_transactions for select using (auth.uid() = user_id);
create policy "Txns: own insert"         on public.wallet_transactions for insert with check (auth.uid() = user_id);

-- REVIEWS
create policy "Reviews: public read"     on public.reviews for select using (true);
create policy "Reviews: customer insert" on public.reviews for insert with check (auth.uid() = customer_id);

-- SUPPORT TICKETS
create policy "Tickets: own read"        on public.support_tickets for select using (auth.uid() = customer_id);
create policy "Tickets: own insert"      on public.support_tickets for insert with check (auth.uid() = customer_id);

-- NOTIFICATIONS
create policy "Notifs: own read"         on public.notifications for select using (auth.uid() = user_id);
create policy "Notifs: own update"       on public.notifications for update using (auth.uid() = user_id);

-- PROVIDER REQUESTS
create policy "ProviderReq: own insert"  on public.provider_requests for insert with check (auth.uid() = user_id);
create policy "ProviderReq: own read"    on public.provider_requests for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 10. REALTIME (enable for messages & notifications)
-- ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.service_requests;

-- ─────────────────────────────────────────────────────────────
-- 11. SEED — sample artisans (optional, for demo)
-- ─────────────────────────────────────────────────────────────
-- (Artisan accounts can be created through the signup flow with role='provider')