# Build an Afro Mart e-commerce app

## Goal
Create a Shopify-powered e-commerce storefront for an Afro mart, using the user's supplied UI design. Visitors can browse products, add items to cart, and check out. Signed-in users can view order history and save addresses.

## Cost / credits note
Building and editing the app in Lovable does not consume credits. If you use Lovable AI image generation or Lovable Cloud storage beyond the free tier, those can incur usage; Shopify and payment processing have their own fees.

## Open decision before we start
1. **Shopify store setup**: do you want to create a new Shopify development store, or connect an existing Shopify store?
2. **UI design assets**: please upload/share your design files (Figma link, screenshots, PDFs) so I can match colors, typography, spacing, and layout exactly.

## Build plan

### Phase 1: Backend foundation
- Enable Lovable Cloud for user accounts and persistent data.
- Enable Shopify integration (new or existing store based on your answer).
- Configure authentication: email/password + Google sign-in.
- Create the `profiles` table (linked to auth users, with RLS and auto-create trigger).

### Phase 2: Product data
- Connect the Shopify product catalog to the app.
- Fetch collections/categories and product listings from Shopify.
- Add a sync or server function to read products for the storefront.

### Phase 3: Storefront UI (matching your design)
- Replace the placeholder `/` route with the designed home page: hero, featured categories, product grid.
- Add `/products` route for browsing all products.
- Add `/products/$handle` route for product detail with variant selection and add-to-cart.
- Add `/cart` route with quantity editing and removal.
- Add shared layout with navigation, search, cart badge, and footer.

### Phase 4: Checkout and accounts
- Implement Shopify checkout flow from the cart.
- Add `/auth` route for sign in / sign up.
- Add `/account` route under the authenticated layout for order history and saved addresses.
- Add password reset flow.

### Phase 5: Polish
- Apply your exact design tokens (colors, fonts, spacing, animations).
- Add SEO metadata to every route.
- Verify mobile responsiveness and core user flows with browser checks.

## Dependencies
- Shopify integration (pending user choice).
- Lovable Cloud enabled for auth/database.
- User-provided UI design assets for visual matching.

## First step
Reply with your Shopify store preference and upload your design files. Then I'll start with Phase 1.