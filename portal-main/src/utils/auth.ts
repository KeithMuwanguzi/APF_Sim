/**
 * Authentication utilities
 * Now uses authStorage.ts for consistent session management
 */

import { isAuthenticated as checkAuth, getUser, getAccessToken as getToken, clearAuth as clearAuthStorage } from './authStorage';

export interface User {
  id: number;
  email: string;
  role: string;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return checkAuth();
}

/**
 * Get current user data
 */
export function getCurrentUser(): User | null {
  return getUser();
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  return user.role === '1';
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return getToken();
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  clearAuthStorage();
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

/**
 * Redirect to login if not admin
 */
export function requireAdmin(): boolean {
  if (!isAuthenticated() || !isAdmin()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}