/**
 * Auth Pages Layout
 *
 * Shared layout for all auth pages (login, signup, magic-link, etc.)
 * Provides centered card layout.
 */

import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
