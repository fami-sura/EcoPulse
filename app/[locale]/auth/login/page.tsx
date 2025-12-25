import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { Leaf01Icon } from '@hugeicons/core-free-icons';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string; error?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.login' });

  return {
    title: t('title'),
    description: 'Log in to your ecoPulse account to manage your reports and track your impact.',
  };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirect, error } = await searchParams;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('auth.login');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <HugeiconsIcon icon={Leaf01Icon} size={28} className="text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>Welcome back! Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display error from auth callback (e.g., expired magic link) */}
          {error && (
            <div
              role="alert"
              className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
            >
              {decodeURIComponent(error)}
            </div>
          )}
          <LoginForm redirectTo={redirect || '/'} />
        </CardContent>
      </Card>
    </div>
  );
}
