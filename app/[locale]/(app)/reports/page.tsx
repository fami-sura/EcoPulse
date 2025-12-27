import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import ReportsListClient from './ReportsListClient';

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Fetch all public reports from Supabase
 * This shows ALL reports in the system (not just user's reports)
 */
async function getAllReports() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('issues')
    .select(
      'id, photos, lat, lng, address, category, severity, status, note, created_at, verification_count, is_flagged'
    )
    .eq('is_flagged', false) // Only show non-flagged reports
    .order('created_at', { ascending: false })
    .limit(100); // Limit to 100 most recent reports

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

  // Fetch ALL public reports (not just user's reports)
  const reports = await getAllReports();

  // Get translations on the server
  const t = await getTranslations('reports');
  const tNav = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
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
