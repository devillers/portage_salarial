# Testing Strategy

Automated tests are currently absent from the project. This plan documents how to introduce coverage incrementally while respecting the existing stack.

## Guiding principles

1. **Start with critical paths** – Focus on authentication, chalet CRUD, booking creation and Stripe webhook handling before covering ancillary marketing pages.
2. **Favour integration tests** – Many handlers couple database access, business logic and email/Stripe side effects. Use integration tests with an in-memory MongoDB server (e.g. `mongodb-memory-server`) to exercise realistic flows.
3. **Keep fast feedback loops** – Unit test pure utilities (`lib/utils.ts`, data normalisers) with Vitest or Jest to catch regressions quickly.
4. **Document fixtures** – Store reusable payloads (sample chalet, booking, user) in `tests/fixtures/` to avoid duplication and ease future maintenance.

## Tooling recommendations

- **Test runner**: [Vitest](https://vitest.dev/) integrates well with Vite-powered tooling and supports ESM modules out of the box.
- **Component testing**: Leverage [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for React components rendered through Next.js. Combine with [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) for expressive assertions.
- **API testing**: Use [supertest](https://github.com/visionmedia/supertest) to call Next.js route handlers directly.
- **Mocking**: Stub external services such as Stripe and Nodemailer with Vitest's mocking utilities. For Stripe, export helper factories under `tests/mocks/stripe.ts` to simulate event payloads.

## Proposed roadmap

### Phase 1 – Foundations
- Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `supertest`, `mongodb-memory-server`, `ts-node`.
- Configure `vitest.config.ts` with aliases mirroring `tsconfig.json` paths and setup files registering `@testing-library/jest-dom`.
- Add npm scripts:
  ```json
  {
    "scripts": {
      "test": "vitest run",
      "test:watch": "vitest"
    }
  }
  ```

### Phase 2 – Authentication & users
- Cover `app/api/auth/login` to ensure tenant auto-provisioning works and inactive users are rejected.
- Test `lib/auth.js` helpers (`generateToken`, `verifyToken`, `requireAuth`) using a seeded in-memory database.

### Phase 3 – Chalet lifecycle
- Exercise `GET /api/chalets` filters, `POST /api/chalets` validations and `PATCH /api/chalets/[slug]` authorisation rules.
- Verify that signup applications appear when `includeSignups=true` for super-admins.

### Phase 4 – Bookings & payments
- Mock Stripe to test checkout session creation and webhook conversion.
- Validate booking creation rejects unavailable dates and sends confirmation metadata.

### Phase 5 – Front-end smoke tests
- Render key pages (home, admin dashboard shell) using `next-router-mock` to confirm critical UI elements and SEO tags.

### Phase 6 – Regression guardrails
- Set up GitHub Actions workflow to run `npm run lint` and `npm test` on pull requests.
- Track coverage thresholds (aim for 70%+ statements on business-critical modules).

## Manual testing checklist

Until automated coverage is in place, follow this checklist before deploying:

- [ ] Run `npm run lint` and address warnings.
- [ ] Manually exercise admin login, chalet creation and booking flow in a staging environment.
- [ ] Trigger Stripe test webhooks using the CLI to ensure bookings sync.
- [ ] Verify tenant post editing and publication toggles.
- [ ] Check accessibility with browser extensions (Lighthouse, axe) on marketing and admin pages.

Document progress in pull requests so contributors understand which areas are already safeguarded.
