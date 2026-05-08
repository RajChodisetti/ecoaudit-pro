# Feature Parity Matrix

This matrix prevents web-app features from being lost while the Android/offline backlog is phased.

Source references:

- Web app overview: `docs/APP_OVERVIEW.md`
- Data models: `docs/DATA_MODELS.md`
- Current routes: `src/App.jsx`
- Equipment forms: `src/components/EquipmentFormFields.jsx`
- PDF/report flow: `src/pages/PhotoPreview.jsx`, `src/pages/ClientReport.jsx`
- Current status notes: `docs/AGENT_BRIEFING.md`

## Parity Rule

If a feature exists in the current web app, it must appear in a phase backlog item below. If it is intentionally not part of the Android app, it must be marked `N/A` with a reason.

## Current Web Feature Coverage

| Web feature | Current web behavior | Mobile backlog coverage | Parity status |
|---|---|---|---|
| Protected app access | Base44 token auth, public settings check, auth-required redirect, user-not-registered error | `EA-P1-003`, `EA-P1-004` | Covered as offline credential store and local session |
| User-not-registered error | Dedicated error state for whitelist miss | `EA-P1-004` | Covered as inactive/unauthorised local account state |
| App layout | Sticky top header, mobile bottom nav, animated route content | `EA-P1-005` | Covered |
| Dashboard audit list | Loads audits newest first, search by site or inspector, empty/loading states | `EA-P1-006` | Covered |
| Pull to refresh | Manual refetch on Dashboard and Site Audit | `EA-P1-006`, `EA-P1-007` | Covered as local reload and future sync refresh placeholder |
| Create audit | Site name, address, inspector, date, draft status | `EA-P1-007` | Covered |
| Edit audit | Save changed metadata | `EA-P1-007` | Covered |
| Delete audit | Confirmation and optimistic removal | `EA-P1-007` | Covered with local cascade deletion |
| Audit status | Draft/Completed badge and complete action | `EA-P1-007` | Covered |
| Completion email | Base44 serverless email to internal team on completion | `EA-P4-006` | Deferred because offline-only app cannot send email until sync/API exists |
| Zone list | Zones shown under audit | `EA-P1-008` | Covered |
| Add zone | Modal with required zone name and optional description | `EA-P1-008` | Covered |
| Delete zone | Removes zone from audit | `EA-P1-008` | Covered with cascade to local equipment/photos |
| Zone photos | Multi-photo capture/upload for a zone | `EA-P1-008`, `EA-P1-009` | Covered |
| Equipment grid | 9 add buttons with type-specific icon/colour | `EA-P1-010` | Covered |
| Equipment CRUD framework | Add, edit, delete equipment by type in zone | `EA-P1-010` | Covered |
| Main Switchboard form | Full current field set with photo and extra photos | `EA-P1-011` | Covered in Phase 1 |
| HVAC form | Full current field set with multiple equipment photos | `EA-P1-012` | Covered in Phase 1 |
| Lighting form | Full current field set with fixture/control photos | `EA-P1-013` | Covered in Phase 1 |
| Additional Switchboard form | Full current field set with type selector | `EA-P2-001` | Covered in Phase 2 |
| Solar PV form | Full current field set with conditional roof-space fields | `EA-P2-002` | Covered in Phase 2 |
| Forklift Charger form | Full current field set with connection/scheduling fields | `EA-P2-003` | Covered in Phase 2 |
| Hot Water System form | Full current field set with pipe/valve/system fields | `EA-P2-004` | Covered in Phase 2 |
| General Water Q&A | Question, answer, photos, notes | `EA-P2-005` | Covered in Phase 2 |
| General Electricity Q&A | Question, answer, photos, notes | `EA-P2-005` | Covered in Phase 2 |
| Single photo upload | Camera or gallery, preview, remove | `EA-P1-009` | Covered as local filesystem photo capture |
| Multi-photo upload | Camera or gallery, thumbnail list, remove | `EA-P1-009` | Covered as local filesystem photo capture |
| Internal audit report | Review data by zone or equipment type | `EA-P1-014`, `EA-P2-011` | MVP for Phase 1 types, full parity in Phase 2 |
| Photo preview grouping | Groups all equipment photos by type, item, and zone | `EA-P2-008` | Covered |
| Include/exclude report photos | Per-photo and per-group include/exclude state | `EA-P2-008` | Covered |
| Live report preview | Report preview reflects excluded photos and edited text | `EA-P2-008` | Covered |
| Report content editor | Executive summary and observation text edits before report | `EA-P2-007` | Covered |
| Download images ZIP | ZIP selected photos organised by zone | `EA-P2-009` | Covered |
| Client PDF report | Branded A4 PDF with header/footer, sections, page-break handling | `EA-P1-015`, `EA-P2-006` | MVP in Phase 1, full parity in Phase 2 |
| Download options | Section and item selector before PDF export | `EA-P2-010` | Covered |
| Electrical report section | Main and additional switchboards | `EA-P1-015`, `EA-P2-006` | Main in Phase 1, additional in Phase 2 |
| HVAC report section | HVAC equipment cards and fields | `EA-P1-015` | Covered in Phase 1 |
| Lighting report section | Lighting equipment cards and fields | `EA-P1-015` | Covered in Phase 1 |
| Solar report section | Solar PV report section | `EA-P2-006` | Covered in Phase 2 |
| Forklift report section | Forklift charging report section | `EA-P2-006` | Covered in Phase 2 |
| Hot water report section | Hot water report section | `EA-P2-006` | Covered in Phase 2 |
| General water/electricity report sections | Q&A report sections | `EA-P2-006` | Covered in Phase 2 |
| Consolidated observations | Generated/editable report observations | `EA-P1-015`, `EA-P2-007` | Covered |
| Settings profile | User full name and email display | `EA-P1-016` | Covered with local user profile |
| Theme selection | System, light, dark | `EA-P1-005`, `EA-P1-016` | Covered |
| Logout | Clears session and returns to login | `EA-P1-004`, `EA-P1-016` | Covered |
| Delete account request | Sends email and logs out | `EA-P4-006` | Deferred to API/sync because offline-only app cannot send support email |
| Loading, empty, and error states | Spinners, empty states, toasts | `EA-P1-006`, `EA-P1-007`, `EA-P3-003` | Covered and hardened in Phase 3 |
| Base44 file storage | Uploads photos to Base44 URLs | `EA-P1-009`, `EA-P4-004` | Replaced by local filesystem first; remote storage deferred to sync |
| CSV export component | Component exists but is not connected to a current route/workflow | Decision item below | Not current user-facing parity |
| Maps/location library | Library imported, not used in a current route/workflow | Decision item below | Not current user-facing parity |
| Stripe dependency | Dependency wired, no active payment UI | Decision item below | Not current user-facing parity |

## Non-User-Facing Items To Confirm

These exist in the codebase but are not active user workflows in the current web app. They should not block web parity unless the product owner activates them.

| Item | Current state | Backlog action |
|---|---|---|
| CSV export | `CSVExport.jsx` exists, not connected | Add a new Phase 2 or Phase 4 item only if export becomes required |
| Maps/location | React Leaflet dependency noted, no active map UI | Add a new backlog item only if GPS/map locator UX becomes required |
| Stripe | Dependency/status noted, no active payment screen | Add a new Phase 4 item only if billing is in scope |

## Phase Coverage Summary

| Phase | Coverage goal |
|---|---|
| Phase 1 | Offline Android foundation plus usable audit capture for Dashboard, Audit, Zones, Photos, Main Switchboard, HVAC, Lighting, internal review, and MVP PDF |
| Phase 2 | Full parity with all 9 equipment types, all report sections, photo selection, live preview, ZIP export, and full PDF customisation |
| Phase 3 | Production quality, device QA, app store readiness, supportable handover |
| Phase 4 | Features that require network/API: sync, web admin portal, completion email replacement, delete-account workflow, remote report storage, integrations |

