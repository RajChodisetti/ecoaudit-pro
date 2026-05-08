# Development Strategy — EcoAudit Pro Android App
## Offline-Only | Pre-Approved Credentials | Phased Delivery

---

## Required Development Workflow

All development must follow the backlog, delivery, and tested workflow in `docs/backlog/`.

Before any feature work starts:
- Confirm the feature exists in the relevant phase backlog.
- If it does not exist, add it first with requirements, expectations, use cases, and smoke tests.
- Start the work by naming the backlog item ID.

When development finishes:
- Add the feature to `docs/backlog/DELIVERY_LOG.md`.
- Include what changed, what was added, why it was added, how it is relevant, what it does, how to test it, and what the user should expect.
- Mark the phase backlog item as `[D] Delivered for user testing`.

When the user accepts the feature:
- Move the delivery entry to `docs/backlog/TESTED_LOG.md`.
- Strike the item off in the phase backlog and mark it `[x] User tested`.

Do not mark a backlog item complete just because development smoke tests passed. Completion requires user testing.

Execution documents:

| Document | Purpose |
|---|---|
| `docs/backlog/README.md` | Required workflow and status rules |
| `docs/backlog/FEATURE_PARITY_MATRIX.md` | Ensures no current web app feature is missing from the mobile backlog |
| `docs/backlog/PHASE_1_FOUNDATION_AND_MVP.md` | Phase 1 executable backlog |
| `docs/backlog/PHASE_2_FULL_WEB_PARITY.md` | Phase 2 full web parity backlog |
| `docs/backlog/PHASE_3_PRODUCTION_HARDENING.md` | Phase 3 production readiness backlog |
| `docs/backlog/PHASE_4_SYNC_AND_ECOSYSTEM.md` | Future sync/API ecosystem backlog |
| `docs/backlog/DELIVERY_LOG.md` | Features ready for user testing |
| `docs/backlog/TESTED_LOG.md` | User-tested accepted features |

---

## Pre-Approved Credentials — How It Works

Before phases begin, we need to decide how inspector credentials are managed locally on the device. There is no internet involved at any point.

### Recommended Approach: Local User Store

```
Admin (you / office) creates inspectors
      ↓
Credentials stored in encrypted SQLite on the device
      ↓
Inspector opens app → enters username + password
      ↓
App validates against local database — no network call, ever
```

- Each device has its own local user list
- Passwords are hashed (bcrypt) — never stored in plain text
- An **Admin PIN** (set during app setup) allows adding / removing inspectors on the device
- Credentials can also be distributed via **QR code** — admin generates a QR from a simple web tool, inspector scans it to activate their profile on the device
- If a device is lost, only that device's local data is at risk — no central system is exposed

### Credential Distribution Options (choose one before Phase 1 starts)

| Option | How it works | Best for |
|---|---|---|
| **Admin PIN + local setup** | Admin unlocks device, adds inspectors manually | Small team, one device per inspector |
| **QR code activation** | Admin sends QR via email/WhatsApp, inspector scans once | Multiple inspectors, multiple devices |
| **Pre-seeded build** | Credentials baked into the APK before distribution | Fixed team, no self-registration needed |

> **Decision needed before Phase 1:** Which option fits the team's workflow? This decision does not change the rest of the app — only the credential setup screen.

---

## Phase Overview

```
Phase 1 — MVP          6–8 weeks    Core audit capture + PDF (3 equipment types)
Phase 2 — Full Suite   3–4 weeks    All 9 equipment types + complete PDF
Phase 3 — Production   2–3 weeks    Polish + Play Store submission
Phase 4 — Sync         Future       API server + sync (separate quote)
```

---

## Phase 1 — MVP
### Goal: A working app inspectors can take on site tomorrow

**What an inspector can do at the end of Phase 1:**
- Log in offline with their username and password
- Create a new audit (site name, address, inspector, date)
- Add zones to the audit
- Capture the 3 most common equipment types with photos
- Generate a professional PDF report on the device
- Save and share the PDF (email, WhatsApp, Drive)
- View all past audits on the dashboard

---

### 1.1 — Foundation & Auth

| # | What gets built | Why it's first |
|---|---|---|
| 1 | Expo project scaffold (React Native + TypeScript) | Everything builds on this |
| 2 | SQLite database setup (Drizzle ORM + migrations) | All local storage depends on this |
| 3 | Local user table + bcrypt password hashing | Required before any screen can load |
| 4 | Login screen (offline validation) | Gate to the entire app |
| 5 | Admin PIN screen (add / remove inspectors) | Needed before first deployment |
| 6 | Credential setup via QR or manual entry | Inspector onboarding flow |
| 7 | Session persistence (stay logged in between app opens) | UX requirement |
| 8 | Biometric unlock (Face ID / fingerprint as shortcut) | Speeds up daily use on site |

**Deliverable:** App opens → login works → session persists → admin can manage users. No other screens yet.

---

### 1.2 — Core Audit Workflow

| # | What gets built |
|---|---|
| 9  | Dashboard — list of audits, search bar, create new button |
| 10 | Create / Edit Audit screen (site name, address, inspector, date, status) |
| 11 | Zone management — add, edit, delete zones within an audit |
| 12 | Delete audit with confirmation |
| 13 | Mark audit as Completed / revert to Draft |

**Deliverable:** Full audit and zone lifecycle works locally.

---

### 1.3 — Equipment Capture (3 Types for MVP)

Three equipment types chosen for MVP because they appear in almost every audit:

| Equipment Type | Why included in MVP |
|---|---|
| **HVAC Unit** | Most common, high-value finding in every audit |
| **Lighting System** | Appears in every commercial site audit |
| **Main Switchboard** | Required for electrical baseline in every report |

For each type:
- Full form with all fields (ported from web app Zod schemas)
- Primary photo (camera capture)
- Additional photos (multi-select)
- Edit and delete existing items
- Stored in local SQLite

**Not in MVP:** Solar PV, Forklift Charger, Hot Water, Additional Switchboard, General Water/Electricity Q&A — Phase 2.

---

### 1.4 — Camera & Photo Storage

| # | What gets built |
|---|---|
| 14 | Camera capture — take photo directly in app |
| 15 | Gallery picker — choose from existing photos |
| 16 | Photo compression on capture (1200px max, 75% JPEG quality) |
| 17 | Save original + compressed copy to device filesystem |
| 18 | Photo preview and delete within equipment forms |
| 19 | Graceful handling of storage permission denial |

---

### 1.5 — PDF Generation (MVP Report)

MVP PDF contains:
- Report header (branding, site details, inspector, date)
- Executive summary (default template text, editable)
- HVAC section (all captured units)
- Lighting section (all captured systems)
- Main Switchboard section
- Consolidated observations
- Page numbers and footer

| # | What gets built |
|---|---|
| 20 | HTML report templates (inline styles, Montserrat font bundled) |
| 21 | Photo-to-base64 conversion pipeline (compressed copy used) |
| 22 | expo-print integration → PDF file generated on device |
| 23 | Save PDF to device storage |
| 24 | Share PDF via Android share sheet (email, WhatsApp, Drive, etc.) |
| 25 | Regenerate PDF when audit data changes |

---

### 1.6 — Settings & Housekeeping

| # | What gets built |
|---|---|
| 26 | Settings screen (theme toggle, app version, admin access) |
| 27 | Admin section — add/remove inspectors, change admin PIN |
| 28 | Sync flag toggle (UI only in Phase 1 — button greyed out with "Coming soon") |
| 29 | Storage usage indicator (how much space audits + photos are using) |

---

### Phase 1 Exit Criteria (Definition of Done)

- [ ] Inspector can log in offline with username + password
- [ ] Admin can add and remove inspectors via admin PIN
- [ ] Inspector can create an audit, add zones, capture HVAC + Lighting + Main Switchboard
- [ ] Photos can be taken with camera and attached to any equipment
- [ ] PDF generates on-device with correct data and photos
- [ ] PDF can be shared via Android share sheet
- [ ] All data persists after closing and reopening the app
- [ ] App tested on at least 2 physical Android devices (different screen sizes)
- [ ] No crashes during a complete audit → PDF flow

---

## Phase 2 — Full Equipment Suite
### Goal: Feature parity with the existing web app

**Duration:** 3–4 weeks  
**Starts:** Immediately after Phase 1 sign-off

### 2.1 — Remaining 6 Equipment Types

| Equipment Type | Notes |
|---|---|
| Additional Switchboard | Includes type selector (MSSB / PVDB / DSB-W / DSB-S) |
| Solar PV | Available roof space, cable routing, switchboard suitability |
| Forklift Charger | Connection type, scheduling opportunity, space for additional |
| Hot Water System | Fuel type, pipe insulation, tempering valve |
| General Water | Q&A format — question + answer + photos |
| General Electricity | Q&A format — question + answer + photos |

Same pattern as Phase 1 equipment: full form, primary photo, multi-photo, edit/delete.

---

### 2.2 — Full PDF Report

Extend the MVP PDF to include all 11 sections:

| Section | Status after Phase 1 |
|---|---|
| Report header | ✅ Done |
| Executive summary | ✅ Done |
| Main Switchboard | ✅ Done |
| HVAC Systems | ✅ Done |
| Lighting Systems | ✅ Done |
| Additional Switchboards | Phase 2 |
| Solar PV | Phase 2 |
| Forklift Charging | Phase 2 |
| Hot Water Systems | Phase 2 |
| General Water | Phase 2 |
| General Electricity | Phase 2 |
| Consolidated Observations | ✅ Done |

---

### 2.3 — Photo Management

| # | What gets built |
|---|---|
| 30 | Photo include/exclude toggle per photo (choose what appears in PDF) |
| 31 | Download all photos as ZIP (organised by zone) |
| 32 | Photo viewer with swipe navigation |

---

### 2.4 — Report Customisation

| # | What gets built |
|---|---|
| 33 | Editable executive summary before generating PDF |
| 34 | Editable consolidated observations |
| 35 | Section selector — choose which equipment sections appear in PDF |

---

### Phase 2 Exit Criteria

- [ ] All 9 equipment types work (capture, edit, delete, photo)
- [ ] PDF contains all 11 sections with correct data
- [ ] Photo include/exclude works and reflects in generated PDF
- [ ] ZIP download of all photos works
- [ ] Executive summary and observations are editable before PDF generation
- [ ] Tested end-to-end on 3 physical Android devices (including a low-end device)

---

## Phase 3 — Production Ready
### Goal: App Store quality, ready for real inspectors

**Duration:** 2–3 weeks  
**Starts:** After Phase 2 sign-off

### 3.1 — UX Polish

| # | What gets built |
|---|---|
| 36 | App icon and splash screen (branded) |
| 37 | Onboarding screens for first-time setup (admin PIN + first inspector) |
| 38 | Empty states (no audits yet, no zones yet, no equipment yet) |
| 39 | Loading states and skeleton screens |
| 40 | Offline status indicator (persistent banner if needed — though always offline) |
| 41 | Error states with clear messages |
| 42 | Pull-to-refresh on dashboard |
| 43 | Haptic feedback on key actions |

---

### 3.2 — Performance & Stability

| # | What gets built |
|---|---|
| 44 | Performance testing on low-end Android (2GB RAM devices) |
| 45 | PDF generation memory profiling (audits with 50+ photos) |
| 46 | SQLite query optimisation for large audit lists |
| 47 | Photo storage cleanup (remove orphaned files when equipment is deleted) |
| 48 | App size optimisation (target under 50MB APK) |

---

### 3.3 — Google Play Submission

| # | What gets built |
|---|---|
| 49 | App signing configuration (keystore generated and secured) |
| 50 | Play Store listing: description, screenshots, privacy policy |
| 51 | AAB (Android App Bundle) production build via EAS |
| 52 | Internal testing track → closed testing → production |
| 53 | Play Store privacy policy page (required for apps with local storage) |

---

### 3.4 — Handover

| Deliverable | Format |
|---|---|
| Source code | Private GitHub repository, full history |
| Architecture documentation | Markdown + diagrams |
| Data model reference | All SQLite tables, fields, and relationships |
| Credential management guide | How to add inspectors, reset admin PIN, distribute via QR |
| Build and deployment guide | How to build a new APK, sign it, and submit to Play Store |
| Handover session | 1-hour walkthrough call with your team |

---

### Phase 3 Exit Criteria

- [ ] App icon and splash screen are branded correctly
- [ ] Onboarding flow works for a first-time device setup
- [ ] App passes Play Store review (internal testing track)
- [ ] App size is under 50MB
- [ ] PDF generation with 50+ photos completes without crash on a 2GB RAM device
- [ ] All documentation delivered
- [ ] Handover session completed
- [ ] 30-day warranty period begins

---

## Phase 4 — Sync Infrastructure
### Not in this quote — future engagement

**Trigger:** When the client is ready to centralise audit data

**What this phase adds:**
- API server + PostgreSQL database (your own infrastructure)
- Web admin portal to view and manage synced audits
- Sync button activation in the mobile app (already built and hidden behind flag)
- Photo upload queue with retry logic
- Per-audit sync mode: Auto / Manual / Offline-Only (never leaves device)
- Multi-device support — same inspector, multiple devices
- Role-based access control (Admin, Inspector, Viewer)

**Why it's separate:** The mobile app is fully functional without it. You get real value from Phase 1–3 immediately. Phase 4 adds centralisation and team features when the team is ready.

---

## Timeline Summary

```
Week 1–2    Phase 1.1  Foundation + Auth (scaffold, SQLite, login, admin)
Week 3–4    Phase 1.2  Core audit workflow (dashboard, audit, zones)
Week 5–6    Phase 1.3  Equipment capture — 3 types
Week 6–7    Phase 1.4  Camera + photo storage
Week 7–8    Phase 1.5  PDF generation (MVP report)
            Phase 1.6  Settings + sync flag placeholder
            ── Phase 1 review + sign-off ──

Week 9–10   Phase 2.1  Remaining 6 equipment types
Week 11     Phase 2.2  Full 11-section PDF
Week 12     Phase 2.3  Photo management + report customisation
            ── Phase 2 review + sign-off ──

Week 13     Phase 3.1  UX polish + branding
Week 14     Phase 3.2  Performance + stability testing
Week 15–16  Phase 3.3  Play Store submission + review cycle
            Phase 3.4  Handover
            ── Delivery + 30-day warranty begins ──
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Play Store review rejection | Medium | Low | Submit early to internal track in Week 13; fix any policy issues before production |
| PDF crashes on low-end Android devices | Medium | High | Profile memory in Phase 2; compress photos aggressively; test on 2GB RAM device from Week 7 |
| Credential distribution workflow doesn't suit client team | Low | Medium | Confirm QR vs manual vs pre-seeded before Phase 1 starts |
| Scope creep on equipment form fields | Medium | Medium | Lock field specs from web app data model before Phase 1.3 begins |
| expo-print rendering differences Android vs future iOS | Low | Low | Isolated to template files; fix is localised when iOS phase begins |

---

## Decision Needed Before Phase 1 Starts

Only one decision blocks the start of development:

> **How will inspector credentials be distributed to devices?**
> - Option A: Admin enters credentials manually on each device (Admin PIN unlocks this)
> - Option B: Admin generates a QR code → inspector scans to activate
> - Option C: Credentials are pre-loaded into the APK before distribution (fixed team, no self-registration)

Everything else is ready to begin.
