'use client';

/**
 * VerificationList Component
 *
 * Displays all verifications for an issue with:
 * - Verifier info (username, avatar)
 * - Verification photos in horizontal gallery
 * - Optional notes
 * - Relative timestamps
 * - Distance indicator if far from original report
 *
 * Story 2.1.5 - Multi-Verifier Display & Photo Gallery
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  User03Icon,
  Clock01Icon,
  Location01Icon,
  Cancel01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface Verification {
  id: string;
  photo_url: string;
  note: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  verifier: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface VerificationListProps {
  /** Issue ID to fetch verifications for */
  issueId: string;
  /** Original issue location for distance calculation */
  issueLocation: { lat: number; lng: number };
  /** Current verification count */
  verificationCount: number;
}

/** Earth's radius in meters */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffHours > 1) {
    return `${diffHours} hours ago`;
  } else if (diffHours === 1) {
    return '1 hour ago';
  } else if (diffMins > 1) {
    return `${diffMins} minutes ago`;
  } else {
    return 'just now';
  }
}

export function VerificationList({
  issueId,
  issueLocation,
  verificationCount,
}: VerificationListProps) {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch verifications
  useEffect(() => {
    async function fetchVerifications() {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from('verifications')
          .select(
            `
            id,
            photo_url,
            note,
            lat,
            lng,
            created_at,
            verifier:users!verifier_id (
              username,
              avatar_url
            )
          `
          )
          .eq('issue_id', issueId)
          .eq('is_valid', true)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setVerifications((data as unknown as Verification[]) || []);
      } catch (err) {
        console.error('Failed to fetch verifications:', err);
        setError('Unable to load verifications. Please refresh.');
      } finally {
        setLoading(false);
      }
    }

    if (verificationCount > 0) {
      fetchVerifications();
    } else {
      setLoading(false);
    }
  }, [issueId, verificationCount]);

  // All verification photos for lightbox navigation
  const allPhotos = verifications.map((v) => v.photo_url);

  const openLightbox = (photoUrl: string) => {
    const index = allPhotos.indexOf(photoUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxPhoto(photoUrl);
  };

  const nextPhoto = () => {
    const newIndex = (lightboxIndex + 1) % allPhotos.length;
    setLightboxIndex(newIndex);
    setLightboxPhoto(allPhotos[newIndex]);
  };

  const prevPhoto = () => {
    const newIndex = (lightboxIndex - 1 + allPhotos.length) % allPhotos.length;
    setLightboxIndex(newIndex);
    setLightboxPhoto(allPhotos[newIndex]);
  };

  // Empty state
  if (!loading && verifications.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} className="text-gray-400" />
        </div>
        <p className="font-medium text-gray-600">No verifications yet</p>
        <p className="text-sm text-gray-500">Be the first to verify this issue!</p>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-32 rounded-lg bg-gray-200" />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-green-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">
              {verifications.length} {verifications.length === 1 ? 'Verification' : 'Verifications'}
            </h3>
            <p className="text-sm text-green-700">
              {verificationCount >= 2
                ? 'Community verified ✓'
                : `${2 - verificationCount} more needed to verify`}
            </p>
          </div>
        </div>

        {/* Photo Gallery - Horizontal scroll */}
        <div className="overflow-x-auto bg-white p-3 border-b border-green-100">
          <div className="flex gap-2">
            {verifications.map((verification) => (
              <button
                key={verification.id}
                onClick={() => openLightbox(verification.photo_url)}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-green-200 hover:ring-green-400 transition-all"
              >
                <Image
                  src={verification.photo_url}
                  alt="Verification photo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* Verifier List */}
        <div className="divide-y divide-green-100 bg-white">
          {verifications.map((verification) => {
            const distance =
              verification.lat && verification.lng
                ? calculateDistance(
                    issueLocation.lat,
                    issueLocation.lng,
                    verification.lat,
                    verification.lng
                  )
                : null;
            const isFar = distance !== null && distance > 500;

            return (
              <div key={verification.id} className="p-4">
                {/* Verifier Info */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {verification.verifier?.avatar_url ? (
                      <Image
                        src={verification.verifier.avatar_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <HugeiconsIcon icon={User03Icon} size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">
                        @{verification.verifier?.username || 'anonymous'}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <HugeiconsIcon icon={Clock01Icon} size={14} />
                        {formatRelativeTime(verification.created_at)}
                      </span>
                    </div>

                    {/* Distance indicator */}
                    {distance !== null && (
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-1 text-sm',
                          isFar ? 'text-amber-600' : 'text-gray-500'
                        )}
                      >
                        <HugeiconsIcon icon={Location01Icon} size={14} />
                        <span>
                          {distance < 100
                            ? 'Verified on location'
                            : distance < 1000
                              ? `~${Math.round(distance)}m from report`
                              : `~${(distance / 1000).toFixed(1)}km from report`}
                        </span>
                      </div>
                    )}

                    {/* Note */}
                    {verification.note && (
                      <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                        {verification.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightboxPhoto(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={28} />
          </button>

          {/* Navigation */}
          {allPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous photo"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next photo"
              >
                <HugeiconsIcon icon={ArrowRight02Icon} size={28} />
              </button>
            </>
          )}

          {/* Photo counter */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white">
              {lightboxIndex + 1} / {allPhotos.length}
            </div>
          )}

          {/* Main image */}
          <Image
            src={lightboxPhoto}
            alt="Verification photo"
            width={1400}
            height={1000}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default VerificationList;
