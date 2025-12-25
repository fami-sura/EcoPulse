/**
 * My Reports Page
 *
 * Displays user's submitted reports with:
 * - Report statistics (total, verified, rate, avg time)
 * - Filterable and sortable list of reports
 * - Pagination (20 per page)
 *
 * Story 2.1.9 - Verification Analytics for Reporters
 */

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ReportStats } from '@/components/profile/ReportStats';
import { MyReportsList } from '@/components/profile/MyReportsList';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    filter?: string;
  }>;
}

/** Page size for reports list */
const PAGE_SIZE = 20;

export async function generateMetadata() {
  const t = await getTranslations('profile');
  return {
    title: t('reports.title'),
    description: t('reports.description'),
  };
}

export default async function MyReportsPage({ searchParams }: PageProps) {
  const t = await getTranslations('profile');
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login?redirect=/profile/reports');
  }

  // Parse search params (await in Next.js 16)
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const currentSort = params.sort || 'recent';
  const currentFilter = params.filter || 'all';

  // Fetch stats and reports in parallel
  const [stats, { reports, totalCount }] = await Promise.all([
    getUserReportStats(supabase, user.id),
    getUserReports(supabase, user.id, currentPage, currentSort, currentFilter),
  ]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('reports.title')}
      </h1>

      {/* Stats Cards */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <ReportStats stats={stats} />
      </Suspense>

      {/* Reports List */}
      <Suspense fallback={<ListLoadingSkeleton />}>
        <MyReportsList
          reports={reports}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          currentSort={currentSort}
          currentFilter={currentFilter}
        />
      </Suspense>
    </div>
  );
}

/**
 * Fetch user report statistics
 */
async function getUserReportStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  // Total reports
  const { count: totalReports } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Verified reports (verification_count >= 2)
  const { count: verifiedReports } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('verification_count', 2);

  // Calculate verification rate
  const total = totalReports || 0;
  const verified = verifiedReports || 0;
  const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  // Average verification speed (time from issue creation to 2nd verification)
  const avgVerificationHours = await calculateAvgVerificationTime(supabase, userId);

  return {
    totalReports: total,
    verifiedReports: verified,
    verificationRate,
    avgVerificationHours,
  };
}

/**
 * Calculate average time to reach 2nd verification
 */
async function calculateAvgVerificationTime(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  try {
    // Get verified issues with their verifications
    const { data: verifiedIssues, error } = await supabase
      .from('issues')
      .select(
        `
        id,
        created_at,
        verifications (
          created_at
        )
      `
      )
      .eq('user_id', userId)
      .gte('verification_count', 2)
      .limit(50);

    if (error || !verifiedIssues || verifiedIssues.length === 0) {
      return 0;
    }

    const verificationTimes: number[] = [];

    for (const issue of verifiedIssues) {
      const verifications = issue.verifications as Array<{ created_at: string }>;
      if (!verifications || verifications.length < 2) continue;

      // Sort verifications by date
      const sortedVerifications = verifications.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Calculate time from issue creation to 2nd verification
      const issueTime = new Date(issue.created_at).getTime();
      const secondVerificationTime = new Date(sortedVerifications[1].created_at).getTime();
      const hoursToVerify = (secondVerificationTime - issueTime) / (1000 * 60 * 60);

      if (hoursToVerify > 0) {
        verificationTimes.push(hoursToVerify);
      }
    }

    if (verificationTimes.length === 0) {
      return 0;
    }

    // Calculate average
    const avg = verificationTimes.reduce((a, b) => a + b, 0) / verificationTimes.length;
    return Math.round(avg);
  } catch (error) {
    console.error('Error calculating avg verification time:', error);
    return 0;
  }
}

/**
 * Fetch user reports with filtering, sorting, and pagination
 */
async function getUserReports(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  page: number,
  sort: string,
  filter: string
) {
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from('issues')
    .select(
      `
      id,
      category,
      severity,
      status,
      verification_count,
      created_at,
      address,
      photos,
      verifications (
        verifier:users!verifier_id (
          username,
          avatar_url
        )
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', userId);

  // Apply filter
  switch (filter) {
    case 'pending':
      query = query.lt('verification_count', 2).eq('status', 'pending');
      break;
    case 'verified':
      query = query.gte('verification_count', 2);
      break;
    case 'resolved':
      query = query.eq('status', 'resolved');
      break;
    // 'all' - no filter
  }

  // Apply sorting
  switch (sort) {
    case 'verified':
      query = query.order('verification_count', { ascending: false });
      break;
    case 'pending':
      query = query.order('verification_count', { ascending: true });
      break;
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: reports, count, error } = await query;

  if (error) {
    console.error('Error fetching user reports:', error);
    return { reports: [], totalCount: 0 };
  }

  return {
    reports: reports || [],
    totalCount: count || 0,
  };
}

/**
 * Loading skeleton for stats
 */
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
        >
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse" />
          <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for reports list
 */
function ListLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="w-36 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-36 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex-1">
              <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="w-48 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-4 animate-pulse" />
              <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
