/**
 * Auth Storage Helper
 * Manages authentication state using sessionStorage with expiry
 */

interface AuthData {
  access_token: string;
  refresh_token: string;
  user: any;
  expiresAt: number; // Unix timestamp
}

const AUTH_KEY = 'auth_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

/**
 * Save authentication data to sessionStorage with expiry
 */
export const saveAuth = (accessToken: string, refreshToken: string, user: any): void => {
  const expiresAt = Date.now() + SESSION_DURATION;
  const authData: AuthData = {
    access_token: accessToken,
    refresh_token: refreshToken,
    user,
    expiresAt,
  };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

/**
 * Get authentication data from sessionStorage
 * Returns null if expired or not found
 */
export const getAuth = (): AuthData | null => {
  try {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (!stored) return null;

    const authData: AuthData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > authData.expiresAt) {
      clearAuth();
      return null;
    }

    return authData;
  } catch (error) {
    console.error('Failed to parse auth data:', error);
    clearAuth();
    return null;
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  const auth = getAuth();
  if (!auth) {
    console.log('[Auth] No auth data found');
    return null;
  }
  if (!auth.access_token) {
    console.log('[Auth] Auth data exists but no access_token');
    return null;
  }
  return auth.access_token;
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  const auth = getAuth();
  return auth?.refresh_token || null;
};

/**
 * Get user data
 */
export const getUser = (): any | null => {
  const auth = getAuth();
  return auth?.user || null;
};

/**
 * Check if user is authenticated and session is valid
 */
export const isAuthenticated = (): boolean => {
  return getAuth() !== null;
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  sessionStorage.removeItem(AUTH_KEY);
  // Also clear any legacy localStorage items
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_profile');
};

/**
 * Update tokens (for refresh token flow)
 */
export const updateTokens = (accessToken: string, refreshToken: string): void => {
  const auth = getAuth();
  if (auth) {
    auth.access_token = accessToken;
    auth.refresh_token = refreshToken;
    // Extend expiry on token refresh
    auth.expiresAt = Date.now() + SESSION_DURATION;
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }
};

/**
 * Migrate from localStorage to sessionStorage (one-time migration helper)
 * Call this on app initialization
 */
export const migrateFromLocalStorage = (): void => {
  // Check if already using sessionStorage
  const existingSession = sessionStorage.getItem(AUTH_KEY);
  if (existingSession) {
    console.log('[Auth] Session already exists in sessionStorage');
    return;
  }

  // Try to migrate from localStorage
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userStr = localStorage.getItem('user');

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      saveAuth(accessToken, refreshToken, user);
      
      // Clear old localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');
      
      console.log('[Auth] Migrated from localStorage to sessionStorage');
    } catch (error) {
      console.error('[Auth] Failed to migrate:', error);
    }
  } else {
    console.log('[Auth] No localStorage auth to migrate');
  }
};
