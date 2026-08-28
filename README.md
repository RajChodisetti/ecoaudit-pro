# EcoAudit Pro

EcoAudit Pro is an offline-first mobile app for commercial energy audits. Field auditors capture equipment data, photos, and observations on-site, then generate professional PDF reports for clients.

## Apps

| Component | Description |
|-----------|-------------|
| **Mobile (Android)** | React Native / Expo app — offline-first, local SQLite database |
| **Web** | React web dashboard — audit management and reporting |
| **API Server** | Shared Fastify API at [sustainability-wise-api](https://github.com/RajChodisetti/sustainability-wise-api) |

## Mobile workspace

`mobile/` is a separate pinned Git repository. Verify its recorded and checked-out revisions, then
follow that repository's current instructions and lockfile. Native/device commands, environment
configuration, dependency installation, signing, and EAS builds require explicit scope; the older
Node 18 and generic build recipe formerly shown here is not authoritative.

## Web — Quick Start

Use Node `22.23.1` from `.nvmrc` and the committed npm lockfile.

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Create `.env.local`:
```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-backend-url
```

```bash
npm run dev
```

## Features

- Create and manage energy audits with zones and 9 equipment categories
- Capture photos and technical specs for each piece of equipment
- Offline-first — works without network, syncs when connected
- Import server audits as versioned local copies (cp1, cp2, …)
- Generate branded PDF reports on-device or via API server
- Cloud backup for photos via DigitalOcean Spaces

## Documentation

- [App Overview](docs/APP_OVERVIEW.md) — workflows and user guide
- [Data Models](docs/DATA_MODELS.md) — database schema and field reference
- [API Capabilities](docs/API_CAPABILITIES.md) — API integration reference
- [Mobile Architecture](docs/MOBILE_ARCHITECTURE.md) — offline-first design and tech stack

## Version

**1.0.0** (build 95)
