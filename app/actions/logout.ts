'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Logout Server Action
 *
 * Signs out the current user and clears their session.
 * Returns result so client can handle redirect after cleanup.
 */

interface LogoutResult {
  success: boolean;
  error?: string;
}

export async function logout(): Promise<LogoutResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
