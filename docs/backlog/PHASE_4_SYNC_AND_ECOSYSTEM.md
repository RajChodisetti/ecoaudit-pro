# Phase 4 Backlog - Sync and Ecosystem

Goal: add networked infrastructure after the offline Android app is valuable on its own.

Phase 4 is a future engagement. It covers anything that requires a central API, shared database, remote storage, web admin portal, email/webhooks, client access, or integrations.

## Phase 4 Exit Criteria

- API, database, auth, storage, and sync protocol are implemented and tested.
- Offline-only audit guarantees are enforced.
- Web admin portal can view/manage synced audits.
- Remote PDF/photo access works for synced audits.
- Completion email/delete-account workflows have network-backed replacements.
- Conflict handling and retry behavior are tested.

---

## EA-P4-001 - API and Database Foundation

Status: `[ ] Backlog`

Requirements:

- Build a real API layer for audits, zones, equipment, files, reports, and sync.
- Use a durable database with exportable data ownership.
- Model all entities from `docs/DATA_MODELS.md`.
- Add environments for development, staging, and production.
- Add authentication/authorization middleware.

Expectations:

- External systems and mobile sync do not depend on Base44.
- API contracts are documented and versioned.

Use cases:

- Mobile app syncs a locally captured audit.
- Admin portal lists synced audits.
- External system fetches report metadata.

Smoke tests:

1. Create audit through API.
   Expected: audit persists and can be fetched.
2. Create zone and equipment rows.
   Expected: relationships are valid.
3. Attempt unauthorised request.
   Expected: API rejects it.
4. Export database backup or dump.
   Expected: data is accessible outside vendor lock-in.

Delivery log requirement:

- Include API endpoints delivered, environment URLs, and auth behavior tested.

---

## EA-P4-002 - Organisation, User, Role, and Client Separation

Status: `[ ] Backlog`

Requirements:

- Add organisations/accounts.
- Add roles: Admin, Inspector, Viewer or approved equivalent.
- Scope audits, reports, files, and users by organisation.
- Add client access model if clients view reports directly.
- Add org-level policy for sync behavior, including forced offline-only if required.

Expectations:

- Users cannot access another organisation's audits.
- Role permissions are enforced on API and UI.

Use cases:

- Admin manages inspectors in one organisation.
- Viewer can open reports but not edit audit data.
- Client A cannot see Client B's audits.

Smoke tests:

1. Create two organisations with users.
   Expected: each sees only its own data.
2. Try cross-org audit access.
   Expected: access denied.
3. Change a user role.
   Expected: permissions update as designed.
4. Apply forced offline-only org policy.
   Expected: mobile sync is disabled for new audits in that org.

Delivery log requirement:

- Include role matrix and cross-org access tests.

---

## EA-P4-003 - Mobile Sync Engine

Status: `[ ] Backlog`

Requirements:

- Add sync queue for local changes.
- Support audit sync modes: auto, manual, offline-only.
- Enforce offline-only as a hard no-transmit rule.
- Sync audits, zones, equipment, photos, and report metadata.
- Add retry, backoff, and failure visibility.
- Add conflict detection and resolution policy.

Expectations:

- Offline capture remains first-class.
- Sync never sends offline-only audits or their child data.
- Failed sync can be retried without duplicate records.

Use cases:

- Inspector syncs an audit after returning online.
- Inspector keeps a sensitive audit offline-only.
- Two edits conflict and require resolution.

Smoke tests:

1. Create audit offline with auto sync.
   Expected: changes queue locally.
2. Restore network.
   Expected: queued changes sync and receive server IDs.
3. Create offline-only audit.
   Expected: no sync queue rows are created for that audit or children.
4. Force API failure.
   Expected: sync retries and shows recoverable status.
5. Simulate conflict.
   Expected: conflict is marked and resolution path works.

Delivery log requirement:

- Include sync mode tests, queue state transitions, and offline-only proof.

---

## EA-P4-004 - Remote Photo and PDF Storage

Status: `[ ] Backlog`

Requirements:

- Upload synced audit photos to remote object storage.
- Upload generated PDFs or generate/store PDFs server-side according to approved architecture.
- Store remote URLs against audit/report records.
- Preserve local originals on device unless retention policy says otherwise.
- Add access control to remote files.

Expectations:

- Synced reports and photos are available outside the device.
- Private files are not publicly accessible without approved links/auth.

Use cases:

- Office downloads photos from web admin portal.
- Client receives a report link.
- Mobile app shows sync status for photo uploads.

Smoke tests:

1. Sync audit with photos.
   Expected: remote photo URLs are created and accessible to authorised user.
2. Upload generated PDF.
   Expected: report PDF URL is stored.
3. Attempt unauthorised file access.
   Expected: access denied or signed-link expiry applies.
4. Delete audit according to policy.
   Expected: remote files are deleted or retained according to policy.

Delivery log requirement:

- Include storage bucket/path layout, access-control behavior, and sample remote URLs.

---

## EA-P4-005 - Web Admin Portal

Status: `[ ] Backlog`

Requirements:

- Build admin portal for organisations, users, audits, reports, and files.
- List and filter synced audits.
- View audit details, zones, equipment, photos, and generated PDFs.
- Download report PDFs and image ZIPs where authorised.
- Manage users and roles.

Expectations:

- Office/admin users can manage synced audit data without using the mobile device.
- Portal permissions match API permissions.

Use cases:

- Admin reviews completed audit from desktop.
- Office downloads report and photo archive.
- Admin deactivates an inspector.

Smoke tests:

1. Log in as Admin.
   Expected: organisation dashboard opens.
2. Open synced audit.
   Expected: audit details, zones, equipment, photos, and PDF are visible.
3. Log in as Viewer.
   Expected: edit/admin controls are hidden or blocked.
4. Download PDF/photo archive.
   Expected: files download successfully.

Delivery log requirement:

- Include portal routes, roles tested, and sample audit used.

---

## EA-P4-006 - Email, Webhooks, Delete Account, and Integrations

Status: `[ ] Backlog`

Requirements:

- Replace Base44 completion email with API/server-backed notification.
- Add account deletion request workflow if online accounts exist.
- Add webhook/event hooks for audit completion if required.
- Add integration surface for external systems where approved.
- Queue notifications safely when mobile is offline and syncs later.

Expectations:

- Network-dependent workflows are reliable and auditable.
- Offline app does not pretend to send email until sync/API confirms it.

Use cases:

- Completed audit sends internal notification after sync.
- User requests account deletion.
- External system receives audit-completed event.

Smoke tests:

1. Complete audit and sync.
   Expected: completion email/event is sent once.
2. Retry sync after failure.
   Expected: duplicate email is not sent.
3. Request account deletion.
   Expected: request is recorded and notification path runs.
4. Verify webhook payload.
   Expected: payload includes approved audit/report fields only.

Delivery log requirement:

- Include notification recipients, duplicate-prevention behavior, and payload examples.

---

## EA-P4-007 - Client Report Viewer and Share Links

Status: `[ ] Backlog`

Requirements:

- Provide secure client-facing access to approved reports if in scope.
- Support expiring or revocable share links.
- Track report access where required.
- Prevent clients from editing audit data.

Expectations:

- Clients can view/download reports without seeing internal admin data.
- Share access can be revoked.

Use cases:

- Admin sends client a report link.
- Client downloads PDF.
- Admin revokes the link after project completion.

Smoke tests:

1. Generate share link.
   Expected: unauthenticated or client-scoped access opens approved report only.
2. Revoke link.
   Expected: old link no longer works.
3. Try accessing another report by changing URL.
   Expected: access denied.

Delivery log requirement:

- Include link expiry/revocation behavior and access-control tests.

---

## EA-P4-008 - Observability, Backups, and Operations

Status: `[ ] Backlog`

Requirements:

- Add API logging, error monitoring, and audit trails for critical actions.
- Add database backup strategy and restore test.
- Add storage backup/retention policy.
- Add operational runbook for sync failures, user access, and incident response.

Expectations:

- Production issues can be diagnosed without guessing.
- Data can be restored from backup.

Use cases:

- Support investigates failed sync.
- Admin needs an audit restored.
- Operations monitors API errors after release.

Smoke tests:

1. Trigger known API error.
   Expected: error is logged with useful context.
2. Run backup.
   Expected: backup completes.
3. Restore backup to test environment.
   Expected: data is readable and relationships intact.
4. Review audit trail.
   Expected: critical create/update/delete actions are recorded.

Delivery log requirement:

- Include monitoring tools, backup schedule, and restore-test result.

