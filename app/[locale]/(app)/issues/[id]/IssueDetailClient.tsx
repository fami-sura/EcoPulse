'use client';

/**
 * IssueDetailClient Component
 *
 * Client-side component for displaying full issue details.
 *
 * @features
 * - Photo gallery with lightbox
 * - Full description
 * - Location map preview
 * - Status timeline
 * - Share/Report actions
 * - Verification button (Story 2.1.1)
 */

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Delete02Icon,
  DropletIcon,
  SmileIcon,
  NeutralIcon,
  SadIcon,
  Location01Icon,
  Clock01Icon,
  Share01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  ArrowLeft02Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { VerifyButton, VerificationList } from '@/components/verification';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/supabase/database.types';

type Issue = Database['public']['Tables']['issues']['Row'];

interface IssueDetailClientProps {
  issue: Issue;
}

/**
 * Get category display info
 */
function getCategoryInfo(category: Issue['category']) {
  switch (category) {
    case 'waste':
      return {
        icon: Delete02Icon,
        label: 'Waste/Litter',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
      };
    case 'drainage':
      return {
        icon: DropletIcon,
        label: 'Drainage',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
      };
    default:
      return {
        icon: Delete02Icon,
        label: category,
        color: 'text-gray-600 bg-gray-50 border-gray-200',
      };
  }
}

/**
 * Get severity display info
 */
function getSeverityInfo(severity: Issue['severity']) {
  switch (severity) {
    case 'low':
      return { icon: SmileIcon, label: 'Low Severity', color: 'text-green-600 bg-green-50' };
    case 'medium':
      return { icon: NeutralIcon, label: 'Medium Severity', color: 'text-amber-600 bg-amber-50' };
    case 'high':
      return { icon: SadIcon, label: 'High Severity', color: 'text-red-600 bg-red-50' };
    default:
      return { icon: NeutralIcon, label: severity, color: 'text-gray-600 bg-gray-50' };
  }
}

/**
 * Get status display info
 */
function getStatusInfo(status: Issue['status']) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending Verification',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: Clock01Icon,
      };
    case 'verified':
      return {
        label: 'Verified',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckmarkCircle02Icon,
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: Clock01Icon,
      };
    case 'resolved':
      return {
        label: 'Resolved',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        icon: CheckmarkCircle02Icon,
      };
    default:
      return {
        label: status,
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: Clock01Icon,
      };
  }
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function IssueDetailClient({ issue }: IssueDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('issues');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const categoryInfo = getCategoryInfo(issue.category);
  const severityInfo = getSeverityInfo(issue.severity);
  const statusInfo = getStatusInfo(issue.status);
  const photos = issue.photos || [];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EcoPulse Issue: ${categoryInfo.label}`,
          text: issue.note || `${categoryInfo.label} issue reported`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextPhoto = () => {
    setSelectedPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setSelectedPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
          </button>
          <h1 className="flex-1 text-lg font-semibold">{t('title')}</h1>
          <button
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t('share')}
          >
            <HugeiconsIcon icon={Share01Icon} size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl pb-24">
        {/* Photo Gallery */}
        {photos.length > 0 && (
          <section className="relative bg-gray-900">
            {/* Main Photo */}
            <button
              onClick={() => setShowLightbox(true)}
              className="relative aspect-4/3 w-full cursor-zoom-in sm:aspect-video"
            >
              <Image
                src={photos[selectedPhoto]}
                alt={`Issue photo ${selectedPhoto + 1}`}
                fill
                className="object-contain"
                unoptimized
                priority
              />
              {/* Photo counter badge */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                  {selectedPhoto + 1} / {photos.length}
                </div>
              )}
            </button>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Previous photo"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={24} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Next photo"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 bg-gray-800">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    onClick={() => setSelectedPhoto(index)}
                    className={cn(
                      'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all',
                      selectedPhoto === index
                        ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-800'
                        : 'opacity-50 hover:opacity-80'
                    )}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Status & Category Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
                categoryInfo.color
              )}
            >
              <HugeiconsIcon icon={categoryInfo.icon} size={16} />
              {categoryInfo.label}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
                statusInfo.color
              )}
            >
              <HugeiconsIcon icon={statusInfo.icon} size={16} />
              {statusInfo.label}
            </span>
          </div>

          {/* Severity Card */}
          <div className={cn('flex items-center gap-3 rounded-xl p-4 border', severityInfo.color)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60">
              <HugeiconsIcon icon={severityInfo.icon} size={28} />
            </div>
            <div>
              <span className="font-semibold">{severityInfo.label}</span>
              <p className="text-sm opacity-80">
                {issue.severity === 'high'
                  ? 'Requires immediate attention'
                  : issue.severity === 'medium'
                    ? 'Needs attention soon'
                    : 'Minor issue'}
              </p>
            </div>
          </div>

          {/* Description */}
          {issue.note && (
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <span className="h-1 w-1 rounded-full bg-green-500" />
                {t('description')}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{issue.note}</p>
            </section>
          )}

          {/* Location */}
          <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                {t('location')}
              </h2>
              <div className="flex items-start gap-2 text-gray-700">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-500"
                />
                <div>
                  {issue.address ? (
                    <p className="leading-relaxed">{issue.address}</p>
                  ) : (
                    <p className="font-mono text-sm">
                      {issue.lat.toFixed(6)}, {issue.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Mini Map Preview */}
            <div className="h-48">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${issue.lng - 0.005},${issue.lat - 0.003},${issue.lng + 0.005},${issue.lat + 0.003}&layer=mapnik&marker=${issue.lat},${issue.lng}`}
                className="h-full w-full border-0"
                title="Issue location map"
              />
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              <span className="h-1 w-1 rounded-full bg-purple-500" />
              {t('timeline')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <HugeiconsIcon icon={Calendar01Icon} size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('reported')}</p>
                  <p className="text-sm text-gray-500">{formatDate(issue.created_at)}</p>
                </div>
              </div>
              {issue.updated_at !== issue.created_at && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <HugeiconsIcon icon={Clock01Icon} size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('updated')}</p>
                    <p className="text-sm text-gray-500">{formatDate(issue.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Verifications Section - Story 2.1.5 */}
          <VerificationList
            issueId={issue.id}
            issueLocation={{ lat: issue.lat, lng: issue.lng }}
            verificationCount={issue.verification_count}
          />

          {/* Verify Button - Story 2.1.1 */}
          {issue.status === 'pending' && (
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <span className="h-1 w-1 rounded-full bg-green-500" />
                Help Verify
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Visit this location and take a photo to help verify this issue exists.
              </p>
              <VerifyButton
                issue={{
                  id: issue.id,
                  user_id: issue.user_id,
                  session_id: issue.session_id,
                  status: issue.status,
                  verification_count: issue.verification_count,
                  created_at: issue.created_at,
                  lat: issue.lat,
                  lng: issue.lng,
                  category: issue.category,
                  photos: issue.photos,
                }}
                onVerified={() => router.refresh()}
              />
            </section>
          )}
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg">
          <div className="mx-auto max-w-3xl">
            <Button
              onClick={() => router.push(`/?issue=${issue.id}`)}
              className="w-full gap-2"
              size="lg"
            >
              <HugeiconsIcon icon={Location01Icon} size={20} />
              {t('viewOnMap')}
            </Button>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {showLightbox && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={28} />
          </button>

          {/* Navigation */}
          {photos.length > 1 && (
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
                <HugeiconsIcon icon={ArrowRight01Icon} size={28} />
              </button>
            </>
          )}

          {/* Photo counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white">
              {selectedPhoto + 1} / {photos.length}
            </div>
          )}

          {/* Main image */}
          <Image
            src={photos[selectedPhoto]}
            alt={`Issue photo ${selectedPhoto + 1}`}
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

export default IssueDetailClient;
