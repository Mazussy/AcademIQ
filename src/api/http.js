const BASE_URL = 'http://studentmanagemane.runasp.net';

export const TOKEN_STORAGE_KEY = 'authToken';

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

async function request(method, path, body, options = {}) {
  const { useBearer = false, _retry = false, skipAuth = false } = options;
  const token = skipAuth ? null : getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    // Default per user: raw token; optionally retry with Bearer on 401
    headers['Authorization'] = useBearer ? `Bearer ${token}` : token;
  }

  const debug = typeof localStorage !== 'undefined' && localStorage.getItem('apiDebug') === '1';
  if (debug) {
    // Do not log the token, only whether it's present and if Bearer is used
    // eslint-disable-next-line no-console
    console.debug('[api] request', { method, path, hasToken: !!token, useBearer });
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug('[api] response', { method, path, status: res.status });
  }

  // If unauthorized with a token, retry once with Bearer prefix
  if (res.status === 401 && token && !useBearer && !_retry && !skipAuth) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug('[api] 401 received; retrying with Bearer prefix');
    }
    return request(method, path, body, { useBearer: true, _retry: true });
  }

  // Handle 204 No Content or empty body safely
  const contentLength = res.headers.get('content-length');
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || contentLength === '0' || (!contentType && res.status >= 200 && res.status < 300)) {
    if (!res.ok) {
      const error = new Error('API Error');
      error.status = res.status;
      error.data = null;
      throw error;
    }
    return null;
  }

  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const error = new Error('API Error');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const http = {
  get: (path, options) => request('GET', path, undefined, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  del: (path, options) => request('DELETE', path, undefined, options),
};
