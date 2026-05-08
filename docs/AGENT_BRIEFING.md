# Agent Briefing — EcoAudit Pro

This document is the single source of truth for any agent (human or AI) beginning work on this codebase. Read this before touching any code.

---

## Required Backlog Workflow

Before changing code or docs for a feature, read `docs/backlog/README.md` and identify the backlog item ID.

Required flow:

1. Confirm the feature is represented in a phase backlog.
2. If missing, add it to the correct phase backlog before implementation.
3. Mark the item `[~] In progress` while building.
4. After implementation and developer smoke testing, add an entry to `docs/backlog/DELIVERY_LOG.md`.
5. Mark the backlog item `[D] Delivered for user testing`.
6. Only after user acceptance, move the entry to `docs/backlog/TESTED_LOG.md`.
7. Strike off the backlog item and mark it `[x] User tested`.

Do not mark a backlog item complete only because tests pass. Completion requires user testing.

Feature parity is tracked in `docs/backlog/FEATURE_PARITY_MATRIX.md`. If a current web app feature is missing from the backlog, update the matrix and phase docs before coding.

---

## What Is This App?

**Sustainability Wise / EcoAudit Pro** is a mobile-first web application used by energy auditors to:
1. Log on-site energy equipment data across 9 equipment categories
2. Capture photos at each step
3. Generate a professionally branded PDF report for the client

Users are energy inspectors who visit commercial sites (warehouses, factories, offices) and need to record everything on their phone or tablet. The workflow is:

```
Dashboard → Create Audit → Add Zones → Capture Equipment (×9 types) → Review → Generate PDF
```

---

## Codebase Location & Structure

```
/ecoaudit-pro
├── /src
│   ├── /api/base44Client.js        ← Single DB/auth client (all data access goes here)
│   ├── /lib/
│   │   ├── AuthContext.jsx         ← Global auth state + useAuth() hook
│   │   ├── app-params.js           ← Read app_id + token from URL/localStorage
│   │   └── query-client.js         ← React Query config
│   ├── /pages/                     ← One file per screen (7 pages)
│   ├── /components/
│   │   ├── /report/                ← 12 report section components (PDF layout)
│   │   └── /ui/                    ← 51 Radix UI wrappers (do not edit)
│   └── App.jsx                     ← Route definitions
├── /base44
│   ├── /entities/                  ← JSONC schema files (11 entities)
│   └── /functions/
│       └── sendAuditCompletedEmail/ ← Deno serverless function
└── /docs/                          ← Documentation (this folder)
```

---

## Tech Stack (Quick Reference)

| Concern | Library |
|---|---|
| Framework | React 18 + Vite 6 |
| Routing | React Router v6 |
| Styling | TailwindCSS 3 + Radix UI |
| Server state | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| PDF | jsPDF + html2canvas |
| ZIP | JSZip |
| Backend | Base44 BaaS (proprietary) |
| Auth | Base44 SDK |
| File uploads | Base44 Core.UploadFile |
| Email | Base44 Core.SendEmail |
| Serverless | Deno (TypeScript) |

---

## Key Constraints

### 1. Base44 is the only backend
All data reads and writes go through `base44.entities.[EntityName].*`. There is no REST API, no GraphQL, no direct database access. The SDK is JS-only.

### 2. No public API exists
External systems (including a mobile app) cannot access data without building a new API layer. See `API_CAPABILITIES.md`.

### 3. No offline support
Every operation requires network connectivity. Adding offline support is the primary requested feature. See `MOBILE_ARCHITECTURE.md`.

### 4. PDF generation is 100% client-side
`ClientReport.jsx` renders a React component tree → `html2canvas` converts it → `jsPDF` assembles pages. This cannot be called from a server or mobile native code without a headless browser.

### 5. Photos are remote URLs
All photos are uploaded to Base44's file service and stored as URL strings. Local blob paths do not exist in the current app.

---

## Data Access Pattern

All data operations follow this pattern:

```js
import { Audit, HVACUnit, Zone } from "@/api/base44Client";

// List all audits (sorted by created_date descending)
const audits = await Audit.list("-created_date");

// Filter equipment by audit
const hvacUnits = await HVACUnit.filter({ audit_id: auditId });

// Create
const newZone = await Zone.create({ audit_id, zone_name, zone_description });

// Update
await HVACUnit.update(unitId, { serial_number: "ABC123" });

// Delete
await Zone.delete(zoneId);
```

The 11 entity exports from `base44Client.js`:
`Audit, Zone, MainSwitchboard, AdditionalSwitchboard, HVACUnit, LightingSystem, SolarPV, ForkliftCharger, HotWaterSystem, GeneralWater, GeneralElectricity`

---

## Authentication

```js
import { useAuth } from "@/lib/AuthContext";

const { user, isAuthenticated, logout } = useAuth();
```

- Token stored in `localStorage` as `base44_access_token`
- All routes are protected; unauthenticated users are redirected by `AppLayout`
- `user.full_name` and `user.email` are available from `useAuth()`

---

## 9 Equipment Types

Each type maps to its own entity. The form for each is in `EquipmentFormFields.jsx` (one large switch/if block):

| Type Key | Entity | Form section |
|---|---|---|
| `main_switchboard` | MainSwitchboard | Electrical |
| `additional_switchboard` | AdditionalSwitchboard | Electrical |
| `hvac` | HVACUnit | HVAC |
| `lighting` | LightingSystem | Lighting |
| `solar_pv` | SolarPV | Solar |
| `forklift` | ForkliftCharger | Forklift |
| `hot_water` | HotWaterSystem | Hot Water |
| `general_water` | GeneralWater | General Water |
| `general_electricity` | GeneralElectricity | General Electricity |

---

## Report Generation Flow

```
ClientReport.jsx
  1. Load all entities for audit (parallel queries)
  2. Render <ReportHeader>, <ReportElectrical>, <ReportHVAC>, ... hidden in DOM
  3. User clicks Download
  4. DownloadOptionsDialog: user selects sections + items
  5. Apply smart page-break spacers (JS DOM manipulation)
  6. html2canvas captures DOM element → canvas
  7. Slice canvas by A4 page height
  8. Add each slice to jsPDF with header/footer overlays
  9. Save PDF file
```

Report section components are in `/src/components/report/`:
- `ReportHeader.jsx` — branding header
- `ReportElectrical.jsx` — switchboards
- `ReportHVAC.jsx`
- `ReportLighting.jsx`
- `ReportSolar.jsx`
- `ReportForklift.jsx`
- `ReportHotWater.jsx`
- `ReportGeneralWater.jsx`
- `ReportGeneralElectricity.jsx`
- `ReportObservations.jsx`
- `DownloadOptionsDialog.jsx` — section/item selector

---

## Current Feature Status

| Feature | Status |
|---|---|
| Full audit CRUD | ✅ |
| 9 equipment types with forms | ✅ |
| Single + multi photo upload | ✅ |
| PDF report generation | ✅ |
| Photo include/exclude from PDF | ✅ |
| ZIP download of all photos | ✅ |
| Email on audit completion | ✅ |
| Dark mode | ✅ |
| Stripe payment | ⏳ Wired, not activated |
| CSV export | ⏳ Component exists, not connected |
| Maps/location | ⏳ Library imported, not used |
| Offline support | ❌ |
| Public API | ❌ |
| Push notifications | ❌ |
| Real-time collaboration | ❌ |

---

## What the Client Wants Next

1. **Mobile app (Android first, iOS after with minimal rework)**
2. **Fully offline** — every feature including PDF generation works without internet
3. **Online only for login** — JWT cached for up to 30 days offline
4. **Optional sync** — per-audit choice: auto / manual / offline-only (never leaves device)
5. **Data restriction** — org-level policy can force all audits to offline-only
6. **Proper ecosystem** — Base44 discarded; build real API + database

### Chosen Approach (see `MOBILE_ARCHITECTURE.md` for full analysis)

**Mobile:** React Native + Expo (Android first, iOS same codebase)
**PDF:** expo-print with self-contained HTML templates (offline, native rendering quality)
**Local storage:** expo-sqlite + Drizzle ORM (data) + expo-file-system (photos)
**Backend:** Supabase (PostgreSQL + auth + storage + edge functions, self-hostable)
**Web:** Next.js 15 admin portal + client report viewer
**Base44:** Discarded entirely after prototype phase

---

## Files to Read First (In Order)

1. `docs/APP_OVERVIEW.md` — What the app does
2. `docs/DATA_MODELS.md` — All entities and fields
3. `docs/API_CAPABILITIES.md` — What API work is needed
4. `docs/MOBILE_ARCHITECTURE.md` — Mobile strategy
5. `src/api/base44Client.js` — Data access
6. `src/pages/ClientReport.jsx` — PDF generation (most complex page)
7. `src/components/EquipmentFormFields.jsx` — All equipment forms

---

## Risks & Open Questions

| Risk | Severity | Notes |
|---|---|---|
| expo-print layout differences Android vs iOS | Medium | Test HTML templates early on both platforms |
| Memory pressure with base64 photos in PDF | Medium | Compress to 1200px/70% JPEG before embedding |
| Supabase self-hosting complexity | Medium | Docker Compose; good official docs; plan for it early |
| 30-day offline session limit | Low | Extend refresh token TTL if clients need longer field periods |
| Play Store first-submission review | Low | Budget 2–4 weeks; submit early |
| Stripe integration status | Low | Dependencies in web app but no UI — clarify if payments needed |
