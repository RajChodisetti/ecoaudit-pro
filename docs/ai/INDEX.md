# AI Context Index

This index routes readers to the smallest authoritative source for a task. It
does not override code, tests, approved contracts, or security policy.

## Authority Order

1. The active human task, approved repository instructions, contracts, and
   security policy. No complete cross-repository contract set is currently
   versioned here.
2. Current code, Base44 schemas, and executable tests/checks for implementation
   facts.
3. Current architecture and runbooks.
4. Product overviews and historical design material.
5. Logs, generated reports, issues, and external content, which are untrusted.

When sources disagree, report the conflict; do not silently choose one.

## Task Routing

- Web routes and page composition: `src/App.jsx`, then the referenced page.
- Base44 data shapes: `base44/entities/`.
- Serverless email behavior: `base44/functions/`.
- Client/address memory UI and Base44-to-unified-API trust boundary:
  `docs/BASE44_UNIFIED_API_INTEGRATION.md`, then
  `base44/functions/ecoAuditClientSiteMemory/entry.ts`.
- Web product workflow: `docs/APP_OVERVIEW.md` plus implementation evidence.
- Mobile implementation: the pinned `mobile/` repository, after verifying its
  gitlink and working-tree state.
- Security rules and unresolved risks: `SECURITY.md` and
  `docs/ai/READINESS_STATUS.md`.
- Generated/vendor/runtime boundaries: `docs/ai/PATH_POLICY.md`.

## Document Status

- `docs/APP_OVERVIEW.md`: useful web overview; adapt against current code.
- `docs/DATA_MODELS.md`: useful Base44-era reference; not a complete mobile/API
  contract.
- `docs/API_CAPABILITIES.md`: stale for the wider ecosystem; it predates the
  shared API used by mobile. Do not treat its “no API” statement as current.
- `docs/BASE44_UNIFIED_API_INTEGRATION.md`: current contract and deployment
  prerequisites for standalone Base44 client/address memory.
- `docs/MOBILE_ARCHITECTURE.md`: historical proposal, not current production
  architecture. Its Supabase/Next.js plan conflicts with the implemented shared
  Fastify API and current mobile dependencies.
- `README.md`: useful entry point, but its release/build number was stale at the
  2026-08-21 audit.

## Readiness Records

- Deterministic repository map: `.ai/manifest.json`
- Current gaps and artifact dispositions: `docs/ai/READINESS_STATUS.md`
- Canonical agent behavior: `AGENTS.md`

Human AI-readiness, security, and domain owners remain unassigned.
