import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MagicLinkForm } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.magicLink' });

  return {
    title: t('title'),
    description: 'Log in to ecoPulse with a magic link - no password required.',
  };
}

export default async function MagicLinkPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirect } = await searchParams;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('auth.magicLink');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-2xl" role="img" aria-hidden="true">
              ✨
            </span>
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MagicLinkForm redirectTo={redirect || '/'} />
        </CardContent>
      </Card>
    </div>
  );
}
