'use client';

/**
 * IssueMarker Component
 *
 * Custom marker for environmental issues using Hugeicons.
 * Color-coded based on issue status for visual distinction.
 * Shows verification badge when verification_count >= 2.
 *
 * Status colors:
 * - pending: Gray (#6B7280)
 * - verified: Green (#10B981) with checkmark badge
 * - in_progress: Blue (#3B82F6)
 * - resolved: Green with checkmark (#22C55E)
 *
 * Story 2.1.6 - Verification Status Badge on Map Pins
 *
 * @example
 * <IssueMarker
 *   position={[6.5244, 3.3792]}
 *   status="verified"
 *   category="waste"
 *   verificationCount={2}
 *   onClick={() => handleClick(issue.id)}
 * />
 */

import { Marker, Popup, Tooltip } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';
import type { Database } from '@/lib/supabase/database.types';

type IssueStatus = Database['public']['Enums']['issue_status'];
type IssueCategory = Database['public']['Enums']['issue_category'];

interface IssueMarkerProps {
  /** Marker position [lat, lng] */
  position: LatLngExpression;
  /** Issue status determines marker color */
  status: IssueStatus;
  /** Issue category for icon selection */
  category?: IssueCategory;
  /** Issue ID for click handling */
  issueId?: string;
  /** Number of verifications (for badge display) */
  verificationCount?: number;
  /** Click handler */
  onClick?: () => void;
  /** Popup content (optional) */
  popupContent?: React.ReactNode;
  /** Show tooltip on hover (desktop) */
  showTooltip?: boolean;
}

/** Verification threshold for "verified" badge */
const VERIFICATION_THRESHOLD = 2;

/**
 * Get marker color based on status
 */
function getStatusColor(status: IssueStatus): string {
  switch (status) {
    case 'pending':
      return '#6B7280'; // Gray
    case 'verified':
      return '#10B981'; // Emerald
    case 'in_progress':
      return '#3B82F6'; // Blue
    case 'resolved':
      return '#22C55E'; // Green
    default:
      return '#6B7280';
  }
}

export function IssueMarker({
  position,
  status,
  category,
  verificationCount = 0,
  onClick,
  popupContent,
  showTooltip = true,
}: IssueMarkerProps) {
  const color = getStatusColor(status);
  const isVerified = verificationCount >= VERIFICATION_THRESHOLD;
  const showVerifiedBadge = isVerified || status === 'verified';

  // Create custom HTML marker with inline SVG
  // Note: We use inline SVG since HugeiconsIcon is a React component
  // and renderToStaticMarkup doesn't work well with it
  const markerHtml = `
    <div style="
      position: relative;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 36px;
        height: 36px;
        background-color: ${color}20;
        border-radius: 50%;
        border: 2px solid ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${
            status === 'resolved'
              ? '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>'
              : '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>'
          }
        </svg>
      </div>
      ${
        showVerifiedBadge
          ? `
        <div style="
          position: absolute;
          top: 0;
          right: 0;
          width: 18px;
          height: 18px;
          background-color: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        ">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
      `
          : ''
      }
      ${
        category && !showVerifiedBadge
          ? `
        <div style="
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          background-color: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        ">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            ${
              category === 'waste'
                ? '<path d="M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>'
                : '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 6a6 6 0 016 6c0 4-6 10-6 10s-6-6-6-10a6 6 0 016-6z"/>'
            }
          </svg>
        </div>
      `
          : ''
      }
    </div>
  `;

  const customIcon = divIcon({
    html: markerHtml,
    className: 'custom-issue-marker', // No default Leaflet styling
    iconSize: [44, 44], // 44x44px touch target (WCAG 2.1 AA)
    iconAnchor: [22, 22], // Center of icon
    popupAnchor: [0, -22], // Popup above marker
  });

  // Tooltip text based on verification status
  const tooltipText = showVerifiedBadge
    ? `✓ Verified (${verificationCount} verifications)`
    : verificationCount > 0
      ? `${verificationCount}/2 verifications`
      : 'Pending verification';

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      {showTooltip && (
        <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
          <span className="text-sm font-medium">{tooltipText}</span>
        </Tooltip>
      )}
      {popupContent && <Popup>{popupContent}</Popup>}
    </Marker>
  );
}

export default IssueMarker;
