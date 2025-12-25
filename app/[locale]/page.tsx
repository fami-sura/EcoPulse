import { setRequestLocale } from 'next-intl/server';
import { IssueMap } from '@/components/map';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <IssueMap />;
}
