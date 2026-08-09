const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "user";

export function getAuthToken(): string | null {
  return window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser<T>(): T | null {
  try {
    const value = window.sessionStorage.getItem(AUTH_USER_KEY);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function storeAuthSession(token: string, user: unknown): void {
  // Remove credentials left by versions that persisted authentication.
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  window.sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function clearLegacyAuthStorage(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}
