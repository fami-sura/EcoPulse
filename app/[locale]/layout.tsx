import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import { routing } from '@/i18n/routing';
import { DesktopNav, MobileHeader } from '@/components/navigation';
import { AuthProvider } from '@/components/auth';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        {/* Desktop Navigation - hidden on mobile */}
        <DesktopNav />

        {/* Mobile Header with navigation and auth */}
        <MobileHeader />

        {/* Main content */}
        <main>{children}</main>

        {/* Toast notifications */}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
