# Complete the Afromart public marketplace website

## Goal
Turn the current working marketplace into the connected public Afromart website shown by the supplied visual reference, while preserving the existing buyer, seller, messaging, checkout, support, and verification functionality.

## What will change
- Replace the current welcome-only `/` page with the full public landing page from the supplied design direction: marketplace-led hero, category discovery, featured products, services, trust features, app connection, and footer.
- Make **Start Shopping** the main landing action and route it to the real `/products` marketplace. Keep **Explore Services**, account access, cart, support, country, language, and app-download actions meaningful and connected.
- Preserve the existing green, gold, white, Outfit, and Figtree design system; use the current Nigerian catalogue and local imagery rather than placeholder or generic ecommerce content.
- Add a dedicated public storefront route for each seller with logo, banner, verification state, location, description, rating, products, services, and seller contact action.
- Link seller names and “Visit store” actions from product and service pages directly to their storefront.
- Complete seller management inside the authenticated dashboard: store logo/banner, business details, location, product images/categories/pricing/stock/status, service listings, listing management, public-store preview, verification documents, orders, and earnings.
- Add a public service-details route so service cards lead to a complete provider, pricing, location, request, and chat experience.
- Keep app-first features connected through app-store CTAs rather than duplicating every mobile screen on the website.
- Correct inconsistent “Afro Mart” copy to “Afromart” and remove obsolete waiting-list/coming-soon language from active seller flows.

## Public journeys
```text
Landing → Shop → Product → Storefront → Cart → Checkout
Landing → Services → Service details → Request or chat → Provider storefront
Landing → Account → Seller dashboard → Store setup → Listings → Public storefront
Landing → Get the app / Support / Language / Country
```

## Technical details
- Add route files for `/stores/$slug` and `/services/$slug`, each with unique metadata and loader-backed public data.
- Extend existing public store/service queries rather than duplicating data access.
- Use Lovable Cloud Storage for public store, product, and service media; keep seller verification credentials in the existing private bucket.
- Add only the database fields/policies needed for seller-managed service pricing mode, featured status, and media where the current schema cannot represent the approved scope.
- Keep public data limited to approved store/listing fields; never expose owner IDs or verification documents.
- Reuse existing authentication gates, cart, chat, review, order, notification, support, and payment foundations.
- Audit every major navigation action and replace non-functional anchors or misleading copy.

## Verification
- Check `/`, `/products`, a product detail, a public storefront, `/services`, a service detail, `/cart`, `/auth`, `/support`, and the seller dashboard.
- Test desktop, tablet, and mobile layouts for overflow, navigation, search, cards, forms, and media.
- Confirm images load, product/service/store links resolve, guest actions gate correctly, and protected seller actions remain private.
- Confirm all content routes have distinct Afromart metadata and the project compiles cleanly.
