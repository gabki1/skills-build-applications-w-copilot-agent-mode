const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function getCollectionUrl(endpoint) {
  const normalizedEndpoint = endpoint?.replace(/^\/+/, '').replace(/\/+$/, '') || '';
  const endpointKey = normalizedEndpoint.replace(/^api\//, '');

  if (configuredApiBaseUrl) {
    return `${configuredApiBaseUrl.replace(/\/$/, '')}/api/${endpointKey}/`;
  }

  return `/api/${endpointKey}/`;
}

export function getApiUrl(path) {
  return getCollectionUrl(path);
}

export async function fetchCollection(endpoint) {
  const url = getCollectionUrl(endpoint);
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed with status ${response.status} for ${url}: ${text}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (payload?.data && Array.isArray(payload.data?.data)) {
    return payload.data.data;
  }

  if (payload?.data && Array.isArray(payload.data?.results)) {
    return payload.data.results;
  }

  if (payload?.data && Array.isArray(payload.data?.items)) {
    return payload.data.items;
  }

  return [];
}
