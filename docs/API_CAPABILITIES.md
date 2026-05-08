# API Capabilities — Current State & Gap Analysis

## Does the App Have an API?

**Short answer: No public API exists.**

The app communicates exclusively through the **Base44 SDK**, which is a proprietary BaaS (Backend-as-a-Service) client library. There is no REST, GraphQL, or WebSocket API exposed to external consumers. All data access requires:
1. A valid Base44 access token (user-authenticated)
2. The Base44 SDK (JavaScript only)

This means:
- **A third-party system cannot fetch generated reports** without being authenticated as a Base44 user with SDK access.
- **A mobile app cannot POST a PDF** to any existing datastore endpoint.
- **Audit data is not queryable** from outside the app unless someone builds a new API layer.

---

## What the Base44 SDK Provides (Internal Access Only)

```js
// Entity CRUD (all require auth token)
base44.entities.Audit.list(sortBy?)
base44.entities.Audit.filter({ audit_id: "..." })
base44.entities.Audit.create(data)
base44.entities.Audit.update(id, data)
base44.entities.Audit.delete(id)

// Same pattern for all 9 equipment entities + Zone

// File upload (returns URL)
base44.integrations.Core.UploadFile({ file: File })

// Email
base44.integrations.Core.SendEmail({ to, subject, body, from_name })

// Auth
base44.auth.me()
base44.auth.logout()
```

This is a JavaScript SDK — it wraps HTTP calls to Base44's proprietary cloud infrastructure. The underlying HTTP endpoints are not documented or intended for direct use.

---

## Serverless Functions (Only One Exists)

| Function | Trigger | Payload | Action |
|---|---|---|---|
| `sendAuditCompletedEmail` | Audit status → Completed | `{ audit_id }` | Queries all equipment entities, sends summary email to internal team |

This is a Deno function deployed to Base44's serverless infrastructure. It is not exposed as a public HTTP endpoint — it runs on an internal event or can be called via Base44's function invocation mechanism (requires auth).

---

## Gap Analysis: What's Missing for External/Mobile Access

### Use Case 1 — Mobile App Reads Existing Reports
**Gap:** No REST endpoint to fetch audit data or generated PDF  
**Needed:** An API layer that accepts a bearer token, queries Base44 entities, and returns structured JSON

### Use Case 2 — External System POSTs a PDF to Storage
**Gap:** No file ingestion endpoint; Base44 `UploadFile` only works from within authenticated SDK sessions  
**Needed:** A file upload endpoint that accepts multipart/form-data and stores the file in a durable location (S3/GCS/Base44 file service), returning a URL

### Use Case 3 — Mobile App Syncs Data Offline → Online
**Gap:** No sync protocol exists  
**Needed:** A conflict-resolution strategy and an API that accepts batched writes with timestamps

### Use Case 4 — Third-Party Integration (e.g., ERP, CRM)
**Gap:** No webhook or event stream  
**Needed:** Webhook on audit completion, or a polling endpoint

---

## Recommended API Surface (To Be Built)

If a separate API layer is added (e.g., a Next.js API route layer, Express, or Deno HTTP server on Base44), the minimum viable endpoints are:

### Authentication
```
POST /api/auth/token          Body: { email, password } → { access_token }
POST /api/auth/refresh        Body: { refresh_token }   → { access_token }
```

### Audits
```
GET    /api/audits                    List all audits for current user
GET    /api/audits/:id                Get single audit with all zones + equipment
POST   /api/audits                    Create audit
PATCH  /api/audits/:id                Update audit fields
DELETE /api/audits/:id                Delete audit + cascade

GET    /api/audits/:id/report         Get report as structured JSON
GET    /api/audits/:id/report/pdf     Generate + return PDF (binary stream)
POST   /api/audits/:id/report/pdf     Upload a pre-generated PDF → store + return URL
```

### Zones & Equipment
```
GET    /api/audits/:id/zones                List zones
POST   /api/audits/:id/zones                Create zone
PATCH  /api/audits/:id/zones/:zoneId        Update zone
DELETE /api/audits/:id/zones/:zoneId        Delete zone

GET    /api/audits/:id/zones/:zoneId/equipment      List all equipment in zone
POST   /api/audits/:id/zones/:zoneId/:equipType     Create equipment item
PATCH  /api/audits/:id/zones/:zoneId/:equipType/:itemId  Update
DELETE /api/audits/:id/zones/:zoneId/:equipType/:itemId  Delete
```

### File Upload
```
POST   /api/files/upload      multipart/form-data → { url: "https://..." }
```

### Sync (for offline mobile)
```
POST   /api/sync              Body: { changes: [...], last_sync_at: ISO8601 }
                              Response: { server_changes: [...], conflicts: [...] }
```

---

## Current PDF Generation — Can It Be Exposed?

PDF generation today is **100% client-side**:
- `ClientReport.jsx` renders a React component tree
- `html2canvas` converts DOM nodes to canvas images
- `jsPDF` assembles pages from canvas slices

This cannot be called from a server or external system without a headless browser. To expose PDF generation as an API:

**Option A — Puppeteer/Playwright endpoint**
- Spin up a headless Chromium, navigate to `/audit/:id/client-report`, trigger the download, capture the file
- Pros: Exact visual parity with current PDF
- Cons: Heavy compute, needs auth token injection

**Option B — Server-side PDF library**
- Reimplement report layout in `PDFKit`, `pdfmake`, or `WeasyPrint`
- Pros: Lightweight, fully server-side, API-friendly
- Cons: Must duplicate all report templates; layout parity work

**Option C — Stored PDF after client generation**
- After client generates PDF, upload it to file storage via API
- Store URL on the Audit entity (`report_pdf_url` field)
- External systems then `GET /api/audits/:id/report/pdf` to retrieve stored file
- Pros: Zero server-side PDF generation complexity
- Cons: PDF only available after a user generates it; not on-demand

**Recommendation for mobile app:** Option C is lowest effort. The mobile app generates the PDF locally (or the web app generates it first), uploads it, and the URL is available to anyone with access to the audit.
