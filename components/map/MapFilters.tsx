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
  { value: 'resolved', label: 'Resolved', color: '#22C55E' },
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
        <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          Showing <span className="font-semibold">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> issues
        </div>
      )}

      {/* Category Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const isSelected = filters.categories.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => onCategoryToggle(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = filters.statuses.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => onStatusToggle(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Date Range</h3>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((option) => {
            const isSelected = filters.dateRange === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onDateChange(option.value)}
                className={`flex min-h-11 min-w-11 items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
        <Button onClick={onApply} className="w-full bg-green-600 hover:bg-green-700">
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
            className="fixed bottom-6 right-4 flex items-center gap-2 rounded-full bg-white shadow-lg dark:bg-gray-800"
            style={{ zIndex: 1000 }}
            aria-label="Open filters"
          >
            <HugeiconsIcon icon={FilterIcon} className="h-5 w-5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
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
            className="fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-white p-6 shadow-xl data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom dark:bg-gray-900"
            style={{ zIndex: 9999 }}
            aria-describedby={undefined}
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold">Filter Issues</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
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

  // Desktop: Render sidebar
  return (
    <aside
      className="fixed right-0 top-15 z-30 h-[calc(100vh-60px)] w-70 overflow-y-auto border-l border-gray-200 bg-white pb-20 pt-4 px-4 dark:border-gray-800 dark:bg-gray-900"
      aria-label="Map filters"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <HugeiconsIcon icon={FilterIcon} className="h-5 w-5" />
        Filters
      </h2>

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
  );
}

export default MapFilters;
