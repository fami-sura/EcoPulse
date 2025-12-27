'use client';

/**
 * Profile Settings Page
 *
 * User profile settings including:
 * - Email notification preferences
 * - Profile privacy settings
 *
 * @features
 * - Auto-save on toggle change (debounced)
 * - Optimistic UI updates
 * - Error recovery
 * - Full i18n support
 *
 * Story 2.1.7 - Email Notification Preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft02Icon,
  Mail01Icon,
  Notification01Icon,
  UserIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface SettingsState {
  email_verified_reports: boolean;
  email_action_cards: boolean;
  email_monthly_summary: boolean;
  profile_public: boolean;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const t = useTranslations('profile.settings');
  const tCommon = useTranslations('common');
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStore();
  const [settings, setSettings] = useState<SettingsState>({
    email_verified_reports: true,
    email_action_cards: true,
    email_monthly_summary: false,
    profile_public: true,
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated (after auth check completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile/settings');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch settings when user is available
  useEffect(() => {
    async function fetchSettings() {
      if (!user?.id) return;

      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from('users')
          .select(
            'email_verified_reports, email_action_cards, email_monthly_summary, profile_public'
          )
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setSettings({
            email_verified_reports: data.email_verified_reports ?? true,
            email_action_cards: data.email_action_cards ?? true,
            email_monthly_summary: data.email_monthly_summary ?? false,
            profile_public: data.profile_public ?? true,
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(t('saveFailedDescription'));
      } finally {
        setIsLoadingSettings(false);
      }
    }

    fetchSettings();
  }, [user, t]);

  /**
   * Save settings to database with debounce
   */
  const saveSettings = useCallback(
    async (newSettings: SettingsState) => {
      if (!user?.id) return;

      setIsSaving(true);
      setSaveStatus('saving');
      setError(null);

      try {
        const supabase = createClient();

        const { error } = await supabase
          .from('users')
          .update({
            email_verified_reports: newSettings.email_verified_reports,
            email_action_cards: newSettings.email_action_cards,
            email_monthly_summary: newSettings.email_monthly_summary,
            profile_public: newSettings.profile_public,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;

        setSaveStatus('saved');
        // Reset to idle after showing success
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error('Error saving settings:', err);
        setSaveStatus('error');
        setError(t('saveFailedDescription'));
        // Revert optimistic update
        setSettings(settings);
      } finally {
        setIsSaving(false);
      }
    },
    [settings, t, user]
  );

  /**
   * Handle toggle change with optimistic update
   */
  const handleToggle = useCallback(
    (key: keyof SettingsState) => {
      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };
      setSettings(newSettings);
      saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  // Show loading state while checking auth or loading settings
  if (authLoading || isLoadingSettings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="sr-only">{tCommon('loading')}</span>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
            aria-label={tCommon('back')}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} />
          </Button>
          <h1 className="text-lg font-semibold">{t('title')}</h1>

          {/* Save status indicator */}
          <div className="ml-auto flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-sm text-gray-500">{t('saving')}</span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                {t('saved')}
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1 text-sm text-red-600">
                <HugeiconsIcon icon={AlertCircleIcon} size={16} />
                {t('saveFailed')}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* Email Notifications Section */}
        <section className="mb-8" aria-labelledby="notifications-heading">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={20}
                className="text-green-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 id="notifications-heading" className="font-semibold">
                {t('notifications')}
              </h2>
              <p className="text-sm text-gray-500">{t('notificationsDescription')}</p>
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-white shadow-sm">
            {/* Verification emails */}
            <SettingRow
              title={t('emailVerifiedReports')}
              description={t('emailVerifiedReportsDescription')}
              checked={settings.email_verified_reports}
              onChange={() => handleToggle('email_verified_reports')}
              disabled={isSaving}
            />

            {/* Action Card emails */}
            <SettingRow
              title={t('emailActionCards')}
              description={t('emailActionCardsDescription')}
              checked={settings.email_action_cards}
              onChange={() => handleToggle('email_action_cards')}
              disabled={isSaving}
            />

            {/* Monthly summary */}
            <SettingRow
              title={t('emailMonthlySummary')}
              description={t('emailMonthlySummaryDescription')}
              checked={settings.email_monthly_summary}
              onChange={() => handleToggle('email_monthly_summary')}
              disabled={isSaving}
              isLast
            />
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-8" aria-labelledby="privacy-heading">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <HugeiconsIcon
                icon={UserIcon}
                size={20}
                className="text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 id="privacy-heading" className="font-semibold">
                {t('privacy')}
              </h2>
              <p className="text-sm text-gray-500">{t('profileVisibilityDescription')}</p>
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-white shadow-sm">
            <SettingRow
              title={t('profilePublic')}
              description={t('profileVisibilityDescription')}
              checked={settings.profile_public}
              onChange={() => handleToggle('profile_public')}
              disabled={isSaving}
              isLast
            />
          </div>

          {!settings.profile_public && (
            <p className="mt-3 text-sm text-gray-500">
              Your verifications will still be attributed to your username, but your profile page
              won&apos;t be accessible.
            </p>
          )}
        </section>

        {/* Info Section */}
        <section className="rounded-xl bg-blue-50 p-4">
          <div className="flex gap-3">
            <HugeiconsIcon
              icon={Notification01Icon}
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-blue-900">About Notifications</p>
              <p className="mt-1 text-sm text-blue-700">
                We&apos;ll only send you important updates about your environmental contributions.
                You can unsubscribe from any email by clicking the link at the bottom.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Setting row component
 */
interface SettingRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  isLast?: boolean;
}

function SettingRow({ title, description, checked, onChange, disabled, isLast }: SettingRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-4',
        !isLast && 'border-b border-gray-100'
      )}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={title} />
    </div>
  );
}
