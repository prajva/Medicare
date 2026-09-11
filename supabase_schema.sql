-- ============================================================
-- MediCare Plus — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. USER PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- 2. MEDICINES
create table if not exists public.medicines (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  category    text not null,
  image_url   text,
  stock       integer default 100,
  is_featured boolean default false,
  created_at  timestamptz default now()
);

alter table public.medicines enable row level security;

create policy "Anyone can view medicines"
  on public.medicines for select
  using (true);


-- 3. ORDERS
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  total_amount    numeric(10,2) not null,
  status          text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  payment_method  text default 'cod',
  delivery_name   text not null,
  delivery_phone  text not null,
  delivery_address text not null,
  notes           text,
  created_at      timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);


-- 4. ORDER ITEMS
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id),
  quantity    integer not null check (quantity > 0),
  unit_price  numeric(10,2) not null,
  created_at  timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );


-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- SEED DATA: Sample Medicines
-- ============================================================
insert into public.medicines (name, description, price, category, image_url, stock, is_featured) values

-- Pain Relief
('Paracetamol 500mg',
 'Effective pain reliever and fever reducer. Suitable for headaches, muscle pain, and mild fever. Safe for adults and children.',
 12.50, 'Pain Relief',
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
 200, true),

('Ibuprofen 400mg',
 'Anti-inflammatory and analgesic tablet. Provides fast relief from headaches, toothaches, backaches, and menstrual pain.',
 18.00, 'Pain Relief',
 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80',
 150, false),

('Aspirin 325mg',
 'Relieves minor aches and pains, reduces fever. Also used as a blood thinner for cardiovascular health. 30 tablets per pack.',
 9.99, 'Pain Relief',
 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
 180, false),

-- Vitamins & Supplements
('Vitamin C 1000mg',
 'High-strength Vitamin C supplement to boost immunity and fight oxidative stress. With zinc for enhanced absorption.',
 35.00, 'Vitamins',
 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80',
 300, true),

('Multivitamin Daily',
 'Complete daily multivitamin with 23 essential vitamins and minerals. Supports energy, immunity, and overall well-being.',
 55.00, 'Vitamins',
 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
 250, true),

('Omega-3 Fish Oil',
 'High-quality omega-3 fatty acids from deep-sea fish. Supports heart, brain, and joint health. 60 softgels per pack.',
 75.00, 'Vitamins',
 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80',
 120, false),

-- Cold & Flu
('Cetirizine 10mg',
 'Non-drowsy antihistamine for allergy relief. Effective against hay fever, dust allergies, and skin reactions.',
 22.00, 'Cold & Flu',
 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&q=80',
 200, false),

('Cough Syrup (100ml)',
 'Soothing cough syrup with honey and tulsi extract. Relieves dry and wet cough, soothes throat irritation.',
 48.00, 'Cold & Flu',
 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
 90, true),

('Cold & Flu Tablets',
 'Combined formula with paracetamol, pseudoephedrine, and chlorphenamine. Relieves blocked nose, fever, and headache.',
 28.50, 'Cold & Flu',
 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80',
 160, false),

-- Digestive Health
('Antacid Tablets',
 'Fast-acting antacid providing instant relief from heartburn, acidity, and indigestion. Mint flavour. Pack of 20.',
 15.00, 'Digestive',
 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80',
 250, false),

('Probiotics Capsules',
 'Multi-strain probiotic with 10 billion CFU. Supports gut health, digestion, and boosts immune function.',
 95.00, 'Digestive',
 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80',
 80, true),

('ORS Sachets (Pack of 10)',
 'Oral rehydration salts with electrolytes. Rapidly restores fluids lost due to diarrhoea, vomiting, or dehydration.',
 20.00, 'Digestive',
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
 400, false),

-- Skin Care
('Antiseptic Cream 30g',
 'Broad-spectrum antiseptic cream for minor cuts, burns, and skin infections. Promotes healing and prevents infection.',
 32.00, 'Skin Care',
 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
 140, false),

('Moisturising Lotion 200ml',
 'Deeply hydrating lotion with aloe vera and vitamin E. Suitable for dry and sensitive skin. Dermatologist tested.',
 85.00, 'Skin Care',
 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
 100, false),

-- Diabetes Care
('Glucometer Test Strips (50)',
 'High-accuracy blood glucose test strips compatible with most standard glucometers. For diabetic self-monitoring.',
 220.00, 'Diabetes Care',
 'https://images.unsplash.com/photo-1631815588090-d1bcbe9a2f3d?w=400&q=80',
 60, false),

-- Eye Care
('Eye Drops (Lubricating)',
 'Preservative-free lubricating eye drops for dry, tired, or irritated eyes. Suitable for contact lens wearers.',
 65.00, 'Eye Care',
 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
 110, false);

-- ============================================================
-- Done! Your schema and seed data are ready.
-- ============================================================
