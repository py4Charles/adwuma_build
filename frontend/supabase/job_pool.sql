-- ============================================================
-- JOB POOL — provider visibility + atomic job claiming
-- Run this in the Supabase SQL Editor, AFTER schema.sql
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. WHY THIS IS NEEDED
-- ─────────────────────────────────────────────────────────────
-- schema.sql's only select policy on service_requests is:
--
--   using (auth.uid() = customer_id or exists (
--     select 1 from artisan_profiles ap
--     where ap.id = artisan_id and ap.user_id = auth.uid()
--   ))
--
-- For an *unassigned* request, artisan_id is NULL. `ap.id = NULL` is never
-- true, so the second branch fails for every provider. The job pool is
-- therefore invisible: requestsApi.listOpen() returns [] for all providers.
-- The update policy has the same hole, so a provider cannot claim a job.
--
-- Fix: give providers an explicit read path for open flex work, and move
-- claiming into a SECURITY DEFINER function that does a compare-and-swap.

-- ─────────────────────────────────────────────────────────────
-- 1a. ONE PROFILE PER PROVIDER
-- ─────────────────────────────────────────────────────────────
-- schema.sql declares artisan_profiles.user_id as a plain FK, not UNIQUE. That
-- breaks two things:
--   * artisansApi.upsert uses onConflict: 'user_id', which needs a unique or
--     exclusion constraint -- it fails outright without this index.
--   * artisansApi.getMine uses .single(), which errors if a provider has two
--     rows.
--
-- If this errors with "could not create unique index", a provider already has
-- duplicate profiles. Find and remove them first:
--   select user_id, count(*) from public.artisan_profiles
--   group by user_id having count(*) > 1;
create unique index if not exists artisan_profiles_user_id_key
  on public.artisan_profiles (user_id);

-- ─────────────────────────────────────────────────────────────
-- 2. PROVIDERS CAN READ OPEN FLEX REQUESTS
-- ─────────────────────────────────────────────────────────────
-- Scoped to request_type='flex' AND status='pending' so providers cannot read
-- other people's premium bookings or completed/in-progress work.
drop policy if exists "Requests: providers read open flex" on public.service_requests;
create policy "Requests: providers read open flex" on public.service_requests for select
  using (
    request_type = 'flex'
    and status = 'pending'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'provider'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 3. ATOMIC CLAIM (compare-and-swap)
-- ─────────────────────────────────────────────────────────────
-- Why a function instead of a plain UPDATE from the client:
--
--   update service_requests set artisan_id = X where id = R
--
-- is a read-modify-write with no guard. Two providers tapping Accept at the
-- same time both run it, both get a success response, and the last write wins
-- while the first provider believes it has the job.
--
-- Adding `and artisan_id is null` to the WHERE clause makes it a
-- compare-and-swap: the row lock is taken by UPDATE, so exactly one
-- transaction can move the row out of the 'pending' state. The loser updates
-- zero rows and gets NULL back.
--
-- SECURITY DEFINER is required because the caller's RLS does not permit
-- updating a request they are not yet assigned to. The function itself
-- re-derives trust from auth.uid() — it checks that the caller owns the
-- artisan profile they are claiming with, and that the request is still open.
create or replace function public.claim_request(p_request_id uuid, p_artisan_profile_id uuid)
returns public.service_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.service_requests;
begin
  -- The caller must own the artisan profile they are claiming with.
  if not exists (
    select 1 from public.artisan_profiles ap
    where ap.id = p_artisan_profile_id and ap.user_id = auth.uid()
  ) then
    raise exception 'claim_request: caller does not own artisan profile %', p_artisan_profile_id
      using errcode = '42501';
  end if;

  update public.service_requests
     set artisan_id = p_artisan_profile_id,
         status     = 'in_progress'
   where id              = p_request_id
     and request_type    = 'flex'
     and status          = 'pending'
     and artisan_id      is null
  returning * into claimed;

  -- Zero rows updated => someone else got there first. Signal that to the client.
  return claimed;
end;
$$;

revoke all on function public.claim_request(uuid, uuid) from public;
grant execute on function public.claim_request(uuid, uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- 4. VERIFY (read-only, safe to run)
-- ─────────────────────────────────────────────────────────────
-- Function exists and is executable by authenticated:
-- select routine_name, security_type
-- from information_schema.routines
-- where routine_schema = 'public' and routine_name = 'claim_request';

-- Provider job-pool policy exists:
-- select policyname, cmd from pg_policies
-- where schemaname = 'public' and tablename = 'service_requests';
