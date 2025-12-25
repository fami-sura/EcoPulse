import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SignupForm } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EcoPulseIcon } from '@/components/brand';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signup' });

  return {
    title: t('title'),
    description: 'Create an ecoPulse account to report environmental issues and track your impact.',
  };
}

export default async function SignupPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirect } = await searchParams;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('auth.signup');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <EcoPulseIcon size="lg" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>Join the community and start making a difference</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm redirectTo={redirect || '/'} />
        </CardContent>
      </Card>
    </div>
  );
}
