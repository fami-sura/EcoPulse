'use client';

/**
 * My Reports List Component
 *
 * Displays user's submitted reports with:
 * - Sort options (recent, verified, pending)
 * - Filter options (all, pending, verified, resolved)
 * - Pagination (20 per page)
 * - Verification status badges
 * - Verifier usernames
 *
 * Story 2.1.9 - Verification Analytics for Reporters
 */

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import {
  File02Icon,
  CheckmarkCircle02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FilterIcon,
  SortingAZIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/routing';

interface Verifier {
  username: string | null;
  avatar_url: string | null;
}

interface Report {
  id: string;
  category: string;
  severity: string | null;
  status: string;
  verification_count: number;
  created_at: string;
  address: string | null;
  photos: string[] | null;
  verifications: Array<{
    verifier: Verifier | Verifier[] | null;
  }>;
}

interface MyReportsListProps {
  reports: Report[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentSort: string;
  currentFilter: string;
}

export function MyReportsList({
  reports,
  totalCount,
  currentPage,
  pageSize,
  currentSort,
  currentFilter,
}: MyReportsListProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    // Reset to page 1 when changing sort or filter
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`/profile/reports?${params.toString()}`);
  };

  // Empty state
  if (reports.length === 0 && currentFilter === 'all') {
    return (
      <div className="text-center py-12">
        <HugeiconsIcon
          icon={File02Icon}
          size={64}
          className="mx-auto text-muted-foreground/50 mb-4"
          aria-hidden="true"
        />
        <h3 className="text-lg font-semibold mb-2 text-foreground">{t('reports.emptyTitle')}</h3>
        <p className="text-muted-foreground mb-4">{t('reports.emptyDescription')}</p>
        <Button asChild>
          <Link href="/">{t('reports.reportIssue')}</Link>
        </Button>
      </div>
    );
  }

  // No results for filter
  if (reports.length === 0) {
    return (
      <div className="space-y-6">
        <FilterSortControls
          currentSort={currentSort}
          currentFilter={currentFilter}
          onSortChange={(value) => updateParams('sort', value)}
          onFilterChange={(value) => updateParams('filter', value)}
        />
        <div className="text-center py-12">
          <HugeiconsIcon
            icon={FilterIcon}
            size={48}
            className="mx-auto text-muted-foreground/50 mb-4"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">{t('reports.noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <FilterSortControls
        currentSort={currentSort}
        currentFilter={currentFilter}
        onSortChange={(value) => updateParams('sort', value)}
        onFilterChange={(value) => updateParams('filter', value)}
      />

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{t('reports.showing', { count: totalCount })}</p>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => updateParams('page', String(currentPage - 1))}
            aria-label={t('reports.previousPage')}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" aria-hidden="true" />
            {t('reports.previous')}
          </Button>

          <span className="text-sm text-muted-foreground">
            {t('reports.pageOf', { current: currentPage, total: totalPages })}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => updateParams('page', String(currentPage + 1))}
            aria-label={t('reports.nextPage')}
          >
            {t('reports.next')}
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface FilterSortControlsProps {
  currentSort: string;
  currentFilter: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

function FilterSortControls({
  currentSort,
  currentFilter,
  onSortChange,
  onFilterChange,
}: FilterSortControlsProps) {
  const t = useTranslations('profile');

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={FilterIcon}
          size={16}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <Select value={currentFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-36" aria-label={t('reports.filterBy')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('reports.filterAll')}</SelectItem>
            <SelectItem value="pending">{t('reports.filterPending')}</SelectItem>
            <SelectItem value="verified">{t('reports.filterVerified')}</SelectItem>
            <SelectItem value="resolved">{t('reports.filterResolved')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={SortingAZIcon}
          size={16}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-36" aria-label={t('reports.sortBy')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t('reports.sortRecent')}</SelectItem>
            <SelectItem value="verified">{t('reports.sortVerified')}</SelectItem>
            <SelectItem value="pending">{t('reports.sortPending')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface ReportCardProps {
  report: Report;
}

function ReportCard({ report }: ReportCardProps) {
  const t = useTranslations('profile');
  const isVerified = report.verification_count >= 2;
  const categoryLabel =
    report.category === 'waste' ? t('reports.categoryWaste') : t('reports.categoryDrainage');

  // Get verifier usernames - handle both single object and array from Supabase
  const verifierNames = report.verifications
    ?.map((v) => {
      const verifier = v.verifier;
      if (!verifier) return null;
      // Handle array case (Supabase can return array for foreign keys)
      if (Array.isArray(verifier)) {
        return verifier[0]?.username;
      }
      return verifier.username;
    })
    .filter((name): name is string => !!name)
    .slice(0, 2);

  const additionalVerifiers = (report.verifications?.length || 0) - 2;

  return (
    <Link
      href={`/issues/${report.id}`}
      className="block bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex gap-4">
        {/* Photo Thumbnail */}
        {report.photos?.[0] && (
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
            <Image
              src={report.photos[0]}
              alt={t('reports.photoAlt', { category: categoryLabel })}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground capitalize">{categoryLabel}</h3>
              {report.address && (
                <p className="text-sm text-muted-foreground truncate max-w-50 md:max-w-none">
                  {report.address}
                </p>
              )}
            </div>

            <Badge
              variant={isVerified ? 'default' : 'secondary'}
              className={isVerified ? 'bg-primary/10 text-primary border border-primary/20' : ''}
            >
              {isVerified ? (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} aria-hidden="true" />
                  {t('reports.verified')}
                </span>
              ) : (
                t('reports.pending', { count: report.verification_count })
              )}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>

            {isVerified && verifierNames && verifierNames.length > 0 && (
              <span className="hidden md:inline">
                {t('reports.verifiedBy')} {verifierNames.map((name) => `@${name}`).join(', ')}
                {additionalVerifiers > 0 && ` +${additionalVerifiers}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MyReportsList;
