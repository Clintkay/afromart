# Build a custom Afro Mart e-commerce app

## Goal
Build a standalone Afro mart storefront that matches your Figma design. The app will run on Lovable Cloud for user accounts, product data, and orders, with an integrated payment checkout (Stripe or Paddle) when you're ready.

## Cost / credits note
Building and editing the app in Lovable does not consume credits. Lovable Cloud, AI image generation, and payment processing may have their own usage or fees once you go beyond free tiers.

## Open decisions before we start
1. **Figma design**: please attach screenshots or a shareable Figma link here, or use the Lovable Desktop app + Figma Dev Mode connector for live import.
2. **Payments**: do you want checkout + payments in this first version, or a browse-only / "coming soon" catalog first?
3. **Product data**: do you already have product names, prices, descriptions, and images, or should I seed a few sample Afro mart products to get started?

## Build plan

### Phase 1: Foundation
- Enable Lovable Cloud (database + auth).
- Set up email/password + Google sign-in.
- Create the `profiles` table with RLS and an auto-create trigger on signup.

### Phase 2: Product catalog
- Design the database schema: `products`, `categories`, `product_images`, `inventory`.
- Seed sample products or import your product list.
- Build public server functions for browsing products and categories.

### Phase 3: Storefront UI (matching your Figma)
- Replace the placeholder `/` route with the designed home page: hero, categories, featured products.
- Add `/products` route with filters and search.
- Add `/products/$id` route with image gallery, variant selection, and add-to-cart.
- Build a shared header with navigation, search, cart badge, and account menu.
- Add footer and global layout.

### Phase 4: Cart and checkout
- Build a client-side cart (or database-backed cart for signed-in users).
- Add `/cart` route with quantity editing and removal.
- Integrate Stripe or Paddle checkout when you confirm payments are needed.
- Add order creation and order history after successful checkout.

### Phase 5: Account area
- Add `/auth` route for sign in / sign up.
- Add protected `/account` route for order history, saved addresses, and profile.
- Add password reset flow.

### Phase 6: Polish
- Apply your exact Figma design tokens (colors, fonts, spacing, animations).
- Add SEO metadata to every route.
- Verify mobile responsiveness and core flows with browser checks.

## First step
Attach your Figma screenshots or link, then tell me whether you want payments in v1 and if you have product data ready.