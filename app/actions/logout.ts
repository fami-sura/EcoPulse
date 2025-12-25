'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Logout Server Action
 *
 * Signs out the current user and clears their session.
 * Redirects to the home page after logout.
 */
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }

  redirect('/');
}
