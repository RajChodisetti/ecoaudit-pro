import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  applyAddressSuggestion,
  applyClientNameEdit,
  applyClientSelection,
  applyManualAddressField,
  applySiteNameEdit,
  beginNewAddress,
  normalizeLoadedAudit,
} from './clientAddressMemory.js';

test('legacy audits remain valid manual Australian addresses', () => {
  const audit = normalizeLoadedAudit({
    site_name: 'Sydney Office',
    site_address: '1 George Street, Sydney NSW 2000',
  });
  assert.equal(audit.client_name, 'Sydney Office');
  assert.equal(audit.site_country_code, 'AU');
  assert.equal(audit.site_address_source, 'manual');
  assert.equal(audit.site_geocode_status, 'unresolved');
});

test('selecting and editing a client preserves the address but clears saved-site binding', () => {
  const saved = {
    client_name: 'Old Client',
    unified_client_id: 'client-old',
    unified_site_id: 'site-old',
    site_address_source: 'client_saved',
    site_geocode_status: 'resolved',
    site_latitude: -33.86,
    site_longitude: 151.2,
    site_geocode_provider: 'geoapify',
    site_geocode_place_id: 'place-old',
  };
  const selected = applyClientSelection(saved, { id: 'client-new', name: 'New Client' });
  assert.equal(selected.unified_client_id, 'client-new');
  assert.equal(selected.unified_site_id, null);
  assert.equal(selected.site_address_source, 'suggested');

  const edited = applyClientNameEdit(selected, 'Another Client');
  assert.equal(edited.unified_client_id, null);
  assert.equal(edited.unified_site_id, null);
  assert.equal(edited.client_name, 'Another Client');
});

test('a saved address autofills editable site and full reusable address evidence', () => {
  const selected = applyAddressSuggestion({ site_name: 'Old' }, {
    kind: 'client_saved',
    clientId: 'client-1',
    clientSiteId: 'site-1',
    siteName: 'Melbourne Warehouse',
    label: '5 King Street, Melbourne VIC 3000',
    address: {
      displayAddress: '5 King Street, Melbourne VIC 3000',
      locality: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      latitude: -37.8136,
      longitude: 144.9631,
      provider: 'geoapify',
      placeId: 'place-5',
      geocodingStatus: 'resolved',
      fingerprint: 'a'.repeat(64),
    },
  });
  assert.equal(selected.site_name, 'Melbourne Warehouse');
  assert.equal(selected.unified_site_id, 'site-1');
  assert.equal(selected.site_address_source, 'client_saved');
  assert.equal(selected.site_state, 'VIC');
  assert.equal(selected.site_address_fingerprint, 'a'.repeat(64));
});

test('a provider suggestion fills coordinates without binding a saved site', () => {
  const selected = applyAddressSuggestion({ unified_client_id: 'client-1' }, {
    kind: 'provider',
    label: '10 Main Street, Brisbane QLD 4000',
    address: {
      displayAddress: '10 Main Street, Brisbane QLD 4000',
      locality: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      latitude: -27.4698,
      longitude: 153.0251,
      provider: 'geoapify',
      placeId: 'place-10',
      fingerprint: 'b'.repeat(64),
    },
  });
  assert.equal(selected.unified_client_id, 'client-1');
  assert.equal(selected.unified_site_id, null);
  assert.equal(selected.site_address_source, 'suggested');
  assert.equal(selected.site_geocode_status, 'resolved');
});

test('manual address edits clear stale coordinates and provider evidence', () => {
  const edited = applyManualAddressField({
    unified_client_id: 'client-1',
    unified_site_id: 'site-1',
    site_locality: 'Sydney',
    site_state: 'NSW',
    site_latitude: -33.86,
    site_longitude: 151.2,
    site_geocode_provider: 'geoapify',
    site_geocode_place_id: 'place-1',
    site_address_fingerprint: 'c'.repeat(64),
  }, 'site_address', '2 George Street, Sydney NSW 2000');
  assert.equal(edited.unified_client_id, 'client-1');
  assert.equal(edited.unified_site_id, null);
  assert.equal(edited.site_locality, 'Sydney');
  assert.equal(edited.site_latitude, null);
  assert.equal(edited.site_geocode_provider, null);
  assert.equal(edited.site_address_source, 'manual');
  assert.equal(edited.site_geocode_status, 'unresolved');
});

test('site edits are allowed and Add a new address resets only site details', () => {
  const edited = applySiteNameEdit({
    client_name: 'Acme',
    unified_client_id: 'client-1',
    unified_site_id: 'site-1',
    site_name: 'Old site',
    site_address_source: 'client_saved',
  }, 'Editable site');
  assert.equal(edited.site_name, 'Editable site');
  assert.equal(edited.unified_site_id, null);

  const fresh = beginNewAddress(edited);
  assert.equal(fresh.client_name, 'Acme');
  assert.equal(fresh.unified_client_id, 'client-1');
  assert.equal(fresh.site_name, '');
  assert.equal(fresh.site_address, '');
  assert.equal(fresh.site_country_code, 'AU');
});

test('Add a new address invalidates and clears delayed suggestion results', () => {
  const component = readFileSync(
    new URL('../components/ClientAddressFields.jsx', import.meta.url),
    'utf8',
  );
  assert.match(
    component,
    /const requestId = \+\+addressRequest\.current;\s+if \(!addressOpen\)/,
  );
  assert.match(
    component,
    /const useNewAddress = \(\) => \{\s+addressRequest\.current \+= 1;\s+setAddresses\(\[\]\);\s+setAttribution\(null\);\s+setAddressLoading\(false\);/,
  );
});
