# AfroMart Build Roadmap

## Current request — September 13
- [ ] Delivery remains unverified: logs show expired/invalid tokens; improved newest-email guidance and accept 6–10 digit codes.
- [ ] Paystack integration awaits approval and credentials; brief also names Ecobank Pay and MTN MoMo.
- [x] Add 245 international dialing-code choices and validated responsive signup phone fields.
- [x] Restore visible Support access on small screens (browser verified).
- [ ] Partial: French, Portuguese and Swahili account/navigation translations added; remaining content and six launch languages still need translation.
- [ ] Send a welcome email after first Google signup (requires verified sender).
- [ ] Align remaining screens with uploaded designs and verify small-screen layouts.

## Previously Completed
1. Fixed broken images with reliable local fallbacks.
2. Simplified the header: no Home item, no duplicate Get the app action, Support at the far end.
3. Removed product-category presentation from the landing and guest experience.
4. Reworked the landing page around the mobile app experience and guest preview.
5. Replaced the coming-soon page with seller account and role-selection screens.
6. Added the footer language selector.
7. Kept guest mode browse-only: no sign-up required, but no purchases or restricted account actions.

## Completed This Turn
1. Rebuilt the welcome, login, and sign-up entry flow from the supplied onboarding screens.
2. Added the supplied community artwork and kept the entry flow separate from the marketplace navigation.
3. Connected onboarding to the live account system and moved the marketplace feed to its own home screen.
4. Replaced the marketing landing page with a responsive marketplace welcome and connected home feed.
5. Added an adaptive desktop sidebar and mobile bottom navigation.
6. Connected product cards and product detail pages to the working cart.
7. Added expanded buyer profile fields in the backend.
8. Added secure buyer, seller, service-provider, delivery-partner and admin roles.
9. Updated sign-in to match the new full-screen marketplace experience.
10. Corrected Google sign-in to return users to the marketplace instead of the welcome screen.
11. Added email confirmation, code entry and resend states to account creation.
12. Tightened the marketplace, product grid and account screens for small mobile displays.

## In Progress — Real App Completion
- [x] Reduce onboarding branding and standardize the name “Afromart”.
- [x] Require email confirmation, bot screening, and a second email step after password login.
- [x] Fix Google return handling through the public sign-in screen.
- [x] Build a dedicated category browser with category-specific product results.
- [x] Add order history, order detail, delivery progress, and tracking screens.
- [x] Add a Fiverr-style services marketplace discovery screen.

## Upcoming
- Payment integration (Paystack — awaiting go-ahead + credentials).
- Buyer-seller disputes.
- Seller storefront UI for the order-management backend.

## Backend completion (this pass)
- Reviews table with public read, owner write, and unique review per buyer per product
- Automatic product rating/review count and store rating recalculation via private trigger
- Reviews server functions: list (public), create/update (verified buyers), delete own
- Seller backend: view orders containing their items, update delivery status, auto-notify the buyer
- Admin backend: admin-role verification, marketplace overview counts, store verification, product status moderation

## Brand + colour pass (done)
- Official Afro Mart logo files in header, footer and favicon
- Expressive brand palette tokens (green, gold, terracotta, indigo, coral, leaf) + gradient/pattern utilities
- Icons across nav, features, support topics; category and services imagery
- New /support page (help topics, FAQ, contact form) linked from header and footer
- Real marketplace browsing, cart and checkout entry points replace the previous marketing-only website.

## Completed (this pass)
- Live search box with product + category suggestions (no forced redirect)
- Category filters: price range, verified sellers, in stock, sorting
- Product information page with description, variants, stock, seller info card
- Buyer–seller chat: Messages list + conversation screen
- Settings: light/dark, language, name, phone change with verification code
- In-app inbox with welcome message on first sign-in and unread bell badge
- In-app support with tickets and replies, FAQ, topic picker
- Category images placed via local asset fallbacks
- Fixed shop routing so /products/:slug renders the product page

## Still open
- Paystack payments (awaiting go-ahead + credentials)
- Branded emails need a domain you own
- Robot check + two-step login
- Translations beyond English/French/Portuguese/Swahili

## Update batch (12-area spec)
- [x] Seller workspace: dashboard, store info, products, earnings, orders with status updates (/seller)
- [x] Services: search, filters, request form, request history
- [x] Dark mode as a single On/Off switch with a genuinely dark palette
- [x] Messages inbox refresh button
- [x] AI support assistant with escalation to a human ticket
- [x] Buyer/seller switching from Settings and Start selling (seller role granted automatically)
- [ ] Profile redesign (buyer + seller)
- [ ] Country/location selection + delivery info in checkout & orders
- [ ] Marketplace imagery pass (banners, services, empty states)
- [ ] Full navigation audit
- [ ] Payments: waiting on provider credentials (see chat checklist)
- [ ] Branded verification emails + "Afromart" sender: needs a domain the client owns

## Marketplace visuals, profile, delivery (done)
- [x] Real product photos for all 8 products and 4 category banners
- [x] Store banner image for stores without one
- [x] Redesigned buyer/seller profile page (stats, quick links, orders, addresses)
- [x] Country selection at checkout with location-aware delivery cost and ETA
- [ ] Payments (Paystack) pending client credentials
- [ ] Branded email sending pending own domain
