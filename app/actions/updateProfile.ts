'use server';

/**
 * Update Profile Server Action
 *
 * Updates user profile data including:
 * - Avatar URL
 * - Bio (max 200 characters)
 * - Location
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface UpdateProfileInput {
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
}

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

/**
 * Update a user's profile
 *
 * @param userId - The user ID to update
 * @param data - The profile data to update
 * @returns Result indicating success or failure
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const supabase = await createClient();

    // Verify the user is updating their own profile
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.id !== userId) {
      return { success: false, error: 'You can only update your own profile' };
    }

    // Validate bio length
    if (data.bio && data.bio.length > 200) {
      return { success: false, error: 'Bio must be 200 characters or less' };
    }

    // Update the profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { success: false, error: 'Failed to update profile' };
    }

    // Revalidate profile pages
    revalidatePath('/profile');
    revalidatePath(`/profile/${user.id}`);

    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a user's profile by ID
 *
 * @param userId - The user ID to fetch
 * @returns The user profile or null
 */
export async function getProfile(userId: string) {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

/**
 * Get a user's profile by username
 *
 * @param username - The username to fetch
 * @returns The user profile or null
 */
export async function getProfileByUsername(username: string) {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Get profile by username error:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Get profile by username error:', error);
    return null;
  }
}
