# EcoAudit Pro — Why We Need to Rebuild & What We're Building

---

## Problems With the Current App (Base44 Prototype)

| # | Problem | Plain English |
|---|---|---|
| 1 | **No API access** | Other software (CRMs, ERPs, reporting tools) cannot connect to or read data from this app. It's a closed box. |
| 2 | **Locked to one vendor** | The entire app — database, files, login — lives on Base44's servers. If they raise prices, get acquired, or shut down, everything goes with them. |
| 3 | **You don't own your data** | All audit data and photos are stored in Base44's database. You have no direct access, no backup, and no way to export it independently. |
| 4 | **Cannot be hosted on your servers** | You cannot move this app to AWS, Azure, or any preferred hosting. The backend is 100% controlled by Base44. |
| 5 | **Cannot scale freely** | Storage limits, speed, and capacity are all decided by Base44. You cannot add more resources when the business grows. |
| 6 | **No mobile app** | The current app is a website only. It cannot be installed on an Android device as a proper app. |
| 7 | **No offline use** | If there is no internet on site, the app is completely unusable. Every single action requires a live connection. |
| 8 | **No client separation** | All users see all data. You cannot give Client A access to only their audits while keeping Client B's data private. |
| 9 | **Cannot integrate with anything** | No way to connect to Xero, Salesforce, Power BI, email platforms, or any other tool. |
| 10 | **Only one environment** | Any changes made during development happen directly on the live production app — risky for real client data. |
| 11 | **No white-labelling** | Cannot brand or resell this platform to other auditing firms. The login and backend belong to Base44. |
| 12 | **No automated testing** | No safety net when releasing updates. Changes are manually tested against live data. |

---

## What We Are Building

### The New Ecosystem — Two Components

---

### 1. Two Android Mobile Applications
**What they do:**
- Full field workflow on a phone or tablet — works completely **offline**, no internet required on site
- **App 1 — Energy Audit:** Capture all 9 equipment types (HVAC, lighting, switchboards, solar, forklifts, hot water, water and electricity Q&A), zone management, photos, and professional PDF reports
- **App 2 — Solar Assessment:** Dedicated solar site assessment workflow — capture system details, roof space, switchboard suitability, cable routing, photos, and generate a standalone solar assessment PDF report
- Photos saved at **full original resolution** in an organised folder structure — plug the phone into a computer and browse photos by audit → zone → equipment
- PDF report generated directly on the device — no internet needed
- All data stored securely on the device

**Delivery:**
- APK file for direct installation on Android devices
- Google Play Store submission attempted as best effort — not guaranteed

---

### 2. API Server + Web Admin Portal *(Future Phase — Advisory)*
**What it does:**
- Your data lives on **your server** — you own it completely
- Secure industry-standard database (PostgreSQL) — exportable, queryable, backed up
- REST API any software can connect to (CRMs, reporting tools, third-party apps)
- Web portal to manage users, view and download synced reports, share report links with clients
- Role-based access: Admin, Inspector, Viewer
- Optional sync button in the mobile apps — connect when this phase is ready
- Can be **self-hosted** on your own infrastructure or a cloud provider of your choice

---

## Photo Storage — Folder / Tree Structure

Photos are organised exactly like a file repository — easy to browse on a computer when the phone is connected via USB:

```
EcoAudit/
  └── {Site Name} — {Date}/
        ├── Zone — Warehouse/
        │     ├── zone_photos/
        │     │     ├── zone_photo_001.jpg
        │     │     └── zone_photo_002.jpg
        │     ├── hvac — AHU-01/
        │     │     ├── main.jpg
        │     │     ├── nameplate.jpg
        │     │     ├── controller.jpg
        │     │     └── extra_001.jpg
        │     ├── lighting — LED Highbay/
        │     │     ├── main.jpg
        │     │     ├── fixtures.jpg
        │     │     └── sensors.jpg
        │     └── main_switchboard — MSB-01/
        │           ├── main.jpg
        │           └── extra_001.jpg
        └── Zone — Rooftop/
              └── solar_pv — 30kW System/
                    ├── roof.jpg
                    ├── inverter_label.jpg
                    └── meter.jpg
```

All photos stored at **original full resolution** — no compression, no quality loss.

---

## At a Glance

| | Current App (Base44) | New Apps |
|---|---|---|
| **Works offline** | No | Yes — fully |
| **Android mobile app** | No | Yes — APK delivery |
| **PDF on device** | No | Yes — no internet needed |
| **Two specialised apps** | No | Yes — Energy Audit + Solar Assessment |
| **You own the data** | No | Yes — stored on device |
| **Full-res photos** | No | Yes — original quality, folder structure |
| **Easy photo transfer** | No | Yes — USB, browse by folder |
| **API for integrations** | No | Yes — future phase |
| **Client data separation** | No | Yes — future phase |
| **Sync option** | No | Yes — future phase, optional |
| **Vendor dependency** | High (Base44) | None |
