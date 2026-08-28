import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import { secrets } from 'base44:runtime';

const API_URL_SECRET = 'SUSTAINABILITY_WISE_API_URL';
const API_KEY_SECRET = 'SUSTAINABILITY_WISE_ECOAUDIT_API_KEY';
const REQUEST_TIMEOUT_MS = 12_000;
const AU_STATES = new Set(['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']);
const PROVIDERS = new Set(['geoapify', 'photon']);

type JsonObject = Record<string, unknown>;

class FunctionError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function objectValue(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.normalize('NFKC').trim().replace(/\s+/gu, ' ');
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function requiredText(value: unknown, field: string, maxLength: number): string {
  const cleaned = cleanText(value, maxLength);
  if (!cleaned) throw new FunctionError(400, `${field} is required`);
  return cleaned;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function validDateTime(value: unknown): string | undefined {
  const text = cleanText(value, 100);
  if (!text) return undefined;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function responseError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

function configuredApiUrl(rawValue: unknown): string {
  const value = cleanText(rawValue, 2_048);
  if (!value) {
    throw new FunctionError(503, 'Client and address memory is not configured');
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new FunctionError(503, 'Client and address memory is not configured');
  }
  if (
    url.protocol !== 'https:'
    || url.username
    || url.password
    || url.search
    || url.hash
    || (url.pathname !== '/' && url.pathname !== '')
  ) {
    throw new FunctionError(503, 'Client and address memory is not configured');
  }
  return url.origin;
}

function safeUpstreamDetail(value: unknown): string | null {
  const body = objectValue(value);
  const detail = cleanText(body.message ?? body.error, 300);
  return detail?.replace(/[\u0000-\u001f\u007f]/gu, ' ') ?? null;
}

async function callUnifiedApi(
  apiUrl: string,
  apiKey: string,
  path: string,
  init: RequestInit = {},
): Promise<JsonObject> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
      signal: controller.signal,
    });
    let body: unknown = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new FunctionError(502, 'Client and address memory authentication failed');
      }
      if ([400, 404, 409, 422].includes(response.status)) {
        throw new FunctionError(response.status, safeUpstreamDetail(body) || 'The client or address data was rejected');
      }
      if (response.status === 429) {
        throw new FunctionError(429, 'Address suggestions are temporarily rate limited');
      }
      throw new FunctionError(502, 'Client and address memory is temporarily unavailable');
    }
    return objectValue(body);
  } catch (error) {
    if (error instanceof FunctionError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FunctionError(504, 'Client and address memory timed out');
    }
    throw new FunctionError(502, 'Client and address memory is temporarily unavailable');
  } finally {
    clearTimeout(timer);
  }
}

function normalizedAddressEvidence(audit: JsonObject): {
  latitude: number | null;
  longitude: number | null;
  provider: string | null;
  placeId: string | null;
  source: 'suggested' | 'manual' | 'client_saved';
  geocodingStatus: 'unresolved' | 'resolved' | 'manual';
  selectedSiteId: string | null;
} {
  const rawLatitude = finiteNumber(audit.site_latitude);
  const rawLongitude = finiteNumber(audit.site_longitude);
  const coordinatesAreAustralian = rawLatitude !== null
    && rawLongitude !== null
    && rawLatitude >= -44
    && rawLatitude <= -9
    && rawLongitude >= 112
    && rawLongitude <= 154;
  const latitude = coordinatesAreAustralian ? rawLatitude : null;
  const longitude = coordinatesAreAustralian ? rawLongitude : null;
  const rawProvider = cleanText(audit.site_geocode_provider, 100);
  const rawPlaceId = cleanText(audit.site_geocode_place_id, 500);
  const provider = latitude !== null && rawProvider && PROVIDERS.has(rawProvider)
    ? rawProvider
    : null;
  const placeId = provider && rawPlaceId ? rawPlaceId : null;
  const selectedSiteId = cleanText(audit.unified_site_id, 200);
  const source = selectedSiteId && audit.site_address_source === 'client_saved'
    ? 'client_saved'
    : provider && placeId
      ? 'suggested'
      : 'manual';
  const geocodingStatus = provider && placeId
    ? 'resolved'
    : latitude !== null
      ? 'manual'
      : 'unresolved';
  return {
    latitude,
    longitude,
    provider,
    placeId,
    source,
    geocodingStatus,
    selectedSiteId: source === 'client_saved' ? selectedSiteId : null,
  };
}

function auditSyncPayload(audit: JsonObject): JsonObject {
  const evidence = normalizedAddressEvidence(audit);
  const clientName = requiredText(audit.client_name ?? audit.site_name, 'Client name', 300);
  const state = cleanText(audit.site_state, 3)?.toUpperCase() ?? null;
  const postcode = cleanText(audit.site_postcode, 4);
  if (state && !AU_STATES.has(state)) {
    throw new FunctionError(400, 'State must be an Australian state or territory abbreviation');
  }
  if (postcode && !/^\d{4}$/u.test(postcode)) {
    throw new FunctionError(400, 'Postcode must contain four digits');
  }

  return {
    id: requiredText(audit.id, 'Audit ID', 500),
    clientName,
    clientId: cleanText(audit.unified_client_id, 200),
    clientSiteId: evidence.selectedSiteId,
    siteName: requiredText(audit.site_name, 'Site name', 300),
    siteAddress: requiredText(audit.site_address, 'Site address', 1_000),
    siteLocality: cleanText(audit.site_locality, 200),
    siteState: state,
    sitePostcode: postcode,
    siteCountryCode: 'AU',
    siteLatitude: evidence.latitude,
    siteLongitude: evidence.longitude,
    siteGeocodeProvider: evidence.provider,
    siteGeocodePlaceId: evidence.placeId,
    siteAddressSource: evidence.source,
    siteGeocodeStatus: evidence.geocodingStatus,
    inspectorName: requiredText(audit.inspector_name, 'Inspector name', 300),
    auditDate: cleanText(audit.audit_date, 50),
    status: cleanText(audit.status, 50) || 'Draft',
    createdAt: validDateTime(audit.created_date),
    updatedAt: validDateTime(audit.updated_date),
  };
}

function canonicalAuditPatch(
  audit: JsonObject,
  syncPayload: JsonObject,
  syncResult: JsonObject,
  client: JsonObject,
  site: JsonObject,
): JsonObject {
  const selectedSavedSite = syncPayload.siteAddressSource === 'client_saved';
  const geocodingStatus = cleanText(site.geocodingStatus, 20) || 'unresolved';
  const isGeocoded = geocodingStatus === 'resolved' || geocodingStatus === 'manual';
  return {
    client_name: cleanText(syncResult.clientName ?? client.name, 300)
      || requiredText(syncPayload.clientName, 'Client name', 300),
    unified_client_id: requiredText(syncResult.clientId ?? client.id, 'Client ID', 200),
    unified_site_id: requiredText(syncResult.clientSiteId ?? site.id, 'Client site ID', 200),
    site_name: selectedSavedSite
      ? requiredText(site.siteName, 'Saved site name', 300)
      : requiredText(audit.site_name, 'Site name', 300),
    site_address: selectedSavedSite
      ? requiredText(site.displayAddress, 'Saved site address', 1_000)
      : requiredText(audit.site_address, 'Site address', 1_000),
    site_locality: cleanText(site.locality, 200),
    site_state: cleanText(site.state, 3),
    site_postcode: cleanText(site.postcode, 4),
    site_country_code: 'AU',
    site_latitude: finiteNumber(site.latitude),
    site_longitude: finiteNumber(site.longitude),
    site_geocode_provider: cleanText(site.provider, 100),
    site_geocode_place_id: cleanText(site.placeId, 500),
    site_address_source: selectedSavedSite ? 'client_saved' : syncPayload.siteAddressSource,
    site_geocode_status: geocodingStatus,
    site_address_fingerprint: requiredText(site.fingerprint, 'Address fingerprint', 64),
    site_geocoded_at: isGeocoded ? validDateTime(site.updatedAt) ?? null : null,
  };
}

async function readConfiguration(): Promise<{ apiUrl: string; apiKey: string }> {
  const [apiUrlValue, apiKeyValue] = await Promise.all([
    secrets.get(API_URL_SECRET),
    secrets.get(API_KEY_SECRET),
  ]);
  const apiKey = cleanText(apiKeyValue, 4_096);
  if (!apiKey) throw new FunctionError(503, 'Client and address memory is not configured');
  return { apiUrl: configuredApiUrl(apiUrlValue), apiKey };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return responseError(405, 'Method not allowed');
  }

  try {
    const base44 = createClientFromRequest(req);
    try {
      const user = await base44.auth.me();
      if (!user) return responseError(401, 'Authentication required');
    } catch {
      return responseError(401, 'Authentication required');
    }

    let body: JsonObject;
    try {
      body = objectValue(await req.json());
    } catch {
      throw new FunctionError(400, 'Request body must be valid JSON');
    }
    const action = requiredText(body.action, 'Action', 50);
    if (!['clients', 'addressSuggestions', 'syncAudit'].includes(action)) {
      throw new FunctionError(400, 'Unsupported action');
    }
    const { apiUrl, apiKey } = await readConfiguration();

    if (action === 'clients') {
      const query = cleanText(body.query, 300) ?? '';
      const requestedLimit = finiteNumber(body.limit);
      const limit = Math.min(200, Math.max(1, Math.trunc(requestedLimit ?? 8)));
      const params = new URLSearchParams({ q: query, limit: String(limit) });
      return Response.json(await callUnifiedApi(
        apiUrl,
        apiKey,
        `/v1/ecoaudit/client-directory?${params.toString()}`,
      ));
    }

    if (action === 'addressSuggestions') {
      const query = cleanText(body.query, 300) ?? '';
      const clientId = cleanText(body.clientId, 200);
      const postcode = cleanText(body.postcode, 4);
      if (postcode && !/^\d{4}$/u.test(postcode)) {
        throw new FunctionError(400, 'Postcode must contain four digits');
      }
      const requestedLimit = finiteNumber(body.limit);
      const limit = Math.min(10, Math.max(1, Math.trunc(requestedLimit ?? 8)));
      return Response.json(await callUnifiedApi(
        apiUrl,
        apiKey,
        '/v1/ecoaudit/client-address-suggestions',
        {
          method: 'POST',
          body: JSON.stringify({ clientId, query, postcode, limit }),
        },
      ));
    }

    const auditId = requiredText(body.auditId, 'Audit ID', 500);
    const records = await base44.entities.Audit.filter({ id: auditId });
    const audit = Array.isArray(records) ? objectValue(records[0]) : {};
    if (!audit.id) throw new FunctionError(404, 'Audit not found');

    const syncPayload = auditSyncPayload(audit);
    const syncResult = await callUnifiedApi(
      apiUrl,
      apiKey,
      '/v1/ecoaudit/sync/push',
      {
        method: 'POST',
        body: JSON.stringify({ audit: syncPayload }),
      },
    );
    const clientId = requiredText(syncResult.clientId, 'Synced client ID', 200);
    const clientSiteId = requiredText(syncResult.clientSiteId, 'Synced client site ID', 200);
    const directoryParams = new URLSearchParams({ clientId, limit: '1' });
    const directory = await callUnifiedApi(
      apiUrl,
      apiKey,
      `/v1/ecoaudit/client-directory?${directoryParams.toString()}`,
    );
    const clients = Array.isArray(directory.clients) ? directory.clients : [];
    const client = objectValue(clients[0]);
    const sites = Array.isArray(client.sites) ? client.sites : [];
    const site = objectValue(sites.find((candidate) => objectValue(candidate).id === clientSiteId));
    if (!client.id || !site.id) {
      throw new FunctionError(502, 'The synced client address could not be reloaded');
    }

    const patch = canonicalAuditPatch(audit, syncPayload, syncResult, client, site);
    await base44.entities.Audit.update(auditId, patch);
    return Response.json({
      synced: true,
      clientId,
      clientSiteId,
      versionNumber: syncResult.versionNumber ?? null,
      audit: patch,
    });
  } catch (error) {
    if (error instanceof FunctionError) {
      return responseError(error.status, error.message);
    }
    return responseError(500, 'Client and address memory failed unexpectedly');
  }
});
