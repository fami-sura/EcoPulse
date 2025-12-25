/**
 * Auth Store - Zustand
 *
 * Manages authentication state:
 * - Current user
 * - User role
 * - Session status
 * - Anonymous session ID (for tracking reports before signup)
 *
 * Session ID storage follows Story 2.2.1 requirements:
 * - Stored in localStorage with key 'session_id'
 * - 7-day expiry for anonymous sessions
 * - UUID format (crypto.randomUUID or fallback)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '@/lib/supabase/database.types';
import type { User } from '@supabase/supabase-js';

type UserRole = Database['public']['Enums']['user_role'];

// Session expiry: 7 days in milliseconds
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// localStorage key for direct session_id access (per Story 2.2.1)
const SESSION_ID_KEY = 'session_id';
const SESSION_EXPIRY_KEY = 'session_id_expiry';

interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  points: number;
}

interface AuthState {
  // Auth state
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Anonymous session tracking
  sessionId: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  clearSession: () => void;
  logout: () => void;
}

/**
 * Generate a unique session ID for anonymous users (UUID format)
 */
function generateSessionId(): string {
  // Use crypto.randomUUID if available, fallback to manual UUID generation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if session is expired (7-day expiry per Story 2.2.1)
 */
function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;
  const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
}

/**
 * Get session ID directly from localStorage
 * This provides direct access for server actions per Story 2.2.1
 */
export function getSessionIdFromStorage(): string | null {
  if (typeof window === 'undefined') return null;

  // Check expiry first
  if (isSessionExpired()) {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    return null;
  }

  return localStorage.getItem(SESSION_ID_KEY);
}

/**
 * Set session ID directly to localStorage with expiry
 */
function setSessionIdToStorage(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_EXPIRY_MS));
}

/**
 * Clear session ID from localStorage
 */
function clearSessionIdFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      sessionId: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      setSessionId: (sessionId) => {
        // Also store directly in localStorage for direct access
        setSessionIdToStorage(sessionId);
        set({ sessionId });
      },

      clearSession: () => {
        clearSessionIdFromStorage();
        set({ sessionId: null });
      },

      logout: () => {
        // Clear session on logout to prevent stale anonymous sessions
        clearSessionIdFromStorage();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          sessionId: null,
        });
      },
    }),
    {
      name: 'ecopulse-auth-store',
      partialize: (state) => ({
        // Persist session ID for anonymous report tracking
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Check for existing valid session in localStorage
        const existingSession = getSessionIdFromStorage();

        if (existingSession) {
          // Use existing valid session
          state.setSessionId(existingSession);
        } else if (!state.sessionId || isSessionExpired()) {
          // Generate new session if none exists or expired
          const newSessionId = generateSessionId();
          state.setSessionId(newSessionId);
        }
      },
    }
  )
);

// Hook to get or create session ID
export function useSessionId(): string {
  const { sessionId, setSessionId } = useAuthStore();

  // Check localStorage first for SSR consistency
  const storedSession = getSessionIdFromStorage();
  if (storedSession && storedSession !== sessionId) {
    setSessionId(storedSession);
    return storedSession;
  }

  if (!sessionId) {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    return newSessionId;
  }

  return sessionId;
}
