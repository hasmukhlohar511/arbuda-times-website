# Arbuda Times

A mobile-first wholesale watch catalogue for retailers, built with Next.js, TypeScript and Tailwind CSS. It includes product search and filters, MOQ-aware quantities, a persistent multi-product enquiry cart, WhatsApp message generation, owner-only administration, D1 product storage and R2 image storage.

## Local setup

1. Use Node.js 22.13 or newer.
2. Install dependencies with `npm run install:ci`.
3. Generate the D1 migration with `npm run db:generate` (a migration is already included).
4. Start development with `npm run dev`.

The public catalogue falls back to clearly marked demo products until D1 contains published products. Replace `public/demo-watch-collection.png` and the placeholder contact details before launch.

## Database and images

`.openai/hosting.json` declares the D1 binding `DB` and R2 binding `BUCKET`. Sites creates and binds these services during deployment and applies the checked-in `drizzle/` migrations. Product records, publication state and settings are stored in D1. Uploaded JPG, PNG and WebP files (maximum 5 MB) are validated server-side and stored in R2.

## First admin and security

Open `/admin` and sign in with the Site owner's ChatGPT account. This is the secure first-admin bootstrap: there is no public registration page and no hardcoded password. Admin pages, product mutations, permanent deletion and upload endpoints verify the authenticated user server-side. Invite additional Site editors through the Site access controls if another administrator is needed.

## WhatsApp and business details

Before production use, replace the placeholder `WA` number in `components/storefront.tsx` with the business number in international format (digits only), and update the visible phone, address, hours and Instagram placeholders. A map is intentionally omitted until a real address is supplied.

## Verification and deployment

- `npm run lint`
- `npm run build`

The project is configured for OpenAI Sites/Cloudflare Workers. Secrets must be configured as Site environment variables and must never be committed. No payment gateway is included.

## Generated demo asset

`public/demo-watch-collection.png` was created with the built-in image generation tool using a product-mockup prompt for four unbranded watches on charcoal stone plinths, with no logos, text or watermark. It is intentionally labeled as demo photography throughout the storefront.
