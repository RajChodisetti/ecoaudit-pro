export const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

export const EMPTY_ADDRESS_CONTRACT = Object.freeze({
  site_address: '',
  site_locality: '',
  site_state: '',
  site_postcode: '',
  site_country_code: 'AU',
  site_latitude: null,
  site_longitude: null,
  site_geocode_provider: null,
  site_geocode_place_id: null,
  site_address_source: 'manual',
  site_geocode_status: 'unresolved',
  site_address_fingerprint: null,
  site_geocoded_at: null,
});

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function hasProviderEvidence(audit) {
  return Number.isFinite(audit.site_latitude)
    && Number.isFinite(audit.site_longitude)
    && Boolean(cleanText(audit.site_geocode_provider))
    && Boolean(cleanText(audit.site_geocode_place_id));
}

function detachedAddressSource(audit) {
  return hasProviderEvidence(audit) ? 'suggested' : 'manual';
}

function detachedGeocodeStatus(audit) {
  if (hasProviderEvidence(audit)) return 'resolved';
  if (Number.isFinite(audit.site_latitude) && Number.isFinite(audit.site_longitude)) {
    return 'manual';
  }
  return 'unresolved';
}

export function normalizeLoadedAudit(audit) {
  const source = cleanText(audit.site_address_source) || 'manual';
  const status = cleanText(audit.site_geocode_status)
    || (hasProviderEvidence(audit) ? 'resolved' : 'unresolved');
  return {
    ...EMPTY_ADDRESS_CONTRACT,
    ...audit,
    client_name: cleanText(audit.client_name) || cleanText(audit.site_name),
    unified_client_id: cleanText(audit.unified_client_id) || null,
    unified_site_id: cleanText(audit.unified_site_id) || null,
    site_country_code: 'AU',
    site_address_source: source,
    site_geocode_status: status,
  };
}

export function applyClientNameEdit(audit, clientName) {
  const next = {
    ...audit,
    client_name: clientName,
    unified_client_id: null,
    unified_site_id: null,
  };
  if (audit.site_address_source === 'client_saved') {
    next.site_address_source = detachedAddressSource(audit);
    next.site_geocode_status = detachedGeocodeStatus(audit);
  }
  return next;
}

export function applyClientSelection(audit, client) {
  const next = {
    ...audit,
    client_name: cleanText(client?.name),
    unified_client_id: cleanText(client?.id) || null,
    unified_site_id: null,
  };
  if (audit.site_address_source === 'client_saved') {
    next.site_address_source = detachedAddressSource(audit);
    next.site_geocode_status = detachedGeocodeStatus(audit);
  }
  return next;
}

export function beginNewAddress(audit) {
  return {
    ...audit,
    ...EMPTY_ADDRESS_CONTRACT,
    site_name: '',
    unified_site_id: null,
  };
}

export function applySiteNameEdit(audit, siteName) {
  const next = {
    ...audit,
    site_name: siteName,
    unified_site_id: null,
  };
  if (audit.site_address_source === 'client_saved') {
    next.site_address_source = detachedAddressSource(audit);
    next.site_geocode_status = detachedGeocodeStatus(audit);
  }
  return next;
}

export function applyManualAddressField(audit, field, value) {
  return {
    ...audit,
    [field]: value,
    unified_site_id: null,
    site_country_code: 'AU',
    site_latitude: null,
    site_longitude: null,
    site_geocode_provider: null,
    site_geocode_place_id: null,
    site_address_source: 'manual',
    site_geocode_status: 'unresolved',
    site_address_fingerprint: null,
    site_geocoded_at: null,
  };
}

export function applyAddressSuggestion(audit, suggestion) {
  const address = suggestion?.address ?? {};
  const isSaved = suggestion?.kind === 'client_saved';
  return {
    ...audit,
    site_name: isSaved && cleanText(suggestion.siteName)
      ? cleanText(suggestion.siteName)
      : audit.site_name,
    unified_client_id: isSaved
      ? cleanText(suggestion.clientId) || audit.unified_client_id || null
      : audit.unified_client_id || null,
    unified_site_id: isSaved ? cleanText(suggestion.clientSiteId) || null : null,
    site_address: cleanText(address.displayAddress) || cleanText(suggestion?.label),
    site_locality: cleanText(address.locality),
    site_state: cleanText(address.state),
    site_postcode: cleanText(address.postcode),
    site_country_code: 'AU',
    site_latitude: Number.isFinite(address.latitude) ? address.latitude : null,
    site_longitude: Number.isFinite(address.longitude) ? address.longitude : null,
    site_geocode_provider: cleanText(address.provider) || null,
    site_geocode_place_id: cleanText(address.placeId) || null,
    site_address_source: isSaved ? 'client_saved' : 'suggested',
    site_geocode_status: cleanText(address.geocodingStatus)
      || (Number.isFinite(address.latitude) && Number.isFinite(address.longitude)
        ? 'resolved'
        : 'unresolved'),
    site_address_fingerprint: cleanText(address.fingerprint) || null,
    site_geocoded_at: null,
  };
}

export function mergeCanonicalSync(audit, canonical) {
  if (!canonical || typeof canonical !== 'object') return audit;
  return normalizeLoadedAudit({ ...audit, ...canonical });
}
