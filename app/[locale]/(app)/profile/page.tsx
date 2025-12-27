/**
 * Own Profile Page
 *
 * Displays the authenticated user's own profile with:
 * - Avatar, username, bio, location, join date
 * - Edit profile button
 * - Profile stats (from ReportStats)
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileContent } from '@/components/profile/ProfileContent';

export async function generateMetadata() {
  const t = await getTranslations('profile');
  return {
    title: t('title'),
    description: t('viewProfile'),
  };
}

export default async function OwnProfilePage() {
  const t = await getTranslations('profile');
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login?redirect=/profile');
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('notFound')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t('profileError')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={true} />
      <ProfileContent profile={profile} isOwnProfile={true} />
    </div>
  );
}
