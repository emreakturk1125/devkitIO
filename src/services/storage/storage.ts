// ─── Storage Service ──────────────────────────────────────────────────────
// Typed localStorage wrapper. Only for user preferences — NEVER for user data.

import type { UserPreferences } from '@/types/tool';

const STORAGE_PREFIX = 'devtoolbox_';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  favoriteToolIds: [],
  editorSettings: {
    tabSize: 2,
    wordWrap: true,
    fontSize: 14,
  },
};

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Read a value from localStorage.
 */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write a value to localStorage.
 */
export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/**
 * Remove a value from localStorage.
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(getKey(key));
  } catch {
    // Ignore
  }
}

/**
 * Load full user preferences with defaults.
 */
export function loadPreferences(): UserPreferences {
  return readStorage<UserPreferences>('preferences', DEFAULT_PREFERENCES);
}

/**
 * Save user preferences.
 */
export function savePreferences(prefs: UserPreferences): void {
  writeStorage('preferences', prefs);
}
