insert into public.categories (name, slug, description, image_url) values
('Groceries', 'groceries', 'Authentic African groceries and staples', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'),
('Beauty & Personal Care', 'beauty', 'Natural beauty products and skincare', 'https://images.unsplash.com/photo-1596755389378-c31d21fd0ae5?auto=format&fit=crop&w=600&q=80'),
('Fashion & Textiles', 'fashion', 'Vibrant African fashion and fabrics', 'https://images.unsplash.com/photo-1512505968842-56ed738c1b47?auto=format&fit=crop&w=600&q=80'),
('Home & Living', 'home', 'Handcrafted home decor and essentials', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d5136?auto=format&fit=crop&w=600&q=80');

insert into public.products (name, slug, description, price, compare_at_price, category_id, status, inventory_count) values
('Ijebu Garri', 'ijebu-garri', 'Premium fermented cassava granules, perfect for eba or snacking with sugar and groundnuts.', 799, 999, (select id from public.categories where slug = 'groceries'), 'active', 120),
('Red Palm Oil', 'red-palm-oil', 'Cold-pressed palm oil from West Africa, rich in flavor and color.', 1299, 1499, (select id from public.categories where slug = 'groceries'), 'active', 85),
('Dried Catfish', 'dried-catfish', 'Smoked dried catfish, a staple for soups and stews across West Africa.', 2499, 2999, (select id from public.categories where slug = 'groceries'), 'active', 40),
('Raw Shea Butter', 'raw-shea-butter', 'Unrefined shea butter from Ghana, deeply moisturizing for skin and hair.', 1599, 1899, (select id from public.categories where slug = 'beauty'), 'active', 60),
('African Black Soap', 'african-black-soap', 'Traditional black soap made with plantain ash and shea butter.', 1099, null, (select id from public.categories where slug = 'beauty'), 'active', 90),
('Ankara Fabric', 'ankara-fabric', 'Bright wax-printed cotton fabric by the yard for dresses and crafts.', 2499, 2999, (select id from public.categories where slug = 'fashion'), 'active', 55),
('Dashiki Shirt', 'dashiki-shirt', 'Colorful embroidered dashiki shirt, unisex and celebration-ready.', 3499, 4299, (select id from public.categories where slug = 'fashion'), 'active', 30),
('Handwoven Basket', 'handwoven-basket', 'Sustainable handwoven storage basket with lid, made by artisan cooperatives.', 1899, 2299, (select id from public.categories where slug = 'home'), 'active', 25);

insert into public.product_images (product_id, url, alt_text, position) values
((select id from public.products where slug = 'ijebu-garri'), 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'Ijebu Garri package', 0),
((select id from public.products where slug = 'red-palm-oil'), 'https://images.unsplash.com/photo-1474979266404-7caddbed64a8?auto=format&fit=crop&w=800&q=80', 'Red palm oil bottle', 0),
((select id from public.products where slug = 'dried-catfish'), 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', 'Dried catfish', 0),
((select id from public.products where slug = 'raw-shea-butter'), 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 'Raw shea butter jar', 0),
((select id from public.products where slug = 'african-black-soap'), 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=800&q=80', 'African black soap bar', 0),
((select id from public.products where slug = 'ankara-fabric'), 'https://images.unsplash.com/photo-1520006403906-6a00c8d8b4b7?auto=format&fit=crop&w=800&q=80', 'Ankara fabric print', 0),
((select id from public.products where slug = 'dashiki-shirt'), 'https://images.unsplash.com/photo-1512505968842-56ed738c1b47?auto=format&fit=crop&w=800&q=80', 'Dashiki shirt', 0),
((select id from public.products where slug = 'handwoven-basket'), 'https://images.unsplash.com/photo-1617118568552-ea70bae408a9?auto=format&fit=crop&w=800&q=80', 'Handwoven basket', 0);