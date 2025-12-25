'use client';

/**
 * ReportFAB Component
 *
 * Floating Action Button for initiating report flow.
 *
 * @features
 * - Mobile: 56x56px circular FAB in bottom-right corner
 * - Desktop: Standard button with text "Report Issue"
 * - Camera icon (Hugeicons Camera01)
 * - Opens report modal/form
 *
 * @accessibility
 * - aria-label for screen readers
 * - 56x56px exceeds WCAG 44px minimum touch target
 * - Keyboard accessible
 */

import { HugeiconsIcon } from '@hugeicons/react';
import { Camera01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface ReportFABProps {
  /** Callback when button is clicked */
  onClick?: () => void;
  /** Custom class names */
  className?: string;
}

export function ReportFAB({ onClick, className }: ReportFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Report environmental issue"
      style={{ zIndex: 1000 }}
      className={cn(
        // Base styles
        'fixed flex items-center justify-center',
        'bg-green-600 text-white shadow-lg',
        'transition-all duration-200 ease-out',
        // Hover/active states
        'hover:bg-green-700 hover:shadow-xl',
        'active:scale-95 active:bg-green-800',
        // Focus states
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
        // Mobile: FAB style (bottom-left, circular)
        'bottom-6 left-4',
        'h-14 w-14 rounded-full',
        // Desktop: Positioned in filter sidebar area
        'lg:bottom-6 lg:left-auto lg:right-4',
        'lg:h-12 lg:w-auto lg:rounded-lg lg:px-6',
        className
      )}
    >
      <HugeiconsIcon icon={Camera01Icon} className="h-6 w-6" aria-hidden="true" />
      <span className="ml-2 hidden font-medium lg:inline">Report Issue</span>
    </button>
  );
}

export default ReportFAB;
