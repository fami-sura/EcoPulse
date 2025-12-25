import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// This page redirects to the default locale
// With localePrefix: 'as-needed', the default locale doesn't have a prefix
// so this redirect ensures proper routing setup
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
