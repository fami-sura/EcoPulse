'use client';

/**
 * IssuePopup Component
 *
 * Displays issue details in a Leaflet popup when a pin is clicked.
 *
 * @features
 * - Photo thumbnail preview
 * - Category and severity badges
 * - Status indicator
 * - Truncated description
 * - "View Details" link to full issue page
 * - Relative timestamp
 *
 * @accessibility
 * - All interactive elements are keyboard accessible
 * - Images have alt text
 */

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
} from '@hugeicons/core-free-icons';
import { Link } from '@/i18n/routing';
import type { MapPin } from '@/stores/mapStore';

interface IssuePopupProps {
  pin: MapPin;
}

/**
 * Get category display info
 */
function getCategoryInfo(category: MapPin['category']) {
  switch (category) {
    case 'waste':
      return { icon: Delete02Icon, label: 'Waste/Litter', color: 'text-amber-600 bg-amber-50' };
    case 'drainage':
      return { icon: DropletIcon, label: 'Drainage', color: 'text-blue-600 bg-blue-50' };
    default:
      return { icon: Delete02Icon, label: category, color: 'text-muted-foreground bg-muted' };
  }
}

/**
 * Get severity display info
 */
function getSeverityInfo(severity: MapPin['severity']) {
  switch (severity) {
    case 'low':
      return { icon: SmileIcon, label: 'Low', color: 'text-primary' };
    case 'medium':
      return { icon: NeutralIcon, label: 'Medium', color: 'text-warning' };
    case 'high':
      return { icon: SadIcon, label: 'High', color: 'text-destructive' };
    default:
      return { icon: NeutralIcon, label: severity, color: 'text-muted-foreground' };
  }
}

/**
 * Get status display info
 */
function getStatusInfo(status: MapPin['status']) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-muted text-muted-foreground' };
    case 'verified':
      return { label: 'Verified', color: 'bg-primary/10 text-primary' };
    case 'in_progress':
      return { label: 'In Progress', color: 'bg-blue-100 text-blue-700' };
    case 'resolved':
      return { label: 'Resolved', color: 'bg-violet-100 text-violet-700' };
    default:
      return { label: status, color: 'bg-muted text-muted-foreground' };
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

export function IssuePopup({ pin }: IssuePopupProps) {
  const categoryInfo = getCategoryInfo(pin.category);
  const severityInfo = getSeverityInfo(pin.severity);
  const statusInfo = getStatusInfo(pin.status);

  return (
    <div className="w-64 p-0">
      {/* Photo Preview */}
      {pin.photos && pin.photos.length > 0 && (
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <Image
            src={pin.photos[0]}
            alt={`${categoryInfo.label} issue photo`}
            fill
            className="object-cover"
            unoptimized
          />
          {pin.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
              +{pin.photos.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2 p-3">
        {/* Status and Category */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${categoryInfo.color}`}
          >
            <HugeiconsIcon icon={categoryInfo.icon} size={12} />
            {categoryInfo.label}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Severity */}
        <div className="flex items-center gap-1 text-sm">
          <HugeiconsIcon icon={severityInfo.icon} size={16} className={severityInfo.color} />
          <span className={`text-xs ${severityInfo.color}`}>{severityInfo.label} severity</span>
        </div>

        {/* Description */}
        {pin.note && <p className="line-clamp-2 text-sm text-muted-foreground">{pin.note}</p>}

        {/* Location */}
        {pin.address && (
          <div className="flex items-start gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Location01Icon} size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">{pin.address}</span>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
          <HugeiconsIcon icon={Clock01Icon} size={12} />
          <span>{formatRelativeTime(pin.created_at)}</span>
        </div>

        {/* View Details Link */}
        <Link
          href={`/issues/${pin.id}`}
          className="mt-2 block w-full rounded-lg bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default IssuePopup;
