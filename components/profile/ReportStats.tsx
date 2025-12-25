'use client';

/**
 * Report Stats Component
 *
 * Displays verification statistics for user's reports:
 * - Total reports submitted
 * - Verified reports count
 * - Verification rate percentage
 * - Average verification time
 *
 * Story 2.1.9 - Verification Analytics for Reporters
 */

import {
  File02Icon,
  CheckmarkCircle02Icon,
  AnalyticsUpIcon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

interface ReportStatsProps {
  stats: {
    totalReports: number;
    verifiedReports: number;
    verificationRate: number;
    avgVerificationHours: number;
  };
}

export function ReportStats({ stats }: ReportStatsProps) {
  const t = useTranslations('profile');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={File02Icon}
        label={t('stats.totalReports')}
        value={stats.totalReports.toString()}
        color="blue"
      />

      <StatCard
        icon={CheckmarkCircle02Icon}
        label={t('stats.verified')}
        value={stats.verifiedReports.toString()}
        color="green"
      />

      <StatCard
        icon={AnalyticsUpIcon}
        label={t('stats.verificationRate')}
        value={`${stats.verificationRate}%`}
        color="purple"
      />

      <StatCard
        icon={Clock01Icon}
        label={t('stats.avgTime')}
        value={formatVerificationTime(stats.avgVerificationHours)}
        color="orange"
      />
    </div>
  );
}

interface StatCardProps {
  icon: typeof File02Icon;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-2`}>
        <HugeiconsIcon icon={icon} size={24} aria-hidden="true" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

/**
 * Format verification time in human-readable format
 */
function formatVerificationTime(hours: number): string {
  if (hours === 0) return '—';
  if (hours < 1) return '<1h';
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export default ReportStats;
