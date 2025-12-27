'use client';

/**
 * VerifyButton Component
 *
 * Button for verifying environmental issues. Checks for self-verification
 * based on both authenticated user_id and anonymous session_id.
 *
 * @features
 * - Self-verification blocking (auth + session-based)
 * - 7-day session expiry validation
 * - Verification count display
 * - Tooltip states for all conditions
 * - 44x44px touch target (WCAG 2.1 AA)
 *
 * @accessibility
 * - Screen reader announcements
 * - Keyboard accessible
 * - Proper ARIA labels
 *
 * Story 2.1.1 - Verification Button & UI Entry Point
 */

import { useState, useEffect, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { VerificationModal } from './VerificationModal';
import type { Database } from '@/lib/supabase/database.types';

type IssueStatus = Database['public']['Enums']['issue_status'];

/** Issue data required for verification checks */
export interface VerifiableIssue {
  id: string;
  user_id: string | null;
  session_id: string | null;
  status: IssueStatus;
  verification_count: number;
  created_at: string;
  lat: number;
  lng: number;
  category: Database['public']['Enums']['issue_category'];
  photos: string[];
}

interface VerifyButtonProps {
  /** The issue to verify */
  issue: VerifiableIssue;
  /** Optional callback after successful verification */
  onVerified?: () => void;
  /** Optional className for styling */
  className?: string;
}

/** Session expiry: 7 days in milliseconds */
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/** Verification threshold to mark as verified */
const VERIFICATION_THRESHOLD = 2;

/**
 * Check if a session is still valid (less than 7 days old)
 */
function isSessionValid(reportCreatedAt: string): boolean {
  const reportDate = new Date(reportCreatedAt).getTime();
  return Date.now() - reportDate < SESSION_EXPIRY_MS;
}

/**
 * Verification status and reason
 */
interface VerificationStatus {
  canVerify: boolean;
  reason: string;
  ariaLabel: string;
}

export function VerifyButton({ issue, onVerified, className }: VerifyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSessionId, setClientSessionId] = useState<string | null>(null);
  const { user, sessionId } = useAuthStore();

  // Get session_id from localStorage on client mount
  useEffect(() => {
    // Try localStorage directly first, fallback to store's sessionId
    const storedSession = localStorage.getItem('session_id') || sessionId;
    // Only update if different to avoid unnecessary re-renders
    if (storedSession !== clientSessionId) {
      setClientSessionId(storedSession);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Check if issue has reached verification threshold
  const isVerified = issue.verification_count >= VERIFICATION_THRESHOLD;

  // Determine verification status and reason
  const verificationStatus = useMemo<VerificationStatus>(() => {
    // Issue already verified
    if (isVerified) {
      return {
        canVerify: false,
        reason: 'Issue already verified',
        ariaLabel: 'This issue has been verified by the community',
      };
    }

    // Issue not pending (resolved/in_progress)
    if (issue.status !== 'pending') {
      return {
        canVerify: false,
        reason: 'Issue is no longer pending',
        ariaLabel: `This issue is ${issue.status.replace('_', ' ')}`,
      };
    }

    // Not authenticated
    if (!user) {
      return {
        canVerify: false,
        reason: 'Login to verify',
        ariaLabel: 'You must be logged in to verify this issue',
      };
    }

    // Self-verification check (authenticated user)
    if (issue.user_id && issue.user_id === user.id) {
      return {
        canVerify: false,
        reason: 'You cannot verify your own report',
        ariaLabel: 'You cannot verify a report you submitted',
      };
    }

    // Self-verification check (anonymous session)
    // Only block if session is still valid (< 7 days old)
    if (
      issue.session_id &&
      clientSessionId &&
      issue.session_id === clientSessionId &&
      isSessionValid(issue.created_at)
    ) {
      return {
        canVerify: false,
        reason: 'You cannot verify your own report',
        ariaLabel: 'You cannot verify a report you submitted',
      };
    }

    // Can verify!
    return {
      canVerify: true,
      reason: 'Verify this environmental issue',
      ariaLabel: 'Click to verify this environmental issue',
    };
  }, [user, issue, clientSessionId, isVerified]);

  // Button label based on verification count
  const buttonLabel = useMemo(() => {
    if (isVerified) {
      return 'Verified ✓';
    }
    return `Verify (${issue.verification_count}/${VERIFICATION_THRESHOLD})`;
  }, [isVerified, issue.verification_count]);

  // Handle verification success
  const handleVerificationSuccess = () => {
    setIsModalOpen(false);
    onVerified?.();
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={!verificationStatus.canVerify}
        variant={verificationStatus.canVerify ? 'default' : 'outline'}
        className={`gap-2 min-w-45 h-11 ${className || ''}`}
        aria-label={verificationStatus.ariaLabel}
        title={verificationStatus.reason}
      >
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          size={20}
          className={isVerified ? 'text-primary' : ''}
        />
        <span>{buttonLabel}</span>
      </Button>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={issue}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
}

export default VerifyButton;
