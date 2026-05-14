import { AUTH_TOKEN_KEY, clearAuthToken, getAuthToken, setAuthToken } from './auth';

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('migrates legacy token key to AUTH_TOKEN_KEY', () => {
    localStorage.setItem('token', 'legacy-token');

    expect(getAuthToken()).toBe('legacy-token');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('legacy-token');
  });

  test('setAuthToken stores primary token and clears legacy keys', () => {
    localStorage.setItem('token', 'old');
    localStorage.setItem('auth_token', 'old2');

    setAuthToken('new-token');

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('new-token');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  test('clearAuthToken clears primary and legacy keys', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'x');
    localStorage.setItem('token', 'y');
    localStorage.setItem('auth_token', 'z');

    clearAuthToken();

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
