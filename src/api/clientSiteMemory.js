import { base44 } from '@/api/base44Client';

const FUNCTION_NAME = 'ecoAuditClientSiteMemory';

async function invoke(action, payload = {}) {
  const response = await base44.functions.invoke(FUNCTION_NAME, { action, ...payload });
  return response.data;
}

export async function findKnownClients(query) {
  const result = await invoke('clients', { query, limit: 8 });
  return Array.isArray(result?.clients) ? result.clients : [];
}

export async function findClientAddressSuggestions(input) {
  const result = await invoke('addressSuggestions', {
    clientId: input.clientId || undefined,
    query: input.query,
    postcode: input.postcode || undefined,
    limit: 8,
  });
  return {
    suggestions: Array.isArray(result?.suggestions) ? result.suggestions : [],
    attribution: typeof result?.attribution === 'string' ? result.attribution : null,
    available: Boolean(result?.available),
  };
}

export async function syncAuditClientSiteMemory(auditId) {
  return invoke('syncAudit', { auditId });
}

export function clientSiteMemoryError(error, fallback) {
  const detail = error?.response?.data?.error;
  return typeof detail === 'string' && detail.trim() ? detail : fallback;
}
