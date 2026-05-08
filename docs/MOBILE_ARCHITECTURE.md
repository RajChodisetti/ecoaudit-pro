# Mobile & Ecosystem Architecture

## Overview

This is a full ecosystem rebuild. Base44 is a prototype only. The production system has three components:

```
┌──────────────────────────────────────────────────────────────────┐
│                        Ecosystem                                  │
│                                                                   │
│  Mobile App (React Native + Expo)                                 │
│    Android first → iOS with near-zero rework                      │
│    Full offline capability except login                           │
│    PDF generation on-device, no network required                  │
│            ↕ sync (optional, per-audit)                           │
│  API + Database (Supabase — self-hostable)                        │
│    PostgreSQL, JWT auth, S3 storage, Edge Functions               │
│            ↕                                                      │
│  Web Admin Portal (Next.js 15)                                    │
│    Org management, user management, report downloads              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Core Requirements

1. **Full offline** — every feature works without internet except initial login
2. **PDF on-device** — generate professional reports offline, store locally
3. **Optional sync** — per-audit choice: auto-sync / manual-sync / offline-only (never leaves device)
4. **Data restriction** — org-level policy can force all audits to offline-only
5. **Android first, iOS with minimal rework** — single codebase
6. **Proper ecosystem** — real API, real database, Base44 discarded

---

## Mobile Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React Native 0.76+ (New Architecture) | Single codebase Android + iOS |
| Build tooling | Expo SDK 52+ + EAS Build | Cloud builds, no Xcode needed for Android phase |
| Language | TypeScript | Shared types with API layer |
| Navigation | React Navigation 6 | Platform-adaptive (Material on Android, Cupertino on iOS) |
| Forms | React Hook Form + Zod | Direct reuse of web app validation schemas |
| **Offline DB** | **expo-sqlite + Drizzle ORM** | SQLite with TypeScript-typed queries + migrations |
| **Photo storage** | **expo-file-system** | Photos persisted as files in documentDirectory |
| **PDF generation** | **expo-print (HTML templates)** | See PDF section below |
| Photo capture | expo-image-picker + expo-image-manipulator | Capture + compress/resize before storing |
| Auth tokens | expo-secure-store | Keychain (iOS) / Keystore (Android) — hardware-backed |
| Biometric unlock | expo-local-authentication | App unlock without network; does not replace JWT |
| Connectivity | @react-native-community/netinfo | Drives sync engine |
| Local state | Zustand | Lightweight, no boilerplate |
| Server state | TanStack Query | Active only when online |
| Distribution | Expo EAS Build + EAS Submit | Android APK/AAB now, iOS IPA later |

---

## PDF Generation — Full Offline

### Why the web approach doesn't port directly

The web app generates PDFs via `html2canvas` (DOM capture) + `jsPDF` (page assembly). This cannot run in a mobile native context. The web report components also use TailwindCSS classes and load resources from external URLs (Google Fonts, Base44 image CDN) — neither works offline.

### Solution: `expo-print` with self-contained HTML templates

`expo-print.printToFileAsync({ html })` passes an HTML string to the native rendering engine:
- **iOS**: WebKit (same engine as Safari)
- **Android**: Chromium (via Android System WebView)

Both are full browser engines — layout, CSS, fonts, images all render correctly. The result is a PDF file saved to the device filesystem. **This works 100% offline.**

### What changes from the web app

| Web app | Mobile app |
|---|---|
| React JSX components | TypeScript HTML template functions |
| TailwindCSS classes | Inline styles only |
| Google Fonts (network) | Montserrat font bundled as base64 data URI |
| External image URLs (`https://...`) | Photos read from filesystem → compressed → base64 embedded |
| html2canvas DOM capture | expo-print native rendering |
| jsPDF page assembly | expo-print handles pagination |
| Client-side download | expo-file-system local storage + expo-sharing |

### Photo memory management

An audit with 50+ photos embedded as base64 in one HTML string could be 50–150MB, which crashes on mid-range Android devices.

Solution:
1. `expo-image-manipulator` resizes and compresses photos before PDF embedding (1200px max width, 70% JPEG quality — still sharp in A4 print)
2. Original full-resolution photos stored separately (for ZIP download feature)
3. PDF generation pipeline: capture → store original → compress copy → base64 → inject into HTML template → expo-print

### Template approach

```typescript
// /src/pdf/templates/hvac.ts
export function hvacSectionHtml(units: HVACUnit[], photos: PhotoMap): string {
  return `
    <section style="margin-bottom: 32px; font-family: Montserrat, sans-serif;">
      <h2 style="color: #162A4E; font-size: 18px; font-weight: 700; 
                 border-bottom: 2px solid #79B44A; padding-bottom: 8px;">
        HVAC Systems
      </h2>
      ${units.map(unit => hvacUnitCard(unit, photos)).join('')}
    </section>
  `
}

// /src/pdf/report.ts
export async function generateReportPdf(auditId: string): Promise<string> {
  const data = await loadAllAuditData(auditId)        // from SQLite
  const photos = await loadPhotosAsBase64(auditId)    // from filesystem, compressed
  
  const html = fullReportHtml(data, photos)           // assemble all sections
  const { uri } = await Print.printToFileAsync({ html, base64: false })
  
  // Move to permanent location
  const destPath = `${FileSystem.documentDirectory}pdfs/${auditId}_report.pdf`
  await FileSystem.moveAsync({ from: uri, to: destPath })
  
  return destPath
}
```

This is a one-time port effort. The 11 report sections map 1:1 from the existing React components to TypeScript template functions. Estimated ~600–800 lines.

---

## Offline Storage Architecture

### Two-layer storage

```
Layer 1: SQLite (Drizzle ORM)          Layer 2: expo-file-system
────────────────────────────           ───────────────────────────────
All structured data                    All binary files
  audits                                 documentDirectory/
  zones                                    photos/
  hvac_units                                 {audit_local_id}/
  lighting_systems                             {zone_local_id}/
  solar_pv                                       hvac_{id}_main.jpg
  forklift_chargers                              hvac_{id}_extra_0.jpg
  hot_water_systems                              lighting_{id}_main.jpg
  main_switchboards                   pdfs/
  additional_switchboards                 {audit_local_id}_report.pdf
  general_water                       cache/
  general_electricity                     compressed/  ← for PDF embedding
  photo_upload_queue
  sync_queue
```

### Sync metadata on every entity table

Every table carries these additional columns:

```sql
_local_id    TEXT UNIQUE  -- device UUID (used before server assigns real ID)
_server_id   TEXT         -- null until first successful sync
_sync_status TEXT         -- 'local' | 'pending' | 'synced' | 'conflict'
_updated_at  TEXT         -- ISO timestamp, drives conflict resolution
```

### Audit sync_mode

The most important field in the schema:

```sql
CREATE TABLE audits (
  -- ... all existing fields ...

  sync_mode TEXT NOT NULL DEFAULT 'auto',
  -- 'auto'         → syncs whenever network is available
  -- 'manual'       → syncs only when user explicitly taps "Sync now"
  -- 'offline_only' → NEVER syncs; data stays on this device permanently

  report_pdf_local_path TEXT,   -- path to PDF on device filesystem
  report_pdf_remote_url TEXT    -- null for offline_only audits, always null
);
```

**Enforcement:** The sync engine checks `sync_mode` before adding any row to `sync_queue`. `offline_only` audits, their zones, their equipment, and their photos never enter the sync queue. This is a hard code gate, not a preference.

**Immutable after creation:** Once `offline_only` is set, the UI locks it. The privacy guarantee is that the app will never transmit this data.

**Org-level policy:** Admin portal can set `sync_policy = 'offline_only'` on an organisation, which forces all new audits in that org to `offline_only`. Useful for classified-site clients.

### Sync queue table

```sql
CREATE TABLE sync_queue (
  id           TEXT PRIMARY KEY,
  entity_type  TEXT,   -- 'audit' | 'zone' | 'hvac_unit' | ...
  entity_local_id TEXT,
  operation    TEXT,   -- 'create' | 'update' | 'delete'
  payload      TEXT,   -- JSON of changed fields
  created_at   TEXT,
  attempts     INTEGER DEFAULT 0,
  last_error   TEXT
);
-- offline_only audit entities are NEVER inserted here
```

### Photo upload queue table

```sql
CREATE TABLE photo_upload_queue (
  id           TEXT PRIMARY KEY,
  audit_id     TEXT,   -- used to check sync_mode before uploading
  entity_type  TEXT,
  entity_id    TEXT,
  field_name   TEXT,   -- which field this photo belongs to
  local_path   TEXT,   -- expo-file-system path
  remote_url   TEXT,   -- null until uploaded
  status       TEXT DEFAULT 'pending',  -- 'pending' | 'uploading' | 'uploaded' | 'failed'
  created_at   TEXT
);
```

---

## Authentication Strategy

Login is the only operation that requires internet.

### Flow

```
Initial login (internet required):
  email + password
    → POST /api/auth/login
    → returns { access_token (JWT, 1hr), refresh_token (30 days) }
    → both stored in expo-secure-store (encrypted, hardware-backed)

While offline:
  JWT used for local operations that need user context (no network calls for SQLite ops)
  Biometric (Face ID / fingerprint) used to unlock app
  Biometric does NOT refresh JWT — it only unlocks the local session

JWT refresh:
  NetInfo detects: offline → online
  App silently refreshes JWT using refresh token
  New JWT + new refresh token stored

Refresh token expires (30 days without any online connection):
  App shows "Connect to internet to refresh your session"
  This is the only forced-online moment after initial login

Device session table (local):
  Tracks last_online_at and jwt_expires_at
  App warns user 7 days before session expiry while offline
```

### Why this works for field auditors

A field auditor can be offline for up to 30 days and work fully — capture data, take photos, generate PDFs — without any internet. The only constraint is logging in once every 30 days when connectivity is available.

---

## Sync Protocol

### Triggers
- NetInfo detects offline → online (for `auto` audits)
- User taps "Sync now" (for `manual` and `auto` audits)
- Never triggered for `offline_only` audits

### Push (device → server)

```
1. SELECT * FROM sync_queue ORDER BY created_at ASC
2. Batch into groups of 50 rows
3. POST /api/sync/push  { changes: [...], device_id, user_id }
4. Server returns: { accepted: [...], conflicts: [...], server_ids: {...} }
5. For each accepted:
   - Update _server_id, _sync_status = 'synced'
   - Remove from sync_queue
6. For each conflict:
   - Mark _sync_status = 'conflict'
   - Show conflict UI (last-write wins by default, user can review)
```

### Pull (server → device)

```
GET /api/sync/pull?since={last_synced_at}&device_id={id}
Returns: { changes: [...], server_ts: "..." }

For each change:
  - If _local_id exists: merge by _updated_at (newer wins)
  - If new: insert with _sync_status = 'synced'

Store server_ts as new watermark for next pull
```

### Photo upload (separate queue)

```
For each row in photo_upload_queue WHERE status = 'pending':
  1. Check audit sync_mode — skip if 'offline_only'
  2. Read file from expo-file-system
  3. POST /api/files/upload (multipart/form-data)
  4. Get back { url }
  5. Update entity field in SQLite with remote URL
  6. Mark photo_upload_queue row as 'uploaded'
  7. Optionally delete local compressed copy (keep original)
```

### Conflict strategy

| Entity | Strategy |
|---|---|
| Audit metadata | Last `_updated_at` wins |
| Equipment items | Last `_updated_at` wins |
| Zones | Last `_updated_at` wins |
| Photos | Append-only; no conflict possible |
| Deletions | Deletion always wins over concurrent update |

---

## Backend: Supabase (Self-Hostable)

### Why Supabase

- **PostgreSQL** — real relational database, exportable, standard SQL
- **GoTrue auth** — JWT + refresh tokens, email/password, works for mobile offline sessions
- **Storage** — S3-compatible, photo and PDF storage with signed URLs
- **PostgREST** — auto-generated REST API from schema (reduces custom API code)
- **Edge Functions** — Deno serverless for business logic (email notifications, etc.)
- **Row Level Security** — multi-tenant data isolation enforced at DB level, not app level
- **Self-hostable via Docker** — for clients requiring data sovereignty, deploy to their VPC with the same codebase

### Multi-tenant schema (PostgreSQL)

```sql
-- Tenancy
CREATE TABLE organizations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  sync_policy  TEXT DEFAULT 'auto',  -- org-level override for audit sync_mode
  plan         TEXT DEFAULT 'standard',
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id       UUID REFERENCES organizations(id),
  full_name    TEXT,
  role         TEXT DEFAULT 'inspector',  -- 'super_admin' | 'org_admin' | 'inspector'
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Audits (mirrors mobile schema, without sync metadata)
CREATE TABLE audits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organizations(id),
  site_name       TEXT NOT NULL,
  site_address    TEXT,
  inspector_name  TEXT,
  inspector_id    UUID REFERENCES user_profiles(id),
  audit_date      DATE,
  status          TEXT DEFAULT 'Draft',
  sync_mode       TEXT DEFAULT 'auto',
  report_pdf_url  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- + zones, hvac_units, lighting_systems, solar_pv, forklift_chargers,
--   hot_water_systems, main_switchboards, additional_switchboards,
--   general_water, general_electricity  (same fields as Base44 entities)
--   all with org_id + audit_id + created_at + updated_at

-- File records
CREATE TABLE files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID REFERENCES organizations(id),
  entity_type  TEXT,
  entity_id    UUID,
  field_name   TEXT,
  storage_path TEXT,
  public_url   TEXT,
  size_bytes   INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Sync infrastructure
CREATE TABLE device_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES user_profiles(id),
  device_id    TEXT,
  platform     TEXT,  -- 'android' | 'ios'
  last_sync_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security

```sql
-- Users can only see their org's data
CREATE POLICY "org_isolation" ON audits
  USING (org_id = (
    SELECT org_id FROM user_profiles WHERE id = auth.uid()
  ));
-- Same policy applied to all tables
```

### Custom API endpoints (Supabase Edge Functions — Deno)

```
POST /api/sync/push      Receive batch of offline changes, apply, return server IDs
GET  /api/sync/pull      Return all changes since timestamp for this org
POST /api/files/upload   Accept multipart photo/PDF, store in Supabase Storage, return URL
POST /api/auth/login     Wrap Supabase auth, return JWT + refresh token
POST /api/auth/refresh   Refresh JWT using refresh token
POST /api/notify/audit-complete   Send email notification on audit completion
```

PostgREST handles all standard CRUD — custom Edge Functions only for sync, file handling, and notifications.

---

## Web Admin Portal: Next.js 15

Purpose:
- Manage organisations and users
- View all audits across an org
- Download PDF reports (for audits that synced)
- Share report links with clients (signed URL, no auth required for client)
- Monitor sync status per device
- Set org-level sync policies

Uses the same Supabase JS client as the mobile app. Server-side rendering via Next.js App Router for fast initial load.

---

## What Carries Over from the Base44 Web App

| Component | Status | Notes |
|---|---|---|
| Zod validation schemas | ✅ Direct copy | All 9 equipment form schemas |
| Form field structure | ✅ ~70% reuse | Port from React to React Native components |
| Data model design | ✅ Direct copy | Same 11 entities, add org_id + sync columns |
| Report section layout | ✅ Port to HTML templates | Rewrite from JSX+Tailwind to inline-style HTML |
| Equipment form logic | ✅ ~70% reuse | Same field names, validations, types |
| Auth flow concept | ✅ Same | Replace Base44 auth with Supabase auth |
| Photo upload concept | ✅ Same | Replace Base44 UploadFile with Supabase Storage |
| Email notifications | ✅ Same | Replace Base44 SendEmail with Edge Function + Resend |
| Navigation structure | ✅ Same screens | React Router → React Navigation |
| TailwindCSS UI | ❌ Replace | React Native has no DOM; use StyleSheet API or NativeWind |
| Base44 SDK | ❌ Discard | Replaced by Supabase client + custom sync engine |
| Base44 entities | ❌ Discard | Replaced by PostgreSQL + PostgREST |
| html2canvas + jsPDF | ❌ Discard | Replaced by expo-print HTML templates |

---

## Android First → iOS Minimal Rework

With React Native + Expo, this is the actual delta between platforms:

**Android build (Phase 1):**
- All feature development
- `AndroidManifest.xml`: camera, storage, internet, biometric permissions
- Back button handling (React Navigation handles this automatically)
- EAS Build: APK for testing, AAB for Play Store

**iOS delta (Phase 2 — estimated 2–3 weeks):**
- `Info.plist` privacy strings (required for App Store review):
  - `NSCameraUsageDescription`
  - `NSPhotoLibraryUsageDescription`
  - `NSFaceIDUsageDescription`
- Safe area handling already solved by `react-native-safe-area-context`
- expo-print behavior identical on iOS (WebKit) — no template changes
- EAS Build: IPA → TestFlight → App Store submission

Zero new feature code for iOS. Config files only.

---

## Build Order (Recommended)

```
Month 1
  ├── Supabase project setup (schema, RLS, auth config)
  ├── Core API endpoints (auth, sync push/pull, file upload)
  ├── Expo project scaffold + Drizzle SQLite schema + migrations
  └── Auth flow (login → token storage → biometric unlock → offline session)

Month 2
  ├── Audit + Zone CRUD (full offline, SQLite only)
  ├── All 9 equipment forms (port Zod schemas + React Hook Form)
  └── Camera capture + expo-file-system photo storage + compression pipeline

Month 3
  ├── PDF generation (expo-print HTML templates — port all 11 report sections)
  ├── PDF storage (local filesystem) + sharing (expo-sharing)
  └── Sync engine (push/pull/photo upload + sync_mode enforcement)

Month 4
  ├── sync_mode UI (auto/manual/offline_only) + org-level policy
  ├── Sync status indicators, conflict resolution UI
  ├── Play Store submission (Android)
  └── Polish: edge cases, error states, offline indicators

Month 5
  ├── iOS config (Info.plist, safe areas, TestFlight)
  └── App Store submission (iOS)

Ongoing
  └── Next.js admin portal
```

---

## Key Risks

| Risk | Severity | Mitigation |
|---|---|---|
| expo-print layout differences between iOS and Android | Medium | Test templates on both platforms early in Month 3 |
| Memory pressure with many base64 photos in PDF | Medium | Compress to 1200px/70% JPEG before embedding; test on low-end Android |
| Supabase self-hosting complexity for data-sovereignty clients | Medium | Docker Compose deployment guide; Supabase has good self-host docs |
| 30-day offline session limit | Low | Configurable; extend refresh token TTL if clients need longer |
| Play Store review timeline | Low | Budget 2–4 weeks for first submission review cycle |
