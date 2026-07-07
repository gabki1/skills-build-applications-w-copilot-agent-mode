const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return DEFAULT_API_BASE_URL;
}

function getLocalApiBaseUrl() {
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    return null;
  }

  return DEFAULT_API_BASE_URL;
}

function getCollectionUrl(endpoint) {
  const normalizedEndpoint = endpoint?.replace(/^\/+/, '').replace(/\/+$/, '') || '';
  const localApiBaseUrl = getLocalApiBaseUrl();
  const apiBaseUrl = localApiBaseUrl || getApiBaseUrl();
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const endpointKey = normalizedEndpoint.replace(/^api\//, '');

  if (endpointKey === 'users') {
    return codespaceName && !localApiBaseUrl
      ? `https://${codespaceName}-8000.app.github.dev/api/users/`
      : `${apiBaseUrl}/api/users/`;
  }

  if (endpointKey === 'teams') {
    return codespaceName && !localApiBaseUrl
      ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
      : `${apiBaseUrl}/api/teams/`;
  }

  if (endpointKey === 'activities') {
    return codespaceName && !localApiBaseUrl
      ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
      : `${apiBaseUrl}/api/activities/`;
  }

  if (endpointKey === 'leaderboard') {
    return codespaceName && !localApiBaseUrl
      ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
      : `${apiBaseUrl}/api/leaderboard/`;
  }

  if (endpointKey === 'workouts') {
    return codespaceName && !localApiBaseUrl
      ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
      : `${apiBaseUrl}/api/workouts/`;
  }

  return `${apiBaseUrl}/api/${endpointKey}/`;
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
