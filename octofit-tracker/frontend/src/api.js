const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return DEFAULT_API_BASE_URL;
}

function getCollectionUrl(endpoint) {
  const normalizedEndpoint = endpoint?.replace(/^\/+/, '').replace(/\/+$/, '') || '';
  const apiBaseUrl = getApiBaseUrl();
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const endpointKey = normalizedEndpoint.replace(/^api\//, '');

  if (endpointKey === 'users') {
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/users/`
      : `${DEFAULT_API_BASE_URL}/api/users/`;
  }

  if (endpointKey === 'teams') {
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
      : `${DEFAULT_API_BASE_URL}/api/teams/`;
  }

  if (endpointKey === 'activities') {
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
      : `${DEFAULT_API_BASE_URL}/api/activities/`;
  }

  if (endpointKey === 'leaderboard') {
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
      : `${DEFAULT_API_BASE_URL}/api/leaderboard/`;
  }

  if (endpointKey === 'workouts') {
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
      : `${DEFAULT_API_BASE_URL}/api/workouts/`;
  }

  return `${apiBaseUrl}/api/${endpointKey}/`;
}

export function getApiUrl(path) {
  return getCollectionUrl(path);
}

export async function fetchCollection(endpoint) {
  const response = await fetch(getCollectionUrl(endpoint), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
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
