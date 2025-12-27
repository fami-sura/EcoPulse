'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, getSessionIdFromStorage } from '@/stores/authStore';
import { claimAnonymousReports } from '@/app/actions/claimAnonymousReports';

/**
 * AuthProvider Component
 *
 * Syncs Supabase auth state with Zustand store on initial load and auth changes.
 * Also handles claiming anonymous reports on OAuth/magic link sign-in.
 * This ensures the UI reflects the actual authentication state from Supabase cookies.
 *
 * Place this component high in the component tree (e.g., in LocaleLayout).
 */

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    setUser,
    setProfile,
    setLoading,
    logout: storeLogout,
    sessionId,
    setSessionId,
  } = useAuthStore();
  // Track if we've already claimed reports in this session to prevent duplicate claims
  const hasClaimedRef = useRef(false);

  /**
   * Attempt to claim anonymous reports for the authenticated user.
   * Called after OAuth or magic link sign-in via AuthProvider.
   */
  const tryClaimAnonymousReports = useCallback(
    async (userId: string) => {
      // Prevent duplicate claims
      if (hasClaimedRef.current) return;

      // Check for session ID in localStorage (may not be in Zustand store yet)
      const storedSessionId = getSessionIdFromStorage() || sessionId;
      if (!storedSessionId) return;

      try {
        hasClaimedRef.current = true;
        const result = await claimAnonymousReports(storedSessionId);

        if (result.success && result.claimedCount > 0) {
          console.log(
            `[AuthProvider] Claimed ${result.claimedCount} anonymous reports, awarded ${result.pointsAwarded} points`
          );
          // Clear session ID after successful claim
          setSessionId('');

          // Refresh user profile to get updated points
          const supabase = createClient();
          const { data: updatedProfile } = await supabase
            .from('users')
            .select('id, email, username, avatar_url, role, points')
            .eq('id', userId)
            .single();

          if (updatedProfile) {
            setProfile({
              id: updatedProfile.id,
              email: updatedProfile.email,
              username: updatedProfile.username,
              avatar_url: updatedProfile.avatar_url,
              role: updatedProfile.role,
              points: updatedProfile.points,
            });
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Error claiming anonymous reports:', error);
        // Reset flag to allow retry
        hasClaimedRef.current = false;
      }
    },
    [sessionId, setSessionId, setProfile]
  );

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

        // Attempt to claim anonymous reports (for OAuth and magic link logins)
        tryClaimAnonymousReports(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        storeLogout();
        // Reset claim flag on logout to allow claiming on next login
        hasClaimedRef.current = false;
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Session refreshed - update user in case of any changes
        setUser(session.user);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [syncAuthState, setUser, setProfile, storeLogout, tryClaimAnonymousReports]);

  return <>{children}</>;
}
