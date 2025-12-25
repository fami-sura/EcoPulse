'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  Home01Icon,
  Location01Icon,
  Leaf01Icon,
} from '@hugeicons/core-free-icons';

/**
 * Global Not Found Page
 *
 * Displayed when a page is not found (404).
 * Provides helpful navigation options.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-gray-50 to-white p-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
          <HugeiconsIcon icon={AlertCircleIcon} size={48} className="text-amber-500" />
        </div>

        {/* Error Code */}
        <h1 className="mb-2 text-7xl font-bold text-gray-200">404</h1>

        {/* Message */}
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mb-8 max-w-md text-gray-600">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white shadow-md hover:bg-green-700 transition-colors"
          >
            <HugeiconsIcon icon={Location01Icon} size={20} />
            Go to Map
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <HugeiconsIcon icon={Home01Icon} size={20} />
            Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-gray-400 flex items-center gap-2">
        <HugeiconsIcon icon={Leaf01Icon} size={16} className="text-green-500" />
        EcoPulse - Community Environmental Action
      </p>
    </div>
  );
}
