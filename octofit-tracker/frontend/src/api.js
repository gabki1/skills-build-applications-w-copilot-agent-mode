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
  const endpointKey = normalizedEndpoint.replace(/^api\//, '');

  if (localApiBaseUrl) {
    return `${localApiBaseUrl}/api/${endpointKey}/`;
  }

  if (endpointKey === 'users') {
    return import.meta.env.VITE_CODESPACE_NAME?.trim()
      ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/users/`
      : `${DEFAULT_API_BASE_URL}/api/users/`;
  }

  if (endpointKey === 'teams') {
    return import.meta.env.VITE_CODESPACE_NAME?.trim()
      ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/teams/`
      : `${DEFAULT_API_BASE_URL}/api/teams/`;
  }

  if (endpointKey === 'activities') {
    return import.meta.env.VITE_CODESPACE_NAME?.trim()
      ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/activities/`
      : `${DEFAULT_API_BASE_URL}/api/activities/`;
  }

  if (endpointKey === 'leaderboard') {
    return import.meta.env.VITE_CODESPACE_NAME?.trim()
      ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/leaderboard/`
      : `${DEFAULT_API_BASE_URL}/api/leaderboard/`;
  }

  if (endpointKey === 'workouts') {
    return import.meta.env.VITE_CODESPACE_NAME?.trim()
      ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/workouts/`
      : `${DEFAULT_API_BASE_URL}/api/workouts/`;
  }

  return `${DEFAULT_API_BASE_URL}/api/${endpointKey}/`;
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
