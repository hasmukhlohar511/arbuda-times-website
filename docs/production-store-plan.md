# Production Store Plan

## Product direction

Build one central commerce platform with:

- One reusable backend and central admin application.
- Multiple independent websites.
- A separate MongoDB database and media namespace for every website.
- Strict isolation: products, customers, orders and images never cross websites.
- Independent settings, domains and branding for every website.

Arbuda Times is the first production tenant.

## 1. Easy admin experience

### Dashboard

- Today's orders and revenue.
- Pending orders and enquiries.
- Low-stock and out-of-stock products.
- Recent activity.
- Quick actions for adding products, creating orders and uploading images.
- Store setup progress.
- Payment, delivery and backend service status.

Keep the dashboard focused on actions instead of unnecessary charts.

### Guided store setup

1. Business information.
2. Logo and branding.
3. Contact and WhatsApp details.
4. Store address.
5. Tax/GST information.
6. Currency and pricing.
7. Delivery settings.
8. Payment configuration.
9. Return and cancellation policies.
10. First product.
11. Domain configuration.
12. Test order.
13. Store launch.

The admin should continue displaying incomplete setup items until the store is ready.

### Product management

- Product title and automatic URL slug.
- SKU and optional barcode.
- Category and subcategory.
- Description and highlights.
- Regular price, sale price and cost price.
- Tax classification.
- Drag-and-drop product images.
- Image ordering, cropping, compression and cover selection.
- Variants such as colour and size.
- Variant-level SKU, price and stock.
- Stock quantity and low-stock threshold.
- Minimum/maximum order quantity and quantity increment.
- Draft, published and scheduled states.
- Featured and new-arrival flags.
- SEO title and description.
- Preview before publishing.
- Duplicate, archive and restore actions.
- Bulk edit and CSV import/export.
- Draft autosave and clear validation messages.

### Categories and collections

- Nested categories.
- Category images and ordering.
- Manual collections.
- Rule-based collections.
- Navigation visibility.
- Category SEO.
- Scheduled collections.

### Media library

- Drag-and-drop and multiple-file uploads.
- Automatic thumbnails and WebP/AVIF optimization.
- Alt text and search.
- File usage information.
- Replace media without changing links.
- Unused-file detection and safe deletion.
- Storage-usage display.
- Separate bucket or namespace for every website.

## 2. Order management

The primary workflow is:

```text
Pending payment
-> Confirmed
-> Processing
-> Packed
-> Shipped
-> Delivered
```

Additional states:

- Payment failed.
- Cancelled.
- Return requested.
- Returned.
- Refunded or partially refunded.

Admin capabilities:

- Search by order number, customer or phone number.
- Customer-visible and internal notes.
- Status timeline.
- Payment and delivery status.
- Printable packing slips and tax invoices.
- Manual order creation.
- Cancellation and partial/full refunds.
- Resend notifications.
- CSV export and bulk status changes.
- Audit trail for every status change.

## 3. Customer management

Customer records should include:

- Name, phone and email.
- Saved addresses.
- Order history and total spending.
- Last order.
- Notes and tags.
- Marketing consent.
- Account status.
- Return and refund history.

Customer capabilities:

- Guest checkout.
- Optional customer account.
- Order history and delivery tracking.
- Address management.
- Cancellation or return requests.
- Secure password reset.

Customer accounts should not be mandatory for checkout.

## 4. Inventory management

- Quantity per product variant.
- Reserved and available inventory.
- Low-stock alerts.
- Stock adjustments with reasons.
- Inventory transaction history.
- Automatic deduction after confirmed payment.
- Automatic restoration after cancellation/refund.
- Configurable zero-stock selling.
- CSV stock import/export.
- Optional warehouse support later.

Use an inventory transaction ledger instead of silently replacing quantities.

## 5. Checkout and payments

Checkout capabilities:

- Mobile-first guest checkout.
- Delivery and billing addresses.
- Delivery-charge calculation.
- Coupons and tax calculation.
- Online payment and optional cash on delivery.
- Final order review.
- Payment retry.
- Confirmation page.
- Email, WhatsApp or SMS confirmation.

Payment requirements:

- Use secure payment-gateway components.
- Never store raw card information.
- Cryptographically verify payment webhooks.
- Make webhook processing idempotent.
- Reconcile payments against orders.
- Record failed/incomplete payment attempts.
- Record refunds and their statuses.
- Separate test and production credentials.

## 6. Shipping and delivery

- Delivery zones.
- Postal-code serviceability.
- Flat, weight-based or price-based rates.
- Free-delivery thresholds.
- Cash-on-delivery eligibility.
- Estimated delivery dates.
- Shipment creation.
- Tracking number and URL.
- Delivery webhook processing.
- Return shipments.

Shipping integrations should use adapters so providers can be replaced without rewriting order logic.

## 7. Discounts and promotions

- Percentage and fixed discounts.
- Free delivery.
- Minimum order value.
- Product/category restrictions.
- Start and end dates.
- Total and per-customer usage limits.
- Automatic promotions and coupon codes.
- Combination rules.
- Admin-visible usage history.

All discount calculations must run on the backend.

## 8. Store content and settings

- Logo, favicon and brand colours.
- Homepage banners and featured collections.
- Announcement bar.
- About and contact pages.
- WhatsApp and social links.
- Address and opening hours.
- FAQ.
- Privacy, terms, delivery and refund policies.
- SEO defaults.
- Analytics configuration.
- Maintenance mode.

Use structured content blocks instead of allowing raw HTML editing.

## 9. Enquiries and WhatsApp

- Persist enquiry records.
- Enquiry status and customer contact details.
- Selected products.
- Assigned staff member.
- Follow-up date.
- Internal notes.
- Direct WhatsApp action.
- Convert enquiry into an order.
- Spam protection.
- CSV export.
- Conversion reporting.

WhatsApp-assisted ordering can remain available after online checkout is introduced.

## 10. Users, roles and permissions

Recommended roles:

- `platform_owner`: all websites.
- `website_owner`: full access to one website.
- `administrator`: store operations.
- `product_manager`: products and inventory.
- `order_manager`: orders and customers.
- `content_editor`: pages and banners.
- `viewer`: read-only reports.

Security requirements:

- No public staff registration.
- Owner-managed invitations.
- Email verification and password reset.
- Strong passwords and optional two-factor authentication.
- Session list and remote logout.
- Temporary login lockout and rate limiting.
- Permission checks on every endpoint.
- Audit logs for sensitive actions.

The backend must derive the website from authenticated membership and must never trust an arbitrary `siteId` supplied by the browser.

## 11. Strict website isolation

Every website receives:

- A separate product/customer/order database.
- A separate media bucket or namespace.
- Separate cache keys.
- Separate exports and backups.
- Separate API credentials and webhooks.
- Independent restoration and offboarding.

The central platform database contains only:

- Website registry.
- Domains.
- Platform users.
- Website memberships.
- Sessions.
- Platform-level service status.

Products must never be stored in the central database.

## 12. Backend services

- Express and TypeScript API.
- MongoDB replica set.
- Redis for caching, rate limits and queues.
- Background worker service.
- S3-compatible media storage such as MinIO.
- Email and messaging integrations.
- Payment and shipping adapters.
- PDF invoice generation.
- Scheduled jobs.
- Structured logs, metrics and alerts.

Background jobs should handle:

- Image processing.
- Emails and customer messages.
- Invoice generation.
- Inventory alerts.
- Abandoned checkout reminders.
- Imports and exports.
- Backup verification.

## 13. API requirements

- Versioned endpoints.
- Zod validation.
- Standard error responses.
- Pagination, filtering, sorting and search.
- Authentication and authorization.
- Rate limiting.
- Request IDs.
- Idempotency keys for orders and payments.
- Audit logging.
- API documentation.
- Deprecation policy.

Price, tax, discount, stock and order calculations must run on the backend.

## 14. Security requirements

- HTTPS everywhere.
- Secure, HTTP-only cookies.
- CSRF protection.
- Strict CORS allowlist.
- Content Security Policy and other security headers.
- Login and API rate limiting.
- Brute-force protection.
- Input validation and request-size limits.
- File-signature validation and malware scanning.
- Least-privilege database users.
- Secrets outside Git with a rotation procedure.
- Dependency vulnerability scanning.
- Personal-data access controls.
- Session expiration.
- Production admin two-factor authentication.
- Owner account recovery procedure.

Development passwords must never be used in production.

## 15. Reliability and operations

- Nginx or another reverse proxy.
- Multiple backend instances when high availability is required.
- MongoDB replica set.
- Persistent MinIO storage.
- Redis persistence where needed.
- Container health checks and restart policies.
- CPU, memory and disk monitoring.
- API latency and error monitoring.
- Uptime checks and centralized logs.
- Certificate-expiry and disk-capacity alerts.
- Database performance monitoring.

### Backup policy

- Daily database and media backups.
- An encrypted off-machine copy.
- Seven daily, four weekly and six monthly backups.
- Automated backup-success alerts.
- Monthly restoration tests.
- Per-website restore support.

A backup is not considered reliable until restoration has been tested.

## 16. Testing requirements

- Unit tests for pricing, discounts, tax and inventory.
- API integration tests.
- Tenant-isolation tests.
- Permission tests for every role.
- Payment and shipping webhook tests.
- Upload-security tests.
- Checkout end-to-end tests.
- Admin workflow tests.
- Mobile-browser and accessibility tests.
- Performance tests.
- Backup restoration tests.

A mandatory isolation test must prove that an Arbuda Times user cannot access another website by changing a URL, ID, header or request body.

## 17. Production launch checklist

- Real business information entered.
- Custom domain and HTTPS configured.
- Production owner created.
- Development credentials removed.
- Two-factor authentication enabled.
- Products, prices and inventory verified.
- Payment, failure and refund tests completed.
- Delivery calculations tested.
- Tax invoices verified.
- Legal policies reviewed.
- Customer notifications tested.
- Sitemap and robots configuration checked.
- Analytics and consent configured.
- Backup and restore tested.
- Monitoring alerts tested.
- Error pages added.
- Load testing completed.
- Security review completed.
- Staging approval completed.

## 18. Implementation phases

### Phase 1: Production catalogue foundation

- Improve admin dashboard and navigation.
- Complete product, category and media management.
- Add autosave, preview, duplication and archive/restore.
- Add store settings and setup wizard.
- Add roles, password recovery and audit logs.
- Add rate limiting and security hardening.
- Integrate MinIO.
- Establish backups and monitoring.
- Remove obsolete D1/R2 runtime code after migration verification.

### Phase 2: Enquiries and inventory

- Enquiry database and workflow.
- Enquiry-to-order conversion.
- Real inventory quantities and ledger.
- Low-stock alerts.
- Customer records.
- CSV import/export.
- Notifications.

### Phase 3: Full commerce

- Backend cart validation.
- Checkout and addresses.
- Delivery and tax rules.
- Payment integration.
- Orders and invoices.
- Refunds.
- Delivery tracking.
- Customer order pages.

### Phase 4: Marketing and operations

- Coupons and promotions.
- Content management and SEO controls.
- Reports.
- Abandoned checkout recovery.
- Customer segmentation.
- Bulk operations.
- Scheduled publishing.

### Phase 5: Multi-website platform

- Website creation wizard.
- Domain management.
- Admin website switcher.
- Automated tenant provisioning.
- Per-website backup and restoration.
- Platform-owner dashboard.
- Resource quotas.
- Cross-platform operational reporting without exposing tenant product or customer data.

## Immediate milestone

Start with Phase 1 and deliver:

1. Clear admin login and recovery.
2. Guided store setup.
3. An actionable dashboard.
4. Easy product creation.
5. Category management.
6. Production media storage.
7. Draft preview and publishing.
8. Owner/admin/editor permissions.
9. Audit history.
10. Backups, monitoring and security controls.

After Phase 1, decide whether Arbuda Times remains a WhatsApp-assisted catalogue or proceeds to complete online checkout. That decision determines the payment, tax, order, inventory and delivery scope.
