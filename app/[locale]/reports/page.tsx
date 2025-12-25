import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import ReportsListClient from '@/app/[locale]/reports/ReportsListClient';

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Fetch user's reports from Supabase
 */
async function getUserReports(userId: string | null) {
  const supabase = await createClient();

  let query = supabase
    .from('issues')
    .select(
      'id, photos, lat, lng, address, category, severity, status, note, created_at, verification_count'
    )
    .order('created_at', { ascending: false });

  // For authenticated users, fetch by user_id
  // For anonymous users, this will return empty (they need to log in to see reports)
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    // Return empty for anonymous - they need to sign in
    return [];
  }

  const { data, error } = await query.limit(50);

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  return data || [];
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  await params; // Consume params for Next.js

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reports = await getUserReports(user?.id || null);

  // Get translations on the server
  const t = await getTranslations('reports');
  const tNav = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
          </div>
        }
      >
        <ReportsListClient
          reports={reports}
          isAuthenticated={!!user}
          translations={{
            title: t('title'),
            publicTitle: t('publicTitle'),
            totalReports: t('totalReports', { count: reports.length }),
            newReport: t('newReport'),
            noReports: t('noReports'),
            noReportsDescription: t('noReportsDescription'),
            noFilteredReports: t('noFilteredReports'),
            noFilteredReportsDescription: t('noFilteredReportsDescription'),
            submitFirstReport: t('submitFirstReport'),
            loginRequired: t('loginRequired'),
            loginDescription: t('loginDescription'),
            viewDetails: t('viewDetails'),
          }}
          navTranslations={{
            login: tNav('login'),
          }}
        />
      </Suspense>
    </div>
  );
}
