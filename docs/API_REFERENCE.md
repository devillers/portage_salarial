# API Reference

This reference captures the behaviour of the primary REST endpoints served from `app/api`. All routes return JSON responses and follow the `{ success: boolean, message?: string, data?: any }` envelope by convention.

## Authentication

### `POST /api/auth/login`
- **Description**: Exchange a username/email and password for a JWT.
- **Request body**: `{ "username": string, "password": string }`
- **Responses**:
  - `200`: `{ token, user }` on success. Tenant signup applications can be auto-promoted to live users.
  - `401`: Invalid credentials or deactivated account.

### `POST /api/auth/register`
- **Description**: Create a new admin or super-admin account.
- **Request body**: `{ username, email, password, role? }` – role defaults to `admin`.
- **Auth**: Typically restricted to provisioning scripts.

### `GET /api/auth/verify`
- **Description**: Validate a JWT supplied through the `Authorization: Bearer` header. Returns the resolved user or `401`.

## Signup flows

### `POST /api/signup`
- **Description**: Capture onboarding information for either property owners or tenants.
- **Request body**: `{ type: 'owner' | 'tenant', data: { ... } }` – owner payloads require chalet metadata, tenant payloads collect preferences and credentials.
- **Side effects**:
  - Owner submissions create `SignupApplication` records and ensure a corresponding `User` with the `owner` role exists.
  - Tenant submissions hash and store a password for later activation.

### `GET /api/chalets?includeSignups=true`
- When `includeSignups` is requested by a `super-admin`, pending owner applications are merged into the listing response with placeholder fields.

## Chalets

### `GET /api/chalets`
- **Description**: Fetch chalet listings with optional filters.
- **Query parameters**:
  - `search` – fuzzy match on title, city or description.
  - `featured=true` – restrict to highlighted chalets.
  - `limit`, `page` – pagination controls.
  - `owner=<id|me>` – scope to a given owner. `owner=me` requires a valid JWT.
  - `includeInactive=true` – available to super-admins or owners when viewing their own chalets.
- **Response**: `{ data: Chalet[], total }` where each chalet includes availability metadata.

### `POST /api/chalets`
- **Description**: Create a new chalet record. Protected with `requireAuth` and expects the complete chalet payload defined by `models/Chalet.js`.

### `GET /api/chalets/[slug]`
- **Description**: Fetch a single chalet by slug. Automatically increments the view counter via `Chalet.incrementViews()`.

### `PUT /api/chalets/[slug]`
- **Description**: Replace a chalet document. Requires admin privileges.

### `PATCH /api/chalets/[slug]`
- **Description**: Granular update endpoint reserved for `super-admin` users. Supports partial updates (e.g. toggling `availability.isActive`).

## Bookings

### `POST /api/bookings`
- **Description**: Create a reservation for a chalet once availability is validated.
- **Request body**: `{ chaletId, dates: { checkIn, checkOut }, guests, pricing, guest }`
- **Side effects**: Generates a confirmation number and triggers `sendBookingConfirmation` email notifications.

### `GET /api/bookings`
- **Description**: List bookings with pagination and optional filters.
- **Query parameters**:
  - `chaletId` – restrict to a single chalet.
  - `status` – filter by booking status.
  - `owner=<id|me>` – limit results to chalets owned by the authenticated user.
  - `page`, `limit` – pagination controls (defaults to 10 per page).
- **Auth**: Required for owner scoping and privileged lists.

## Payments

### `POST /api/stripe/create-checkout-session`
- **Description**: Create a Stripe Checkout session for a booking request.
- **Request body**: booking metadata needed for price calculation and redirect URLs.
- **Response**: `{ url, sessionId }` for the client to redirect.

### `POST /api/stripe/webhook`
- **Description**: Stripe webhook receiver verifying the signature using `lib/stripe.js`. Converts successful sessions into confirmed bookings and logs failures.
- **Auth**: Stripe-signed requests only.

## Content management

### `GET /api/content`
- **Description**: Retrieve content blocks by page/section (query params `page`, `section`, `status`).
- **Use cases**: Marketing pages, dynamic sections, tenant communications.

### `POST /api/content`
- **Description**: Upsert content blocks. Requires admin authentication (`requireAuth`). Payload mirrors the `Content` model and supports version metadata.

### `GET /api/portfolio`
- **Description**: Return portfolio items for the marketing site. Supports optional `featured`, `limit` and `search` filters.

### `POST /api/portfolio`
- **Description**: Create or update portfolio items. Protected endpoint for admins.

### `POST /api/contact`
- **Description**: Submit the marketing contact form. Triggers transactional emails via `lib/email.js`.

## Tenant workspace

### `GET /api/tenant/posts`
- **Description**: Fetch the authenticated tenant's long-form post (stored as a `Content` document with page `tenant-posts`).
- **Auth**: Requires a tenant JWT.

### `PUT /api/tenant/posts`
- **Description**: Create or update the tenant's post with markdown/HTML/text content types. Validates title/content and stores publication settings.

## System utilities

### `GET /api/system-status`
- **Description**: Health-check route returning database connectivity and environment metadata.

### `POST /api/system-status`
- **Description**: Development helper that seeds fake page content for testing (`page` query parameter required). Protected by environment checks.

### `POST /api/uploads`
- **Description**: Upload assets to Cloudinary. Authenticated route that returns secure URLs.

## Error handling

- Validation errors return `400` with a descriptive `errors` array where applicable (e.g. chalet updates, booking creation).
- Authentication failures always return `401` with `message` clarifying the reason (`Authentication required`, `Invalid or expired token`).
- Authorisation failures use `403` and the message `Insufficient permissions` or a domain-specific variant.

For schema specifics, refer directly to the Mongoose models in the `models/` directory, which detail the complete shape of each entity.
