import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { IssueMap } from '@/components/map';
import { MapSkeleton } from '@/components/map/MapSkeleton';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MapPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<MapSkeleton />}>
      <IssueMap />
    </Suspense>
  );
}
