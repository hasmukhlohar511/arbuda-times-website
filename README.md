# Arbuda Times

A mobile-first kids’ watch store built with Next.js, TypeScript and Tailwind CSS. It includes age-based product filters, a persistent shopping cart, WhatsApp ordering, and owner-only administration backed by the standalone Express/MongoDB service in `backend/`.

## Local setup

1. Use Node.js 22.13 or newer.
2. Install dependencies with `npm run install:ci`.
3. Follow `backend/README.md` to bootstrap and start the API on port 4000.
4. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_SLUG` in `.env.local`.
5. Start the frontend with `npm run dev`.

The public catalogue falls back to clearly marked demo products until D1 contains published products. Replace `public/demo-watch-collection.png` and the placeholder contact details before launch.

## Local admin credentials

Use these credentials only for the local development environment:

```text
Admin URL: http://127.0.0.1:5173/admin
Email: owner@arbuda.local
Password: ArbudaDev2026!
```

These credentials must not be used in staging or production. Create a unique production owner password through the backend bootstrap configuration and keep it outside Git.

## Backend, database and images

The standalone `backend/` project uses Express, Mongoose and MongoDB. Platform users and website memberships live in the platform database, while Arbuda Times products live in a dedicated tenant database. Other websites receive different databases, so products cannot cross website boundaries. Uploaded JPG, PNG and WebP files are validated and stored under a tenant-specific media directory.

## First admin and security

Run the backend bootstrap command to create the first owner, then open `/admin` and sign in with that account. There is no public registration. Passwords use Argon2id and browser sessions use opaque, hashed, HTTP-only cookie tokens. Product mutations, deletion and upload endpoints verify both the session and website membership server-side.

## WhatsApp and business details

The storefront uses `+91 96629 65289` for WhatsApp and phone calls, and links to `@arbuda_times__surat` on Instagram. Add the store address and opening hours before launch; a map is intentionally omitted until a real address is supplied.

## Verification and deployment

- `npm run lint`
- `npm run build`

Both applications can run independently behind Nginx or through the included backend Docker configuration. Secrets must be configured as environment variables and must never be committed. No payment gateway is included.

## Generated demo asset

`public/demo-watch-collection.png` was created with the built-in image generation tool using a product-mockup prompt for four unbranded watches on charcoal stone plinths, with no logos, text or watermark. It is intentionally labeled as demo photography throughout the storefront.
