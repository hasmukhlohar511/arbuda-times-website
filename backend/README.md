# Arbuda multi-site backend

Standalone Express and MongoDB API for Arbuda Times and future websites. Product data is strictly isolated: every website has a dedicated MongoDB database and products are never stored in a shared collection.

## Local setup

1. Copy `.env.example` to `.env` and replace the bootstrap password.
2. Start MongoDB with `docker compose up -d mongodb` or provide `MONGODB_URI`.
3. Run `npm install`.
4. Run `npm run bootstrap` once to create Arbuda Times and its owner.
5. Run `npm run dev`.

For a fresh development database, `npm run seed` loads the six Arbuda Times starter products without overwriting existing records.

The API defaults to `http://localhost:4000`; check it at `GET /health`.

## Initial endpoints

- `POST /api/v1/auth/login`, `POST /logout`, `GET /me`
- Customer auth: `POST /api/v1/sites/:siteSlug/auth/register`, `POST /login`, `GET /me`, and `POST /logout`
- Customer wishlist: `GET /api/v1/sites/:siteSlug/wishlist`, `POST /:productId`, and `DELETE /:productId`
- `GET /api/v1/sites/:siteSlug/products` and `GET /:slug`
- Admin `GET`, `POST`, `PUT`, `DELETE /api/v1/admin/sites/:siteSlug/products`
- `POST /api/v1/admin/sites/:siteSlug/media` for tenant-isolated image uploads

The platform database contains websites, users, memberships and sessions only. Every website has an immutable database name. Product routes resolve the website server-side and then query only its database. Admin access also requires a matching membership.

## Customer email/password login

Customer accounts and customer sessions are stored inside each website's tenant database. Passwords are hashed with Argon2id and never returned by the API. Browser sessions use random opaque tokens; only their SHA-256 hashes are stored, and cookies are HTTP-only, SameSite and secure in production. Public registration requires a name, valid email address and password of at least eight characters.

Wishlist records are also stored in the tenant database with a unique customer/product constraint. All wishlist endpoints require a valid customer session and verify products against the same website database, so wishlist items synchronize across browsers without crossing tenant boundaries.

Media storage, request throttling, audit logs, tests and frontend migration are the next implementation slices.
