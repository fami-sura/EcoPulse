import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import IssueDetailClient from './IssueDetailClient';

interface IssuePageProps {
  params: Promise<{ locale: string; id: string }>;
}

/**
 * Fetch issue by ID from Supabase
 */
async function getIssue(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .eq('is_flagged', false)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params;

  const issue = await getIssue(id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
          </div>
        }
      >
        <IssueDetailClient issue={issue} />
      </Suspense>
    </div>
  );
}
