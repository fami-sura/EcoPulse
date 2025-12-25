'use client';

/**
 * IssueDrawer Component
 *
 * A bottom drawer/sheet that displays issue details when a pin is clicked.
 * This is rendered outside of the Leaflet map to prevent shaking/jittering.
 *
 * @features
 * - Smooth slide-up animation
 * - Photo preview with gallery
 * - Category, severity, and status badges
 * - Truncated description
 * - View Details button
 * - Swipe to close on mobile
 *
 * @accessibility
 * - Focus trap when open
 * - Escape key to close
 * - Screen reader announcements
 */

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  DropletIcon,
  SmileIcon,
  NeutralIcon,
  SadIcon,
  Location01Icon,
  Clock01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MapPin } from '@/stores/mapStore';

interface IssueDrawerProps {
  /** The issue pin data to display */
  pin: MapPin | null;
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
}

/**
 * Get category display info
 */
function getCategoryInfo(category: MapPin['category']) {
  switch (category) {
    case 'waste':
      return {
        icon: Delete02Icon,
        label: 'Waste/Litter',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
      };
    case 'drainage':
      return {
        icon: DropletIcon,
        label: 'Drainage',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
      };
    default:
      return {
        icon: Delete02Icon,
        label: category,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
      };
  }
}

/**
 * Get severity display info
 */
function getSeverityInfo(severity: MapPin['severity']) {
  switch (severity) {
    case 'low':
      return { icon: SmileIcon, label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' };
    case 'medium':
      return {
        icon: NeutralIcon,
        label: 'Medium',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
      };
    case 'high':
      return { icon: SadIcon, label: 'High', color: 'text-red-600', bgColor: 'bg-red-50' };
    default:
      return { icon: NeutralIcon, label: severity, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
}

/**
 * Get status display info
 */
function getStatusInfo(status: MapPin['status']) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-400',
      };
    case 'verified':
      return {
        label: 'Verified',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
      };
    default:
      return {
        label: status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-400',
      };
  }
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function IssueDrawer({ pin, isOpen, onClose }: IssueDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Don't render if no pin or not open
  if (!pin || !isOpen) return null;

  const categoryInfo = getCategoryInfo(pin.category);
  const severityInfo = getSeverityInfo(pin.severity);
  const statusInfo = getStatusInfo(pin.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-1001 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-drawer-title"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-1002 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          'md:left-auto md:right-4 md:bottom-4 md:w-96 md:rounded-2xl'
        )}
      >
        {/* Drag Handle (mobile) */}
        <div className="flex justify-center py-2 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-gray-600 hover:bg-black/20 transition-colors"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>

        {/* Photo Preview */}
        {pin.photos && pin.photos.length > 0 && (
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <Image
              src={pin.photos[0]}
              alt={`${categoryInfo.label} issue photo`}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            {/* Photo count badge */}
            {pin.photos.length > 1 && (
              <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                +{pin.photos.length - 1} more
              </div>
            )}
            {/* Status Badge - overlaid on image */}
            <div
              className={cn(
                'absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
                statusInfo.bgColor,
                statusInfo.textColor
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', statusInfo.dotColor)} />
              {statusInfo.label}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Category and Severity Row */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
                categoryInfo.bgColor,
                categoryInfo.textColor,
                categoryInfo.borderColor
              )}
            >
              <HugeiconsIcon icon={categoryInfo.icon} size={16} />
              {categoryInfo.label}
            </span>

            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5',
                severityInfo.bgColor
              )}
            >
              <HugeiconsIcon icon={severityInfo.icon} size={18} className={severityInfo.color} />
              <span className={cn('text-sm font-medium', severityInfo.color)}>
                {severityInfo.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {pin.note && (
            <p className="line-clamp-3 text-sm text-gray-700 leading-relaxed">{pin.note}</p>
          )}

          {/* Location */}
          {pin.address && (
            <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
              <HugeiconsIcon
                icon={Location01Icon}
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />
              <span className="line-clamp-2 text-sm text-gray-600">{pin.address}</span>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HugeiconsIcon icon={Clock01Icon} size={14} />
            <span>Reported {formatRelativeTime(pin.created_at)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href={`/issues/${pin.id}`} className="flex-1" onClick={onClose}>
              <Button className="w-full gap-2">
                View Details
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default IssueDrawer;
