'use client';

/**
 * ProfileContent Component
 *
 * Displays profile content below the header:
 * - Report statistics (when stats provided)
 * - Impact metrics placeholder (Story 2.2.2)
 * - Activity feed placeholder (Story 2.2.4)
 *
 * Story 2.2.1 - User Profile Page Foundation
 * Story 2.1.9 - Verification Analytics for Reporters
 */

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ReportStats } from './ReportStats';
import type { Tables } from '@/lib/supabase/database.types';

interface ProfileStats {
  totalReports: number;
  verifiedReports: number;
  verificationRate: number;
  avgVerificationHours: number;
}

interface ProfileContentProps {
  profile: Tables<'users'>;
  isOwnProfile: boolean;
  stats?: ProfileStats;
}

export function ProfileContent({ isOwnProfile, stats }: ProfileContentProps) {
  const t = useTranslations('profile');

  return (
    <div className="space-y-8">
      {/* Quick Links for Own Profile */}
      {isOwnProfile && (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/reports">{t('tabs.reports')}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/settings">{t('tabs.settings')}</Link>
          </Button>
        </div>
      )}

      {/* Report Statistics (Story 2.1.9) */}
      {stats && (
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            {t('stats.impactTitle')}
          </h2>
          <ReportStats stats={stats} />
        </section>
      )}

      {/* Placeholder: Impact Metrics (Story 2.2.2) */}
      <section
        className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6"
        aria-labelledby="impact-heading"
      >
        <h2 id="impact-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('stats.impactTitle')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('impact.comingSoon')}</p>
      </section>

      {/* Placeholder: Activity Feed (Story 2.2.4) */}
      <section
        className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6"
        aria-labelledby="activity-heading"
      >
        <h2 id="activity-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('activity.title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('activity.comingSoon')}</p>
      </section>
    </div>
  );
}

/**
 * Loading skeleton for ProfileContent
 */
export function ProfileContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse" />
            <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Impact skeleton */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
