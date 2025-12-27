'use client';

/**
 * ProfileEditForm Component
 *
 * Form for editing user profile with:
 * - Avatar upload (with preview)
 * - Bio editor with 200 character limit and counter
 * - Location input
 * - Auto-save on blur (debounced)
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Camera01Icon, Location01Icon } from '@hugeicons/core-free-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadPhoto } from '@/app/actions/uploadPhoto';
import { updateProfile } from '@/app/actions/updateProfile';
import type { Tables } from '@/lib/supabase/database.types';

interface ProfileEditFormProps {
  profile: Tables<'users'>;
}

/** Max bio length */
const MAX_BIO_LENGTH = 200;
/** Max avatar file size: 2MB */
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('bucket', 'avatars');

      const result = await uploadPhoto(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }

      setAvatarUrl(result.url);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Handle bio change with character limit
   */
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO_LENGTH) {
      setBio(value);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateProfile(profile.id, {
        avatar_url: avatarUrl || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
      });

      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      toast({
        title: t('updateSuccess'),
        description: t('updateSuccessDescription'),
      });

      // Navigate back to profile
      router.push('/profile');
      router.refresh();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: t('updateFailed'),
        description: t('updateFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Get initials for avatar fallback
   */
  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl || undefined} alt={`${profile.username}'s avatar`} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {getInitials(profile.username)}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute bottom-0 right-0 bg-card border-2 border-border rounded-full p-2 shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
            aria-label={t('avatar.change')}
          >
            {isUploadingAvatar ? (
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <HugeiconsIcon icon={Camera01Icon} size={16} className="text-muted-foreground" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
          />
        </div>

        <p className="text-sm text-muted-foreground">{t('avatar.hint')}</p>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <Label htmlFor="bio">{t('bioLabel')}</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={handleBioChange}
          placeholder={t('bioPlaceholder')}
          className="min-h-24 resize-none"
          maxLength={MAX_BIO_LENGTH}
        />
        <p className="text-sm text-muted-foreground text-right">
          {t('characterCount', { current: bio.length, max: MAX_BIO_LENGTH })}
        </p>
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Label htmlFor="location">{t('locationLabel')}</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={Location01Icon}
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('locationPlaceholder')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSaving || isUploadingAvatar}>
          {isSaving ? t('saving') : t('saveChanges')}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/profile')}
          disabled={isSaving}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
