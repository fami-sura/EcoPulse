/**
 * Edit Profile Page
 *
 * Allows authenticated users to edit their profile:
 * - Avatar upload with EXIF stripping
 * - Bio editor with 200 character limit
 * - Location input
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';

export async function generateMetadata() {
  const t = await getTranslations('profile');
  return {
    title: t('editProfile'),
    description: t('editProfileDescription'),
  };
}

export default async function ProfileEditPage() {
  const t = await getTranslations('profile');
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login?redirect=/profile/edit');
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/profile');
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('editProfile')}</h1>

      <ProfileEditForm profile={profile} />
    </div>
  );
}
