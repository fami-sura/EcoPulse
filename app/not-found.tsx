'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Search01Icon,
  ArrowLeft01Icon,
  SadIcon,
  Leaf01Icon,
} from '@hugeicons/core-free-icons';

/**
 * Global 404 Not Found Page
 *
 * Beautiful, user-friendly 404 page with helpful navigation options.
 * Follows the EcoPulse design system with green accents.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-md text-center">
        {/* Animated 404 Icon */}
        <div className="relative mx-auto mb-8 h-40 w-40">
          {/* Outer ring */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-green-100" />
          {/* Inner circle */}
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white shadow-lg">
            <div className="text-center">
              <span className="block text-5xl font-bold text-green-600">404</span>
              <HugeiconsIcon icon={SadIcon} size={32} className="mx-auto mt-1 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <HugeiconsIcon icon={Home01Icon} size={20} />
            Go to Map
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Helpful Links
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <HugeiconsIcon icon={Home01Icon} size={20} />
              </div>
              <div>
                <span className="block font-medium text-gray-900">Map</span>
                <span className="text-sm text-gray-500">View issues near you</span>
              </div>
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <HugeiconsIcon icon={Search01Icon} size={20} />
              </div>
              <div>
                <span className="block font-medium text-gray-900">My Reports</span>
                <span className="text-sm text-gray-500">View your submissions</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2">
          <HugeiconsIcon icon={Leaf01Icon} size={16} className="text-green-500" />
          EcoPulse — Building cleaner communities together
        </p>
      </div>
    </div>
  );
}
