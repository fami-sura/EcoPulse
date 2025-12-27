'use client';

/**
 * MapFilters Component
 *
 * Filter panel for the map to filter issues by category, status, and date range.
 *
 * @features
 * - Mobile: Bottom sheet slide-up (triggered by Filter button)
 * - Desktop: Sidebar on right side (always visible, 280px width)
 * - URL query param sync for shareable filtered views
 * - Icon-driven UI with 44x44px touch targets
 * - Pin count display
 *
 * @accessibility
 * - Keyboard navigable
 * - Screen reader labels
 * - Focus management
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  DropletIcon,
  FilterIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import { useMapStore, type MapFilters as MapFiltersType } from '@/stores/mapStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/supabase/database.types';

type IssueCategory = Database['public']['Enums']['issue_category'];
type IssueStatus = Database['public']['Enums']['issue_status'];

/** Filter configuration for categories */
const CATEGORY_OPTIONS: { value: IssueCategory; label: string; icon: typeof Delete02Icon }[] = [
  { value: 'waste', label: 'Waste/Litter', icon: Delete02Icon },
  { value: 'drainage', label: 'Drainage', icon: DropletIcon },
];

/** Filter configuration for statuses */
const STATUS_OPTIONS: { value: IssueStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: '#6B7280' },
  { value: 'verified', label: 'Verified', color: '#10B981' },
  { value: 'in_progress', label: 'In Progress', color: '#3B82F6' },
  { value: 'resolved', label: 'Resolved', color: '#8B5CF6' },
];

/** Filter configuration for date ranges */
const DATE_OPTIONS: { value: MapFiltersType['dateRange']; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All Time' },
];

interface MapFiltersProps {
  /** Total count of all issues (unfiltered) */
  totalCount?: number;
  /** Current filtered count */
  filteredCount?: number;
}

/**
 * Parse URL search params into filter state
 */
function parseFiltersFromURL(searchParams: URLSearchParams): Partial<MapFiltersType> {
  const filters: Partial<MapFiltersType> = {};

  const categoryParam = searchParams.get('category');
  if (categoryParam) {
    filters.categories = categoryParam.split(',') as IssueCategory[];
  }

  const statusParam = searchParams.get('status');
  if (statusParam) {
    filters.statuses = statusParam.split(',') as IssueStatus[];
  }

  const dateParam = searchParams.get('date') as MapFiltersType['dateRange'];
  if (dateParam && ['7d', '30d', '90d', 'all'].includes(dateParam)) {
    filters.dateRange = dateParam;
  }

  return filters;
}

/**
 * Build URL search params from filter state
 */
function buildURLFromFilters(filters: MapFiltersType): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categories.length > 0) {
    params.set('category', filters.categories.join(','));
  }

  if (filters.statuses.length > 0) {
    params.set('status', filters.statuses.join(','));
  }

  if (filters.dateRange !== 'all') {
    params.set('date', filters.dateRange);
  }

  return params;
}

/**
 * Filter Content Component
 * Shared between mobile sheet and desktop sidebar
 */
function FilterContent({
  filters,
  onCategoryToggle,
  onStatusToggle,
  onDateChange,
  onClear,
  totalCount,
  filteredCount,
  showApplyButton,
  onApply,
}: {
  filters: MapFiltersType;
  onCategoryToggle: (category: IssueCategory) => void;
  onStatusToggle: (status: IssueStatus) => void;
  onDateChange: (dateRange: MapFiltersType['dateRange']) => void;
  onClear: () => void;
  totalCount?: number;
  filteredCount?: number;
  showApplyButton?: boolean;
  onApply?: () => void;
}) {
  const hasActiveFilters =
    filters.categories.length > 0 || filters.statuses.length > 0 || filters.dateRange !== 'all';

  return (
    <div className="flex flex-col gap-6">
      {/* Pin Count */}
      {totalCount !== undefined && filteredCount !== undefined && (
        <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground border border-border">
          Showing <span className="font-semibold text-primary">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> issues
        </div>
      )}

      {/* Category Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const isSelected = filters.categories.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => onCategoryToggle(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                }`}
                aria-pressed={isSelected}
                aria-label={`${option.label} filter`}
              >
                <HugeiconsIcon icon={option.icon} className="h-5 w-5" />
                <span className="text-sm">{option.label}</span>
                {isSelected && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-1 h-4 w-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = filters.statuses.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => onStatusToggle(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                }`}
                aria-pressed={isSelected}
                aria-label={`${option.label} status filter`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                  aria-hidden="true"
                />
                <span className="text-sm">{option.label}</span>
                {isSelected && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-1 h-4 w-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Date Range</h3>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((option) => {
            const isSelected = filters.dateRange === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onDateChange(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                }`}
                aria-pressed={isSelected}
                aria-label={`${option.label} date filter`}
              >
                <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
                <span className="text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClear}
          className="w-full"
          aria-label="Clear all filters"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      {/* Apply Button (mobile only) */}
      {showApplyButton && (
        <Button onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      )}
    </div>
  );
}

export function MapFilters({ totalCount, filteredCount }: MapFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, resetFilters } = useMapStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<MapFiltersType>(filters);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync filters from URL on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - intentionally not reacting to searchParams changes

  // Sync local filters with store
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  /**
   * Update URL with current filters
   */
  const updateURL = useCallback(
    (newFilters: MapFiltersType) => {
      const params = buildURLFromFilters(newFilters);
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '/', { scroll: false });
    },
    [router]
  );

  /**
   * Toggle category filter
   */
  const handleCategoryToggle = useCallback(
    (category: IssueCategory) => {
      const newCategories = localFilters.categories.includes(category)
        ? localFilters.categories.filter((c) => c !== category)
        : [...localFilters.categories, category];

      const newFilters = { ...localFilters, categories: newCategories };
      setLocalFilters(newFilters);

      // Desktop: auto-apply
      if (!isMobile) {
        setFilters(newFilters);
        updateURL(newFilters);
      }
    },
    [localFilters, isMobile, setFilters, updateURL]
  );

  /**
   * Toggle status filter
   */
  const handleStatusToggle = useCallback(
    (status: IssueStatus) => {
      const newStatuses = localFilters.statuses.includes(status)
        ? localFilters.statuses.filter((s) => s !== status)
        : [...localFilters.statuses, status];

      const newFilters = { ...localFilters, statuses: newStatuses };
      setLocalFilters(newFilters);

      // Desktop: auto-apply
      if (!isMobile) {
        setFilters(newFilters);
        updateURL(newFilters);
      }
    },
    [localFilters, isMobile, setFilters, updateURL]
  );

  /**
   * Change date range filter
   */
  const handleDateChange = useCallback(
    (dateRange: MapFiltersType['dateRange']) => {
      const newFilters = { ...localFilters, dateRange };
      setLocalFilters(newFilters);

      // Desktop: auto-apply
      if (!isMobile) {
        setFilters(newFilters);
        updateURL(newFilters);
      }
    },
    [localFilters, isMobile, setFilters, updateURL]
  );

  /**
   * Clear all filters
   */
  const handleClear = useCallback(() => {
    resetFilters();
    setLocalFilters({ categories: [], statuses: [], dateRange: 'all', verifiedOnly: false });
    router.push('/', { scroll: false });
    if (isMobile) {
      setIsOpen(false);
    }
  }, [resetFilters, router, isMobile]);

  /**
   * Apply filters (mobile only)
   */
  const handleApply = useCallback(() => {
    setFilters(localFilters);
    updateURL(localFilters);
    setIsOpen(false);
  }, [localFilters, setFilters, updateURL]);

  // Calculate if any filters are active
  const hasActiveFilters =
    filters.categories.length > 0 || filters.statuses.length > 0 || filters.dateRange !== 'all';

  // Mobile: Render bottom sheet
  if (isMobile) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-6 right-4 flex items-center gap-2 rounded-full bg-background shadow-lg border-border"
            style={{ zIndex: 1000 }}
            aria-label="Open filters"
          >
            <HugeiconsIcon icon={FilterIcon} className="h-5 w-5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {filters.categories.length +
                  filters.statuses.length +
                  (filters.dateRange !== 'all' ? 1 : 0)}
              </span>
            )}
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
            style={{ zIndex: 9998 }}
          />

          <Dialog.Content
            className="fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-background p-6 shadow-xl border-t border-border data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom"
            style={{ zIndex: 9999 }}
            aria-describedby={undefined}
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Filter Issues
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close filters"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <FilterContent
              filters={localFilters}
              onCategoryToggle={handleCategoryToggle}
              onStatusToggle={handleStatusToggle}
              onDateChange={handleDateChange}
              onClear={handleClear}
              totalCount={totalCount}
              filteredCount={filteredCount}
              showApplyButton={true}
              onApply={handleApply}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  // Desktop: Render toggle button + dropdown panel overlay
  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsDesktopOpen(!isDesktopOpen)}
        className={cn(
          'fixed right-4 top-20 flex h-12 items-center gap-2 rounded-xl px-4 shadow-lg border transition-all duration-200',
          isDesktopOpen
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-card text-foreground border-border hover:border-primary/50'
        )}
        style={{ zIndex: 1000 }}
        aria-label={isDesktopOpen ? 'Close filters' : 'Open filters'}
        aria-expanded={isDesktopOpen}
      >
        <HugeiconsIcon icon={isDesktopOpen ? Cancel01Icon : FilterIcon} className="h-5 w-5" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && !isDesktopOpen && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {filters.categories.length +
              filters.statuses.length +
              (filters.dateRange !== 'all' ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isDesktopOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          style={{ zIndex: 9998 }}
          onClick={() => setIsDesktopOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Filter Panel - positioned as independent overlay */}
      {isDesktopOpen && (
        <aside
          className="fixed right-4 top-36 w-80 max-h-[calc(100vh-180px)] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-5"
          style={{ zIndex: 9999 }}
          aria-label="Map filters"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <HugeiconsIcon icon={FilterIcon} className="h-5 w-5" />
              Filters
            </h2>
            <button
              onClick={() => setIsDesktopOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close filters"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
            </button>
          </div>

          <FilterContent
            filters={localFilters}
            onCategoryToggle={handleCategoryToggle}
            onStatusToggle={handleStatusToggle}
            onDateChange={handleDateChange}
            onClear={handleClear}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </aside>
      )}
    </>
  );
}

export default MapFilters;
