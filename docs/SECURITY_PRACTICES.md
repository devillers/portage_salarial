# Security & Compliance Enhancements

The project already enforces core safeguards such as JWT authentication, bcrypt password hashing and Stripe webhook verification. This document outlines additional controls to harden the platform in response to the latest audit.

## Application security

- **Rate limiting**: Introduce per-IP throttling on authentication and public form endpoints using middleware (e.g. `@upstash/ratelimit` or Redis backed counters).
- **Input sanitisation**: Continue validating request bodies with Zod schemas. Ensure HTML/markdown content persists via trusted sanitisation libraries (e.g. DOMPurify server-side) before rendering.
- **Audit logging**: Centralise auth attempts, chalet mutations and booking changes in an append-only log collection for forensic analysis.
- **Session invalidation**: Provide an admin panel control to revoke JWTs by rotating the signing secret or storing token identifiers in a deny-list.

## Infrastructure security

- **Secrets management**: Store environment variables in a dedicated secret manager (AWS SSM, Doppler, etc.) and rotate them quarterly.
- **TLS everywhere**: Enforce HTTPS on all environments; redirect HTTP to HTTPS at the edge.
- **Email hardening**: Configure SPF, DKIM and DMARC records for the transactional email domain to improve deliverability and prevent spoofing.

## Data protection & backups

- **Automated backups**: Schedule MongoDB snapshot backups at least daily, with 30-day retention and secure offsite storage.
- **Restore testing**: Exercise disaster recovery twice per year by restoring backups into staging and running smoke tests.
- **PII minimisation**: Review `SignupApplication` fields and redact sensitive identifiers (passport numbers, etc.) once an onboarding decision is made.
- **GDPR workflows**: Document procedures for data access, rectification and erasure requests. Implement API endpoints for administrators to export or delete tenant data on demand.

## Monitoring & alerting

- **Security alerts**: Hook audit logs and Stripe webhook failures into the monitoring stack (Datadog, Sentry or equivalent) with on-call notifications.
- **Anomaly detection**: Track abnormal booking spikes or repeated failed logins and notify operators.
- **Dependency scanning**: Enable a Dependabot or Renovate workflow to keep npm packages patched. Combine with `npm audit` in CI to block critical vulnerabilities.

## Accessibility testing

While not a security issue, maintaining accessibility helps meet compliance goals:

- Run automated audits (Lighthouse CI, axe) on marketing and admin flows.
- Track fixes in an accessibility backlog with severity labels.
- Provide semantic alternatives for interactive map and gallery components.

Documenting these controls ensures that future development considers production-readiness requirements beyond core feature delivery.
