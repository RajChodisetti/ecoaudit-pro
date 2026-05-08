# EcoAudit Pro — Application Overview

**Product Name:** Sustainability Wise  
**Internal Name:** EcoAudit Pro  
**Type:** Energy audit management web application  
**Target Users:** Energy auditors / inspectors for Australian commercial sites  
**Primary Purpose:** Capture on-site energy audit data (equipment, photos, observations) and generate professional PDF reports for clients

---

## What the App Does

EcoAudit Pro is a mobile-first web application that guides energy auditors through a structured audit workflow:

1. **Create an Audit** — Record site name, address, inspector name, and date
2. **Define Zones** — Divide the site into logical areas (e.g., warehouse, office, rooftop)
3. **Capture Equipment** — Within each zone, log 9 types of energy equipment with photos and technical specs
4. **Review Data** — See audit data organized by zone or equipment type
5. **Manage Photos** — Include/exclude specific photos from the final report
6. **Generate PDF** — Produce a professional, branded PDF report for the client

---

## Workflow Diagram

```
Dashboard
  └─ Create / Select Audit
       └─ SiteAudit (site metadata + zones)
            └─ ZoneWorkspace (equipment capture per zone)
                 └─ AuditReport (internal review)
                      └─ PhotoPreview (photo selection + live preview)
                           └─ ClientReport (PDF generation + download)
```

---

## Pages & Features

### Dashboard (`/`)
- List of all audits with search/filter
- Create new audit
- Delete audit with confirmation
- Sort by creation date (newest first)

### Site Audit (`/audit/:id`)
- Create or edit audit metadata (site name, address, inspector, date)
- Manage zones: add, delete, view
- Mark audit as "Completed" (triggers email notification to internal team)

### Zone Workspace (`/audit/:auditId/zone/:zoneId`)
- Edit zone name, description, and zone-level photos
- Add / edit / delete equipment items across 9 categories:
  1. Main Switchboard
  2. Additional Switchboard
  3. HVAC Unit
  4. Lighting System
  5. Solar PV
  6. Forklift Charger
  7. Hot Water System
  8. General Water (Q&A format)
  9. General Electricity (Q&A format)
- Each equipment type captures detailed technical fields + multiple photos

### Audit Report (`/audit/:auditId/report`)
- Internal review screen
- Toggle between "By Zone" and "By Equipment Type" views
- Quick links to Photo Preview and Client Report

### Photo Preview (`/audit/:auditId/photo-preview`)
- View all photos grouped by equipment item
- Include/exclude individual photos from PDF
- Download all photos as ZIP (organized by zone)
- Live preview of report with exclusions applied

### Client Report (`/audit/:auditId/client-report`)
- Full-featured PDF report generation
- Edit executive summary and consolidated observations
- Select which sections/equipment items to include
- Download PDF with professional branding (A4, Montserrat font, dark blue + green palette)
- Page-break optimization so cards/tables don't split across pages

### Settings (`/settings`)
- View user profile (name, email)
- Toggle Light / Dark / System theme
- Log out
- Delete account (requires typing "DELETE"; sends email to admin)

---

## Data Model (9 Equipment Entities + 2 Core Entities)

All data lives in the Base44 cloud database. Every entity carries `zone_id` and `audit_id` foreign keys.

| Entity | Key Fields |
|---|---|
| **Audit** | site_name, site_address, inspector_name, audit_date, status (Draft/Completed) |
| **Zone** | audit_id, zone_name, zone_description, photos[] |
| **MainSwitchboard** | name, location, map_locator, site_nmi, sub_circuits_description, photo, extra_photos[] |
| **AdditionalSwitchboard** | name, location, type (MSSB/PVDB/DSB-W/DSB-S), sub_circuits_description, photo, extra_photos[] |
| **HVACUnit** | unit_name, make, model, serial_number, heating_capacity_kw, cooling_capacity_kw, power_supply_phase, controller_type, indoor_unit_model, photo, extra_photos[] |
| **LightingSystem** | light_type, brand_model, rated_wattage, quantity, controls_type, operating_hours, mounting_height, photo, extra_photos[] |
| **SolarPV** | system_size_kw, inverter_brand_model, available_roof_space, suitable_switchboard, cable_distance, photo, extra_photos[] |
| **ForkliftCharger** | charger_type, brand_model, rating, power_supply, quantity, local_isolator, scheduling_opportunity, photo, extra_photos[] |
| **HotWaterSystem** | dhw_details_type, size_liters, fuel_type, pipe_insulation, tempering_valve, photo, extra_photos[] |
| **GeneralWater** | question, answer, photos[] |
| **GeneralElectricity** | question, answer, photos[] |

---

## PDF Report Sections

The generated PDF contains up to 10 content sections (only shown if data exists):

1. Executive Summary (editable text)
2. Electrical Infrastructure (Main + Additional Switchboards)
3. HVAC Systems
4. Lighting Systems
5. Solar PV Infrastructure
6. Forklift Charging Operations
7. Hot Water Systems
8. General Water Systems
9. General Electricity Systems
10. Consolidated Observations (editable text)

PDF characteristics:
- A4 portrait, 1.8cm margins
- Header: dark blue (#162A4E) with Sustainability Wise logo
- Footer: page numbers + confidentiality notice
- Font: Montserrat (Google Fonts)
- Colour accent: green (#79B44A)
- Resolution: 2x canvas scale → JPEG 1.0 quality

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18, Vite 6 |
| Routing | React Router v6 |
| Styling | TailwindCSS 3, Radix UI |
| Animations | Framer Motion |
| State (server) | TanStack React Query 5 |
| State (auth) | React Context |
| Forms | React Hook Form + Zod |
| PDF generation | jsPDF + html2canvas |
| Image archive | JSZip |
| Charts | Recharts |
| Maps | React Leaflet |
| Backend / DB | Base44 SDK (BaaS) |
| Serverless functions | Deno (TypeScript) |
| Auth | Base44 built-in |
| File uploads | Base44 Core integration |
| Email | Base44 Core.SendEmail |
| Payments | Stripe (wired, not yet active) |

---

## Authentication

- Base44 token-based auth; token stored in `localStorage`
- All routes protected; non-authenticated users redirected to login
- Two error states: `auth_required` (no token), `user_not_registered` (whitelist miss)
- Logout clears token via SDK; delete-account flow emails admin and auto-logs out

---

## Email Notifications

Two automated emails exist:
1. **Audit Completed** — Sent to `service@sustainabilitywise.com.au` when audit status → Completed. Contains full equipment counts summary.
2. **Account Deletion** — Sent to support when user requests account deletion.

---

## Offline Capability (Current State)

**Not implemented.** The only concession to connectivity is a `PullToRefresh` component that triggers a manual refetch. All reads/writes require an active internet connection to the Base44 cloud.
