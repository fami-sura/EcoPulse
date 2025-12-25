import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

export default function IssueNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="rounded-full bg-red-50 p-4">
        <HugeiconsIcon icon={AlertCircleIcon} size={48} className="text-red-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Not Found</h1>
        <p className="mt-2 text-gray-600">
          This issue may have been removed or doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        Back to Map
      </Link>
    </div>
  );
}
