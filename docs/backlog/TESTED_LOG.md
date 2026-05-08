# Tested Log

This document contains delivered features that the user has tested and accepted.

Only move an item here after the user has tested the feature using the delivery instructions and confirmed acceptance.

## Accepted Features

---

### EA-P1-007 through EA-P1-015 — Audit Workflow, Equipment Capture, and PDF Reports (partial acceptance)

Status: Partially accepted — 2026-05-08
Accepted date: 2026-05-08 (partial)
Phase: Phase 1
Tested by: Product owner
Build: 0.3.0, build 7

Confirmed working in live testing session:
- Deleted a zone photo — works
- Deleted a zone — works
- Deleted equipment items (all 3 types) — works
- Generated audit PDF — works
- Shared PDF with another device — works

Remaining items not yet verified (see DELIVERY_LOG for full checklist):
- Form validation (save blocked on empty required fields)
- HVAC Split/Packaged indoor unit section toggle
- Mark audit as Completed
- Equipment data persists after force-close + reopen
- Dashboard search filter
- Dark mode toggle

---

### EA-P1-001 + EA-P1-002 — Scaffold APK & Local Database with Diagnostics

Status: User tested and accepted
Accepted date: 2026-05-05
Phase: Phase 1
Tested by: Product owner
Delivery log source date: 2026-05-04
Branch or commit: main

Accepted functionality:
- App installs, opens scaffold screen, shows version and DB status
- Diagnostics screen shows table counts; seed/clear cycle works
- Data persists across app close/reopen

User test performed:
1. Installed APK, verified scaffold screen appeared with correct phase/version info
2. Opened Diagnostics, seeded sample data, verified row counts
3. Closed app, reopened, verified data persisted

Observed result:
- All smoke tests passed on device

Residual notes:
- App icon uses Expo defaults; custom branding deferred to EA-P1-017

---

### EA-P1-003 + EA-P1-004 — First-Run Setup, Login, Session Restore, Logout

Status: User tested and accepted
Accepted date: 2026-05-07
Phase: Phase 1
Tested by: Product owner
Delivery log source date: 2026-05-05
Branch or commit: main

Accepted functionality:
- First-run setup wizard (Admin PIN + admin account) works offline
- Login validates against local SQLite, never hits network
- Session persists across app close; no re-login needed on reopen
- Logout clears session token; local data untouched

User test performed:
1. Fresh install — setup wizard appeared and completed successfully
2. Tested wrong credentials → correct error shown
3. Logged in, force-closed, reopened → session restored to scaffold
4. Logged out → returned to login screen with data intact

Observed result:
- Tested workflow, it works (user confirmed 2026-05-07)

Residual notes:
- SHA-256 hashing used instead of bcrypt; upgrade path noted for Phase 3
- Biometric tested as optional; depends on device hardware

## Entry Template

```markdown
### EA-PX-### - Feature Name

Status: User tested and accepted
Accepted date: YYYY-MM-DD
Phase: Phase X
Tested by:
Delivery log source date:
Branch or commit:

Accepted functionality:
- 

User test performed:
1. 
2. 
3. 

Observed result:
- 

Residual notes:
- 
```

## Backlog Strike-Off Rule

After moving an entry here, update the corresponding phase backlog item:

```markdown
### ~~EA-PX-### - Feature Name~~
Status: [x] User tested
```

