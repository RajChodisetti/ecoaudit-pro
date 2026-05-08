# Technical Backlog Workflow

This folder is the execution source of truth for EcoAudit Pro development.

The backlog is organised by phase, but feature parity is tracked across the full program. A feature may be deferred to a later phase, but it must not disappear from the backlog unless the product owner explicitly removes it.

## Required Flow

Every feature moves through this exact path:

1. Backlog item exists in the correct phase document.
2. Developer starts work and marks the item as `[~] In progress`.
3. Developer finishes implementation and smoke testing.
4. Developer adds a full entry to [DELIVERY_LOG.md](DELIVERY_LOG.md).
5. Developer marks the backlog item as `[D] Delivered for user testing`.
6. User tests the delivered feature using the delivery instructions.
7. If accepted, move the delivery entry to [TESTED_LOG.md](TESTED_LOG.md).
8. Strike the backlog item in its phase document and mark it `[x] User tested`.
9. If rejected, keep it in the delivery log, add the user feedback, and move the backlog item back to `[~] In progress`.

Do not mark a feature complete only because automated tests passed. A backlog item is complete only after user testing has accepted it.

## Status Values

Use these exact values in phase docs:

| Status | Meaning |
|---|---|
| `[ ] Backlog` | Not started |
| `[~] In progress` | Actively being built |
| `[D] Delivered for user testing` | Implemented, smoke tested, and listed in the delivery log |
| `[x] User tested` | Accepted by user, moved to tested log, and struck off the backlog |
| `[B] Blocked` | Cannot proceed without a named decision or dependency |
| `[N/A] Not applicable` | Removed from scope with an approved reason |

## Backlog Item Format

Each item must include:

- Stable item ID, for example `EA-P1-006`
- Status
- Requirements
- Expectations
- Use cases
- Smoke tests
- Delivery log requirement

## Documents

| Document | Purpose |
|---|---|
| [FEATURE_PARITY_MATRIX.md](FEATURE_PARITY_MATRIX.md) | Confirms every current web app feature is represented in the backlog |
| [PHASE_1_FOUNDATION_AND_MVP.md](PHASE_1_FOUNDATION_AND_MVP.md) | Offline Android foundation and first usable audit workflow |
| [PHASE_2_FULL_WEB_PARITY.md](PHASE_2_FULL_WEB_PARITY.md) | Remaining web-app parity: all equipment types, photo/report tooling, full PDF |
| [PHASE_3_PRODUCTION_HARDENING.md](PHASE_3_PRODUCTION_HARDENING.md) | Production readiness, device QA, app store, handover |
| [PHASE_4_SYNC_AND_ECOSYSTEM.md](PHASE_4_SYNC_AND_ECOSYSTEM.md) | Future API, sync, admin portal, integrations |
| [DELIVERY_LOG.md](DELIVERY_LOG.md) | Features ready for user testing |
| [TESTED_LOG.md](TESTED_LOG.md) | User-tested and accepted features |

## Development Rules

- Start each unit of work by naming the backlog item ID.
- If the work is not already in a phase backlog, add it before coding.
- If a discovered feature is missing from the phase docs, add it to the right phase and update the parity matrix.
- Phase 1 items must be delivered as APK-testable increments: each Phase 1 item needs a buildable APK, install test, and phone smoke test before delivery.
- Every delivered item must include manual smoke-test instructions written from the user's point of view.
- Every smoke test must state what to do and what to expect.
- Delivery log entries are not optional, even for small changes.
- Tested log entries are only added after user acceptance.
- The tested log is append-only. Do not delete accepted history.
- Backlog strike-off happens only after the entry has moved from delivery to tested.

## Phase Completion Rule

A phase is complete only when:

- All phase backlog items are `[x] User tested`, or explicitly `[N/A]` with a reason approved by the product owner.
- The delivery log has no open entries for that phase.
- The tested log contains the accepted entries for that phase.
- The phase smoke suite has been run on the target device class.
