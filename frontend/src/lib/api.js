const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const configuredBackendUrl = trimTrailingSlash(
  process.env.REACT_APP_BACKEND_URL || window.location.origin
);

export const BACKEND_URL = configuredBackendUrl.endsWith('/api')
  ? configuredBackendUrl.slice(0, -4) || window.location.origin
  : configuredBackendUrl;

export const API_BASE = configuredBackendUrl.endsWith('/api')
  ? configuredBackendUrl
  : `${configuredBackendUrl}/api`;
