# Repository Readiness Status

Audited: 2026-08-21  
Baseline revision: `7e1d574`  
Current assessment: **Level 0 — not yet Minimum Ready**  
Next milestone after blocker removal: **Level 2 — Structured Ready**  
Target: **Level 5 — Federated and Governed**

This record is intentionally conservative. The presence of new readiness files
does not mean the repository has passed clean-clone or CI acceptance.

## Phase Status

- Phase 0: incomplete. AI-readiness, security, documentation, and domain owners
  are unassigned; representative historical tasks and token/rework baselines do
  not exist.
- Phase 1: initial manual inventory completed. No automated artifact scoring or
  evaluation suite exists.
- Phase 2: incomplete. Stale mobile/API documents and authorization questions
  remain; no files were deleted because verified information must be preserved.
- Phase 3: scaffolded but not achieved. Instructions, manifest, security policy,
  path policy, toolchain pin, and CI definition now exist, but the exit criteria
  below remain unresolved.

## Verified Findings and Blockers

- At audit time, `mobile` was recorded at `1bfe6ac` but locally checked out at
  `1d8b8b5`; this pre-existing state must be preserved until a human chooses the
  intended revision.
- Root web dependencies were not installed, so build/lint/typecheck could not be
  rerun locally during the audit.
- There is no web product-test script or serverless-function test harness.
- `npm audit --omit=dev` reported 18 production findings: 1 critical, 8 high,
  and 9 moderate. Exploitability and upgrades require dedicated review.
- `sendAuditCompletedEmail` performs service-role reads without an explicit
  in-function authorization check; Base44 invocation controls are not versioned
  here.
- Effective Base44 access rules and the `Audit` schema are not fully represented
  by local source.
- `docs/API_CAPABILITIES.md` and `docs/MOBILE_ARCHITECTURE.md` conflict with the
  implemented mobile/shared-API system.
- No active human CODEOWNERS mapping or verified default-branch protection
  exists.
- The staged workflow uses floating major action tags and has no secret/dependency-scanning job;
  immutable reviewed SHAs and scanning remain required before security enforcement can be claimed.

## Artifact Dispositions

- Adapt: `README.md`, `docs/APP_OVERVIEW.md`, `docs/DATA_MODELS.md`, Base44
  schemas/functions, and the mobile submodule integration.
- Replace or clearly archive after owner review: `docs/API_CAPABILITIES.md` and
  `docs/MOBILE_ARCHITECTURE.md`.
- Keep: `package-lock.json` and tracked application source.
- Exclude from default context: generated outputs, dependencies, ignored local
  settings, and the mobile repository unless the task includes it.

## Minimum-Ready Exit Work

1. Assign human owners and activate valid CODEOWNERS entries.
2. Resolve the mobile gitlink decision and stale canonical documents.
3. Triage dependency advisories and service-role authorization.
4. Add focused web and function tests.
5. Prove `npm ci`, lint, typecheck, build, and CI from a clean clone.
6. Establish branch protection and required review/check settings on the chosen
   canonical remote.
