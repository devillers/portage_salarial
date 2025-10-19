# Portage Salarial Platform Architecture

This document gives engineers an overview of how the application is organised so they can locate features quickly and understand the runtime composition.

## High-level overview

The project is built on **Next.js 15 App Router** and uses a hybrid rendering model:

- Public marketing, signup and tenant experiences live under the `app/` directory and leverage server components for data fetching.
- A secure admin dashboard (`app/admin`) exposes CRUD features for chalets, content and tenant management.
- API routes in `app/api/*` provide a REST interface that is consumed by both the Next.js app and external integrations (Stripe webhooks, marketing site forms, etc.).
- MongoDB acts as the primary data store via Mongoose models defined in `models/`.
- Shared infrastructure helpers live in `lib/` (authentication, database connection, cloudinary, Stripe integration, utility helpers).

```
app/
├── admin/            # Administrative dashboard pages and layouts
├── api/              # Route handlers for REST endpoints
├── portfolio/        # Marketing pages for public visitors
├── services/         # Portage salarial service descriptions and landing pages
├── tenant/           # Tenant experience and post management
└── ...
lib/
├── auth.js           # JWT generation/verification utilities
├── mongodb.js        # Database connection helper with caching
├── stripe.js         # Stripe client and webhook verification
└── utils.ts          # Shared UI utilities (e.g. tailwind class merging)
models/
├── User.js           # Role-based user accounts (admin, owner, tenant, etc.)
├── Chalet.js         # Chalet listing metadata and availability state
├── Booking.js        # Reservation records and payment status
├── Content.js        # CMS-like content blocks for the marketing site
├── PortfolioItem.js  # Assets showcased in the portfolio section
└── SignupApplication.js # Owner & tenant onboarding flows
```

## Data flow

1. **Authentication** – Admin and privileged API calls use JWTs issued through `app/api/auth/login` and verified by helpers in `lib/auth.js`. The `User` model normalises roles and hashes passwords using bcrypt before persistence.
2. **Public acquisition flows** – Prospective owners/tenants submit forms under `app/signup` and `app/api/signup`. Data is stored as `SignupApplication` documents that can later be transformed into live chalets or tenant accounts.
3. **Chalet lifecycle** – CRUD operations in `app/api/chalets` populate `Chalet` documents. Owners can be scoped using `owner=me` query params, and super-admins can aggregate pending signup applications alongside active chalets.
4. **Bookings and payments** – Routes in `app/api/bookings` manage reservations, while Stripe checkout sessions and webhooks are exposed under `app/api/stripe/*`.
5. **Content delivery** – Marketing pages read from `Content` and `PortfolioItem` collections to render curated experiences, with uploads handled through `app/api/uploads` and Cloudinary helpers.

## Role-based access control

The `User` model exposes convenience helpers such as `hasAdminAccess()` and the `lib/auth.requireRole()` wrapper to guard API handlers. Roles include:

- `super-admin`: full platform access including signup moderation.
- `admin`: manage chalets, bookings and content across sites.
- `owner`: scoped to chalets linked through the `chalets` array.
- `manager`: operational support role with limited write access.
- `tenant`: downstream user accounts created during onboarding.

When building new features, prefer composing route handlers with `requireAuth` and `requireRole` to ensure the access model remains consistent.

## Background jobs & automation

The project ships with a `seed.js` script that can populate development data. Automated processes (e.g. onboarding conversion) are implemented within API handlers today; future work can extract them into queue workers if throughput requirements grow.

## Front-end foundations

- Styling is handled with Tailwind CSS (`tailwind.config.ts`), with utility helpers like `cn()` in `lib/utils.ts` to merge class names safely.
- UI primitives rely heavily on Radix UI components, ensuring accessibility-friendly defaults.
- Forms are generally managed via `react-hook-form` and validated with Zod schemas where applicable.

Refer to the [API reference](./API_REFERENCE.md) for details about the available endpoints that bridge these subsystems.
