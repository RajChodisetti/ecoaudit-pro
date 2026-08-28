import { useEffect, useRef, useState } from 'react';
import { Building2, Loader2, MapPin, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  clientSiteMemoryError,
  findClientAddressSuggestions,
  findKnownClients,
} from '@/api/clientSiteMemory';
import {
  AU_STATES,
  applyAddressSuggestion,
  applyClientNameEdit,
  applyClientSelection,
  applyManualAddressField,
  applySiteNameEdit,
  beginNewAddress,
} from '@/lib/clientAddressMemory';

function SuggestionPanel({ children }) {
  return (
    <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-xl">
      {children}
    </div>
  );
}

export default function ClientAddressFields({ audit, onChange }) {
  const [clientOpen, setClientOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [attribution, setAttribution] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const clientRequest = useRef(0);
  const addressRequest = useRef(0);
  const addressInput = useRef(null);

  useEffect(() => {
    if (!clientOpen) return undefined;
    const requestId = ++clientRequest.current;
    const timer = window.setTimeout(async () => {
      setClientLoading(true);
      try {
        const result = await findKnownClients(audit.client_name || '');
        if (requestId === clientRequest.current) {
          setClients(result);
          setLookupError('');
        }
      } catch (error) {
        if (requestId === clientRequest.current) {
          setClients([]);
          setLookupError(clientSiteMemoryError(error, 'Client suggestions are unavailable. You can still enter a new client.'));
        }
      } finally {
        if (requestId === clientRequest.current) setClientLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [audit.client_name, clientOpen]);

  useEffect(() => {
    const requestId = ++addressRequest.current;
    if (!addressOpen) {
      setAddresses([]);
      setAttribution(null);
      setAddressLoading(false);
      return undefined;
    }
    const query = (audit.site_address || '').trim();
    if (!audit.unified_client_id && query.length < 3) {
      setAddresses([]);
      setAttribution(null);
      setAddressLoading(false);
      return undefined;
    }
    const timer = window.setTimeout(async () => {
      setAddressLoading(true);
      try {
        const result = await findClientAddressSuggestions({
          clientId: audit.unified_client_id,
          query,
          postcode: /^\d{4}$/.test(audit.site_postcode || '') ? audit.site_postcode : undefined,
        });
        if (requestId === addressRequest.current) {
          setAddresses(result.suggestions);
          setAttribution(result.attribution);
          setLookupError('');
        }
      } catch (error) {
        if (requestId === addressRequest.current) {
          setAddresses([]);
          setAttribution(null);
          setLookupError(clientSiteMemoryError(error, 'Address suggestions are unavailable. Manual addresses remain valid.'));
        }
      } finally {
        if (requestId === addressRequest.current) setAddressLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [
    addressOpen,
    audit.site_address,
    audit.site_postcode,
    audit.unified_client_id,
  ]);

  const selectClient = (client) => {
    onChange((current) => applyClientSelection(current, client));
    setClientOpen(false);
    setAddressOpen(true);
    window.requestAnimationFrame(() => addressInput.current?.focus());
  };

  const selectAddress = (suggestion) => {
    onChange((current) => applyAddressSuggestion(current, suggestion));
    setAddressOpen(false);
  };

  const useNewAddress = () => {
    addressRequest.current += 1;
    setAddresses([]);
    setAttribution(null);
    setAddressLoading(false);
    onChange((current) => beginNewAddress(current));
    setAddressOpen(false);
    window.requestAnimationFrame(() => addressInput.current?.focus());
  };

  const addressEvidence = audit.site_address_source === 'client_saved'
    ? 'Saved client address selected. Every field remains editable.'
    : audit.site_address_source === 'suggested'
      ? `${audit.site_geocode_provider === 'geoapify' ? 'Geoapify' : 'Provider'} address selected. Every field remains editable.`
      : 'Manual addresses are valid and will be marked for later geocoding.';

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Client Name *</label>
        <Input
          value={audit.client_name || ''}
          onChange={(event) => onChange((current) => applyClientNameEdit(current, event.target.value))}
          onFocus={() => setClientOpen(true)}
          onBlur={() => window.setTimeout(() => setClientOpen(false), 150)}
          placeholder="Start typing a known client or enter a new client"
          autoComplete="organization"
          role="combobox"
          aria-expanded={clientOpen}
          aria-controls="client-suggestions"
        />
        {clientOpen && (
          <SuggestionPanel>
            <div id="client-suggestions" role="listbox" aria-label="Known clients">
              {clientLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading known clients…
                </div>
              )}
              {!clientLoading && clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  role="option"
                  className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectClient(client)}
                >
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">{client.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {client.sites?.length || 0} saved {client.sites?.length === 1 ? 'address' : 'addresses'}
                    </span>
                  </span>
                </button>
              ))}
              {!clientLoading && clients.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No saved client matches. This name will create a new client when saved.
                </p>
              )}
            </div>
          </SuggestionPanel>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Site Name *</label>
        <Input
          value={audit.site_name || ''}
          onChange={(event) => onChange((current) => applySiteNameEdit(current, event.target.value))}
          placeholder="e.g. Warehouse, office or facility name"
        />
      </div>

      <div className="relative">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Site Address *</label>
        <Input
          ref={addressInput}
          value={audit.site_address || ''}
          onChange={(event) => onChange((current) => applyManualAddressField(current, 'site_address', event.target.value))}
          onFocus={() => setAddressOpen(true)}
          onBlur={() => window.setTimeout(() => setAddressOpen(false), 150)}
          placeholder="Type an Australian address"
          autoComplete="street-address"
          role="combobox"
          aria-expanded={addressOpen}
          aria-controls="address-suggestions"
        />
        {addressOpen && (
          <SuggestionPanel>
            <div id="address-suggestions" role="listbox" aria-label="Saved and provider address suggestions">
              {addressLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses…
                </div>
              )}
              {!addressLoading && addresses.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  role="option"
                  className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectAddress(suggestion)}
                >
                  {suggestion.kind === 'client_saved'
                    ? <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    : <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                  <span>
                    <span className="block text-sm font-medium text-foreground">{suggestion.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {suggestion.kind === 'client_saved'
                        ? `Saved address${suggestion.siteName ? ` · ${suggestion.siteName}` : ''}`
                        : 'Australian address provider'}
                    </span>
                  </span>
                </button>
              ))}
              {!addressLoading && addresses.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  {audit.unified_client_id
                    ? 'No matching saved or provider address. You can keep the manual address.'
                    : 'Select a known client to see saved addresses, or type at least 3 characters for provider suggestions.'}
                </p>
              )}
              {audit.unified_client_id && (
                <button
                  type="button"
                  className="mt-1 flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm font-medium text-primary hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={useNewAddress}
                >
                  <Plus className="h-4 w-4" /> Add a new address
                </button>
              )}
              {attribution && <p className="px-3 py-1 text-[11px] text-muted-foreground">{attribution}</p>}
            </div>
          </SuggestionPanel>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Suburb / Locality</label>
          <Input
            value={audit.site_locality || ''}
            onChange={(event) => onChange((current) => applyManualAddressField(current, 'site_locality', event.target.value))}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">State</label>
          <select
            value={audit.site_state || ''}
            onChange={(event) => onChange((current) => applyManualAddressField(current, 'site_state', event.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            autoComplete="address-level1"
          >
            <option value="">Select state</option>
            {AU_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Postcode</label>
          <Input
            value={audit.site_postcode || ''}
            onChange={(event) => onChange((current) => applyManualAddressField(current, 'site_postcode', event.target.value.replace(/\D/g, '').slice(0, 4)))}
            inputMode="numeric"
            maxLength={4}
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Australia (AU)</span> · {addressEvidence}
      </div>
      {lookupError && <p className="text-xs text-amber-700 dark:text-amber-300">{lookupError}</p>}
    </div>
  );
}
