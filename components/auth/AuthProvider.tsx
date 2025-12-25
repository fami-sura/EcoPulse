'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthProvider Component
 *
 * Syncs Supabase auth state with Zustand store on initial load and auth changes.
 * This ensures the UI reflects the actual authentication state from Supabase cookies.
 *
 * Place this component high in the component tree (e.g., in LocaleLayout).
 */

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setProfile, setLoading, logout } = useAuthStore();

  const syncAuthState = useCallback(async () => {
    const supabase = createClient();

    try {
      // Use getUser() instead of getSession() - it validates with the server
      // and is more reliable, especially after login/logout operations
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error);
        setLoading(false);
        return;
      }

      if (user) {
        // User is authenticated - update store
        setUser(user);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, username, avatar_url, role, points')
          .eq('id', user.id)
          .single();

        if (profile) {
          setProfile({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            role: profile.role,
            points: profile.points,
          });
        }
      } else {
        // No user - clear auth state but keep isLoading false
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error syncing auth state:', error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setProfile, setLoading]);

  useEffect(() => {
    // Sync auth state on mount
    syncAuthState();

    // Set up auth state change listener
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);

        // Fetch profile on sign in
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, username, avatar_url, role, points')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setProfile({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            role: profile.role,
            points: profile.points,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Session refreshed - update user in case of any changes
        setUser(session.user);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [syncAuthState, setUser, setProfile, logout]);

  return <>{children}</>;
}
