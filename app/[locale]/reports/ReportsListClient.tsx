'use client';

/**
 * ReportsListClient Component
 *
 * Client-side component for displaying user's reports.
 *
 * @features
 * - List of user's submitted reports
 * - Filter by status
 * - Empty state for no reports
 * - Login prompt for anonymous users
 * - Inline report form
 */

import { useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  DropletIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  Location01Icon,
  Camera01Icon,
  UserIcon,
  Add01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamically import ReportForm
const ReportForm = dynamic<{ onSuccess?: (reportId: string) => void; onCancel?: () => void }>(
  () => import('@/components/report/ReportForm').then((mod) => mod.ReportForm),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
      </div>
    ),
  }
);

interface Report {
  id: string;
  photos: string[] | null;
  lat: number;
  lng: number;
  address: string | null;
  category: 'waste' | 'drainage';
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'in_progress' | 'resolved';
  note: string | null;
  created_at: string;
  verification_count: number;
}

interface ReportsListClientProps {
  reports: Report[];
  isAuthenticated: boolean;
  translations: {
    title: string;
    publicTitle: string;
    totalReports: string;
    newReport: string;
    noReports: string;
    noReportsDescription: string;
    noFilteredReports: string;
    noFilteredReportsDescription: string;
    submitFirstReport: string;
    loginRequired: string;
    loginDescription: string;
    viewDetails: string;
  };
  navTranslations: {
    login: string;
  };
}

type StatusFilter = 'all' | 'pending' | 'verified' | 'in_progress' | 'resolved';

/**
 * Get category info
 */
function getCategoryInfo(category: Report['category']) {
  switch (category) {
    case 'waste':
      return { icon: Delete02Icon, label: 'Waste/Litter', color: 'text-amber-600 bg-amber-50' };
    case 'drainage':
      return { icon: DropletIcon, label: 'Drainage', color: 'text-blue-600 bg-blue-50' };
    default:
      return { icon: Delete02Icon, label: category, color: 'text-gray-600 bg-gray-50' };
  }
}

/**
 * Get status info
 */
function getStatusInfo(status: Report['status']) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-gray-100 text-gray-700', dotColor: 'bg-gray-400' };
    case 'verified':
      return { label: 'Verified', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' };
    case 'in_progress':
      return { label: 'In Progress', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' };
    case 'resolved':
      return {
        label: 'Resolved',
        color: 'bg-emerald-100 text-emerald-700',
        dotColor: 'bg-emerald-500',
      };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700', dotColor: 'bg-gray-400' };
  }
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ReportsListClient({
  reports,
  isAuthenticated,
  translations,
  navTranslations,
}: ReportsListClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showReportForm, setShowReportForm] = useState(false);

  const handleNewReport = useCallback(() => {
    setShowReportForm(true);
  }, []);

  const handleReportSuccess = useCallback(() => {
    // Close form after success animation completes and refresh the page
    setTimeout(() => {
      setShowReportForm(false);
      window.location.reload();
    }, 2000);
  }, []);

  const handleReportCancel = useCallback(() => {
    setShowReportForm(false);
  }, []);

  // Filter reports by status
  const filteredReports =
    statusFilter === 'all' ? reports : reports.filter((r) => r.status === statusFilter);

  // Count by status
  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    verified: reports.filter((r) => r.status === 'verified').length,
    in_progress: reports.filter((r) => r.status === 'in_progress').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  // Page title - "Reports" for anonymous, "My Reports" for authenticated
  const pageTitle = isAuthenticated ? translations.title : translations.publicTitle;

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mx-auto">
            <HugeiconsIcon icon={UserIcon} size={40} className="text-gray-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{translations.loginRequired}</h1>
          <p className="mb-6 text-gray-600">{translations.loginDescription}</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button className="w-full">{navTranslations.login}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500">{translations.totalReports}</p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleNewReport}>
          <HugeiconsIcon icon={Add01Icon} size={18} />
          {translations.newReport}
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'verified', 'in_progress', 'resolved'] as StatusFilter[]).map(
          (status) => {
            const isActive = statusFilter === status;
            const label =
              status === 'all' ? 'All' : getStatusInfo(status as Report['status']).label;
            const count = statusCounts[status];

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {label}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <HugeiconsIcon icon={Camera01Icon} size={32} className="text-gray-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            {statusFilter === 'all' ? translations.noReports : translations.noFilteredReports}
          </h2>
          <p className="mb-6 max-w-sm text-gray-500">
            {statusFilter === 'all'
              ? translations.noReportsDescription
              : translations.noFilteredReportsDescription}
          </p>
          {statusFilter === 'all' && (
            <Button className="gap-2" onClick={handleNewReport}>
              <HugeiconsIcon icon={Camera01Icon} size={18} />
              {translations.submitFirstReport}
            </Button>
          )}
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const categoryInfo = getCategoryInfo(report.category);
          const statusInfo = getStatusInfo(report.status);

          return (
            <Link
              key={report.id}
              href={`/issues/${report.id}`}
              className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-green-300 hover:shadow-md"
            >
              <div className="flex">
                {/* Photo Thumbnail */}
                <div className="relative h-32 w-32 shrink-0 bg-gray-100 sm:h-36 sm:w-36">
                  {report.photos && report.photos.length > 0 ? (
                    <Image
                      src={report.photos[0]}
                      alt="Report photo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <HugeiconsIcon icon={Camera01Icon} size={32} className="text-gray-300" />
                    </div>
                  )}
                  {report.photos && report.photos.length > 1 && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      +{report.photos.length - 1}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  {/* Top: Category & Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        categoryInfo.color
                      )}
                    >
                      <HugeiconsIcon icon={categoryInfo.icon} size={12} />
                      {categoryInfo.label}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        statusInfo.color
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', statusInfo.dotColor)} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Middle: Description */}
                  {report.note && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-700">{report.note}</p>
                  )}

                  {/* Bottom: Location & Time */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Location01Icon} size={12} />
                      {report.address
                        ? report.address.split(',').slice(0, 2).join(',')
                        : `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} size={12} />
                      {formatRelativeTime(report.created_at)}
                    </span>
                    {report.verification_count > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                        {report.verification_count} verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleReportCancel}
            aria-hidden="true"
          />
          {/* Modal container */}
          <div
            className="fixed inset-0 z-9999 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-form-title"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={handleReportCancel}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
                <h2 id="report-form-title" className="mb-4 text-xl font-bold text-gray-900">
                  Report an Issue
                </h2>
                <ReportForm onSuccess={handleReportSuccess} onCancel={handleReportCancel} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsListClient;
