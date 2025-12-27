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
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-primary/10 text-primary',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-2`}>
        <HugeiconsIcon icon={icon} size={24} aria-hidden="true" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
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
