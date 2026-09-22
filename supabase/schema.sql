-- ==============================================================================
-- MANAVERSE COMMUNITY PLATFORM - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. PROFILES (Extends Supabase Auth with custom Whatnot, Discord & Frame Roles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text,
  avatar_url text,
  role text default 'member' check (role in ('founder', 'beta', 'member', 'admin')),
  verified boolean default false,
  deals_count integer default 0,
  whatnot_username text,
  discord_username text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);

-- Trigger to auto-create profile upon auth signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, email, avatar_url, role, verified, deals_count, discord_username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'member',
    false,
    0,
    new.raw_user_meta_data->>'custom_claims'->>'discord_tag'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CARD LISTINGS (Sell, Trade, Looking For)
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('sell', 'trade', 'looking_for')),
  name text not null,
  set_name text,
  card_number text,
  language text not null,
  condition text not null,
  photos text[] not null default '{}',
  video_url text,
  description text,
  price numeric(10, 2),
  price_range text,
  estimated_trade_value numeric(10, 2),
  looking_for_wants text,
  allow_offers boolean default true,
  post_to_discord boolean default true,
  status text default 'active' check (status in ('active', 'reserved', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone." 
  on public.listings for select using (true);

create policy "Users can insert own listings." 
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Users can update own listings." 
  on public.listings for update using (auth.uid() = user_id);

create policy "Users can delete own listings." 
  on public.listings for delete using (auth.uid() = user_id);

-- 3. TRADE OFFERS
create table if not exists public.trade_offers (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  offered_cards_description text not null,
  offered_images text[] default '{}',
  estimated_value numeric(10, 2) not null,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trade_offers enable row level security;

create policy "Trade offers viewable by listing owner or offer creator."
  on public.trade_offers for select using (
    auth.uid() = from_user_id or 
    auth.uid() in (select user_id from public.listings where id = listing_id)
  );

create policy "Users can create trade offers."
  on public.trade_offers for insert with check (auth.uid() = from_user_id);

-- 4. BULK SUBMISSIONS ("An Manacards verkaufen")
create table if not exists public.bulk_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_cards integer not null,
  cards_data jsonb not null default '[]'::jsonb,
  asking_price numeric(10, 2),
  notes text,
  status text default 'pending' check (status in ('pending', 'reviewing', 'offer_sent', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bulk_submissions enable row level security;

create policy "Bulk submissions viewable by creator or admin."
  on public.bulk_submissions for select using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert bulk submissions."
  on public.bulk_submissions for insert with check (auth.uid() = user_id);

-- 5. DEALS & MUTUAL CONFIRMATIONS
create table if not exists public.deals (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete set null,
  listing_title text not null,
  listing_type text not null,
  price_or_value numeric(10, 2),
  seller_id uuid references public.profiles(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  seller_confirmed boolean default false,
  buyer_confirmed boolean default false,
  status text default 'pending' check (status in ('pending', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.deals enable row level security;

create policy "Deals viewable by participants."
  on public.deals for select using (
    auth.uid() = seller_id or auth.uid() = buyer_id
  );

create policy "Participants can update deal confirmations."
  on public.deals for update using (
    auth.uid() = seller_id or auth.uid() = buyer_id
  );
