/**
 * Auth Pages Layout
 *
 * Shared layout for all auth pages (login, signup, magic-link, etc.)
 * Includes marketing header for navigation and branding consistency.
 */

import { setRequestLocale } from 'next-intl/server';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <MarketingHeader />
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  );
}
