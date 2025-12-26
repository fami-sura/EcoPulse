import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FAQContent } from './FAQContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.faq' });

  const canonical = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(`/${locale}/faq`, process.env.NEXT_PUBLIC_APP_URL).toString()
    : undefined;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: canonical,
    },
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FAQContent />;
}
