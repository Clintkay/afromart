create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    description text,
    image_url text,
    created_at timestamptz default now()
);

create table public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    description text,
    price integer not null,
    compare_at_price integer,
    category_id uuid references public.categories(id) on delete set null,
    status text default 'active' check (status in ('active', 'draft', 'archived')),
    inventory_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade not null,
    url text not null,
    alt_text text,
    position integer default 0
);

create table public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade not null,
    name text not null,
    price integer,
    inventory_count integer default 0
);

grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant all on public.categories to service_role;
grant all on public.products to service_role;
grant all on public.product_images to service_role;
grant all on public.product_variants to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;

create policy "Categories are publicly readable"
on public.categories for select
to anon, authenticated
using (true);

create policy "Active products are publicly readable"
on public.products for select
to anon, authenticated
using (status = 'active');

create policy "Product images are publicly readable"
on public.product_images for select
to anon, authenticated
using (true);

create policy "Product variants are publicly readable"
on public.product_variants for select
to anon, authenticated
using (true);