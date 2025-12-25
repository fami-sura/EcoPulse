'use client';

/**
 * ProfileHeader Component
 *
 * Displays the user profile header with:
 * - Avatar (with upload capability on own profile)
 * - Username
 * - Bio
 * - Location
 * - Join date
 * - Edit Profile button (own profile only)
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { useState, useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PencilEdit01Icon,
  Camera01Icon,
  Location01Icon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadPhoto } from '@/app/actions/uploadPhoto';
import { updateProfile } from '@/app/actions/updateProfile';
import type { Tables } from '@/lib/supabase/database.types';

interface ProfileHeaderProps {
  profile: Tables<'users'>;
  isOwnProfile: boolean;
}

/** Max avatar file size: 2MB */
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const t = useTranslations('profile');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  /**
   * Handle avatar file selection and upload
   */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > MAX_AVATAR_SIZE) {
      toast({
        title: t('avatar.tooLarge'),
        description: t('avatar.maxSize'),
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('bucket', 'avatars');

      // Upload the photo (EXIF stripping happens in uploadPhoto)
      const uploadResult = await uploadPhoto(formData);

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Update user profile with new avatar URL
      const updateResult = await updateProfile(profile.id, {
        avatar_url: uploadResult.url,
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Update failed');
      }

      // Update local state
      setAvatarUrl(uploadResult.url);

      toast({
        title: t('avatar.updated'),
        description: t('avatar.updatedDescription'),
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: t('avatar.uploadFailed'),
        description: t('avatar.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Trigger file input click
   */
  const handleAvatarClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get initials for avatar fallback
  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
  };

  // Format join date
  const joinDate = format(new Date(profile.created_at), 'MMMM yyyy');

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
      {/* Avatar with upload capability */}
      <div className="relative">
        <Avatar className="w-28 h-28 md:w-32 md:h-32 cursor-pointer" onClick={handleAvatarClick}>
          <AvatarImage src={avatarUrl || undefined} alt={`${profile.username}'s avatar`} />
          <AvatarFallback className="text-3xl bg-green-100 text-green-700">
            {getInitials(profile.username)}
          </AvatarFallback>
        </Avatar>

        {/* Camera overlay for own profile */}
        {isOwnProfile && (
          <>
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label={t('avatar.change')}
            >
              {isUploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HugeiconsIcon
                  icon={Camera01Icon}
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              )}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
              aria-label={t('avatar.upload')}
            />
          </>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            {/* Username */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              @{profile.username || t('anonymous')}
            </h1>

            {/* Join date */}
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={16}
                className="text-gray-500"
                aria-hidden="true"
              />
              {t('memberSince', { date: joinDate })}
            </p>

            {/* Location */}
            {profile.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={16}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                {profile.location}
              </p>
            )}
          </div>

          {/* Edit Profile Button (own profile only) */}
          {isOwnProfile && (
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href="/profile/edit">
                <HugeiconsIcon
                  icon={PencilEdit01Icon}
                  size={16}
                  className="mr-2"
                  aria-hidden="true"
                />
                {t('edit')}
              </Link>
            </Button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
        )}

        {/* Empty bio message for own profile */}
        {isOwnProfile && !profile.bio && (
          <p className="mt-4 text-gray-500 dark:text-gray-400 italic">{t('noBio')}</p>
        )}
      </div>
    </div>
  );
}
