/**
 * Public Profile Page
 *
 * Displays any user's public profile with:
 * - Avatar, username, bio, location, join date
 * - Edit button (only if viewing own profile)
 * - Profile stats
 * - Private profile handling (404 if private and not owner)
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileContent } from '@/components/profile/ProfileContent';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const t = await getTranslations('profile');

  return {
    title: `@${username} - ${t('title')}`,
    description: t('publicProfile', { username }),
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Get current user (might be null if not logged in)
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // Fetch the profile by username
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  // Profile not found
  if (profileError || !profile) {
    notFound();
  }

  // Check if this is the user's own profile
  const isOwnProfile = currentUser?.id === profile.id;

  // If profile is private and viewer is not the owner, show 404
  if (!profile.profile_public && !isOwnProfile) {
    notFound();
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileContent profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
