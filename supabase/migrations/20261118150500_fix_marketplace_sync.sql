-- ==============================================================================
-- MANAFORGE: FIX MULTI-USER MARKETPLACE SYNC, SCHEMA DRIFT, RLS & REALTIME
-- ==============================================================================

-- 1. Helper function to check Admin / Founder role safely without RLS recursion
create or replace function public.is_admin_or_founder()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'founder')
  );
$$;

-- 2. Ensure all required columns exist on public.profiles & public.listings
alter table public.profiles
  add column if not exists mana_points integer default 0,
  add column if not exists booster_packs integer default 0,
  add column if not exists last_daily_booster_at timestamp with time zone,
  add column if not exists has_received_discord_welcome_pack boolean default false,
  add column if not exists opened_boosters_count integer default 0;

alter table public.listings
  add column if not exists card_number text,
  add column if not exists show_discord_name boolean default true;

-- 3. Expand listings_status_check to support 'draft' and 'sold' in addition to 'active', 'reserved', 'completed'
alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings add constraint listings_status_check
  check (status in ('active', 'reserved', 'completed', 'sold', 'draft'));

-- 4. Indexes for fast cross-user marketplace filtering
create index if not exists idx_listings_status_type_created
  on public.listings (status, type, created_at desc);

create index if not exists idx_listings_user_id
  on public.listings (user_id);

-- 5. Backfill any auth.users missing a public.profiles row
insert into public.profiles (id, username, avatar_url, role, verified, deals_count)
select
  au.id,
  coalesce(
    au.raw_user_meta_data->>'username',
    au.raw_user_meta_data->>'user_name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1),
    'Trainer_' || substr(au.id::text, 1, 6)
  ) || '_' || substr(au.id::text, 1, 4),
  coalesce(
    au.raw_user_meta_data->>'avatar_url',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'
  ),
  'member',
  false,
  0
from auth.users au
left join public.profiles pp on pp.id = au.id
where pp.id is null
on conflict (id) do nothing;

-- 6. Harden & complete RLS policies across profiles, listings, trade_offers, deals, bulk_submissions
-- PROFILES
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin_or_founder());

-- LISTINGS (All non-draft listings visible to everyone; drafts visible to owner & admins)
drop policy if exists "Listings are viewable by everyone" on public.listings;
create policy "Listings are viewable by everyone"
  on public.listings for select
  using (
    coalesce(status, 'active') <> 'draft'
    or auth.uid() = user_id
    or public.is_admin_or_founder()
  );

drop policy if exists "Users can insert own listings" on public.listings;
create policy "Users can insert own listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own listings" on public.listings;
create policy "Users can update own listings"
  on public.listings for update
  using (auth.uid() = user_id or public.is_admin_or_founder());

drop policy if exists "Users can delete own listings" on public.listings;
create policy "Users can delete own listings"
  on public.listings for delete
  using (auth.uid() = user_id or public.is_admin_or_founder());

-- TRADE OFFERS
drop policy if exists "Trade offers viewable by participants and listing owner" on public.trade_offers;
drop policy if exists "Trade offers viewable by participants only" on public.trade_offers;
create policy "Trade offers viewable by participants only"
  on public.trade_offers for select
  using (
    auth.uid() = from_user_id
    or auth.uid() in (select l.user_id from public.listings l where l.id = listing_id)
    or public.is_admin_or_founder()
  );

drop policy if exists "Users can insert trade offers" on public.trade_offers;
drop policy if exists "Users can create trade offers" on public.trade_offers;
create policy "Users can create trade offers"
  on public.trade_offers for insert
  with check (auth.uid() = from_user_id);

drop policy if exists "Participants can update trade offers" on public.trade_offers;
create policy "Participants can update trade offers"
  on public.trade_offers for update
  using (
    auth.uid() = from_user_id
    or auth.uid() in (select l.user_id from public.listings l where l.id = listing_id)
    or public.is_admin_or_founder()
  );

-- DEALS
drop policy if exists "Deals viewable by deal participants only" on public.deals;
create policy "Deals viewable by deal participants only"
  on public.deals for select
  using (
    auth.uid() = seller_id
    or auth.uid() = buyer_id
    or public.is_admin_or_founder()
  );

drop policy if exists "Authenticated users can create deals" on public.deals;
create policy "Authenticated users can create deals"
  on public.deals for insert
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "Participants can update deal confirmations" on public.deals;
create policy "Participants can update deal confirmations"
  on public.deals for update
  using (
    auth.uid() = seller_id
    or auth.uid() = buyer_id
    or public.is_admin_or_founder()
  );

-- BULK SUBMISSIONS
drop policy if exists "Bulk submissions viewable by submitter and admins" on public.bulk_submissions;
drop policy if exists "Bulk submissions viewable strictly by creator or admin" on public.bulk_submissions;
create policy "Bulk submissions viewable strictly by creator or admin"
  on public.bulk_submissions for select
  using (
    auth.uid() = user_id
    or public.is_admin_or_founder()
  );

drop policy if exists "Users can insert bulk submissions" on public.bulk_submissions;
create policy "Users can insert bulk submissions"
  on public.bulk_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admins can update bulk submissions" on public.bulk_submissions;
create policy "Admins can update bulk submissions"
  on public.bulk_submissions for update
  using (public.is_admin_or_founder());

-- 7. Storage bucket & policies for card-photos
insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Card photos are publicly accessible" on storage.objects;
create policy "Card photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'card-photos');

drop policy if exists "Authenticated users can upload card photos" on storage.objects;
create policy "Authenticated users can upload card photos"
  on storage.objects for insert
  with check (bucket_id = 'card-photos' and auth.role() = 'authenticated');

drop policy if exists "Users can update own card photos" on storage.objects;
create policy "Users can update own card photos"
  on storage.objects for update
  using (bucket_id = 'card-photos' and auth.uid() = owner);

drop policy if exists "Users can update or delete their own card photos" on storage.objects;
create policy "Users can update or delete their own card photos"
  on storage.objects for delete
  using (bucket_id = 'card-photos' and auth.uid() = owner);

-- 8. Enable Supabase Realtime on marketplace tables
do $$
begin
  begin
    alter publication supabase_realtime add table public.listings;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.profiles;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.trade_offers;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.deals;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.bulk_submissions;
  exception when duplicate_object then null;
  end;
end $$;

-- 9. Reload PostgREST schema cache immediately
notify pgrst, 'reload schema';
