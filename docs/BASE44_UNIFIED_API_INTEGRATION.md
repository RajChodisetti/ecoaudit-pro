# Base44 client and address memory integration

EcoAudit Pro keeps its Base44 `Audit` record as the web application's local
source while projecting client, site and job metadata into the Sustainability
Wise unified API. The projection gives the web app the same normalized client
directory and reusable Australian address memory as the mobile products.

## User flow

1. Typing a client name invokes `clients` and shows known company clients.
2. Selecting a known client keeps the client link and opens its saved addresses.
3. Typing in the address input invokes `addressSuggestions`. The same result
   list contains saved client addresses first and provider suggestions after
   them.
4. Selecting either result fills the site/address fields. Every populated field
   remains editable; the app does not add `v1`, `v2` or another site suffix.
5. `Add a new address` clears the site/address fields without clearing the
   selected client.
6. A manual address is valid. Editing any address field clears stale provider,
   coordinate, fingerprint and saved-site evidence and marks the address for
   later geocoding.

The browser calls `base44.functions.invoke('ecoAuditClientSiteMemory', data)`
and reads the function JSON from the returned Axios response's `.data` field.
It never calls the unified API directly.

## Trust boundary

`base44/functions/ecoAuditClientSiteMemory/entry.ts` is the only bridge. It:

- authenticates the calling Base44 user with `base44.auth.me()`;
- reads `Audit` records and applies canonical patches with the caller-scoped
  Base44 client, not `asServiceRole`;
- reads the unified API URL and credential from Base44 server secrets;
- accepts only HTTPS API origins without embedded credentials, query strings or
  fragments;
- uses a bounded outbound timeout and returns sanitized errors; and
- never returns, logs or places the API credential in a browser bundle.

The function exposes three actions:

| Function action | Unified API request | Purpose |
|---|---|---|
| `clients` | `GET /v1/ecoaudit/client-directory` | Search known clients and saved sites |
| `addressSuggestions` | `POST /v1/ecoaudit/client-address-suggestions` | Mix saved and Australian provider suggestions |
| `syncAudit` | `POST /v1/ecoaudit/sync/push`, then directory reload | Transactionally upsert client/site/job memory and write canonical IDs/address evidence back to Base44 |

The API token must be scoped to the exact `ecoaudit` app and have at least the
`inspector` role. A broader portal token or client-side key is not an acceptable
substitute.

## Australian address contract

The additive `Audit` fields preserve the display address, locality, state,
postcode, constant `AU` country code, coordinates, provider and place ID,
address source, geocoding status and opaque 64-hex address fingerprint. The
`unified_client_id` and `unified_site_id` fields keep canonical directory links.
Legacy Audit records remain valid because the new fields are optional; when
loaded, `client_name` falls back to the existing site name and the address is
treated as manual/unresolved.

Selecting a suggestion stores the evidence returned by the API. Subsequent
manual edits deliberately detach the saved-site link and clear the old geocode
evidence. This prevents coordinates for one address from being reused after its
display or structured fields change.

## Save and retry semantics

Create, Save Changes and Complete first persist the Base44 Audit. They then
invoke `syncAudit`. The unified API performs client normalization, client/site
upsert, product-record linking and job projection in its own database
transaction. Sending only the top-level audit does not delete zones or equipment
already stored by the unified API.

If the projection fails, the successful Base44 write is retained and the UI
shows a warning. The next Save Changes or Complete retries the idempotent sync.
The UI must not report the Base44 save itself as failed in that case.

## Deployment prerequisites

Base44 server secrets (values are never committed):

- `SUSTAINABILITY_WISE_API_URL`: HTTPS origin of the intended unified API
  environment, without `/v1`.
- `SUSTAINABILITY_WISE_ECOAUDIT_API_KEY`: exact-app EcoAudit API credential with
  `inspector` or higher API role.

Unified API QA configuration:

- deploy the release containing the EcoAudit client-directory,
  client-address-suggestion and sync routes plus their client/site migrations;
- configure `GEOAPIFY_API_KEY` on the API server to enable Geoapify results;
- retain the approved Photon fallback if Geoapify is unavailable; and
- verify the configured public API URL is reachable from Base44 functions.

Publishing the Vite bundle alone is insufficient. The Base44 `Audit` entity
schema and `ecoAuditClientSiteMemory` function must be published in the same
Base44 environment before the new UI is exercised. After publishing, verify an
authenticated create, manual-address save, saved-address selection, provider
selection, edit-after-selection, retry after a simulated upstream failure, and
completion projection.
