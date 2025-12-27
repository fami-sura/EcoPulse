import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  return {
    title: t('actions'),
    description: 'Browse and participate in community environmental actions.',
  };
}

export default async function ActionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('navigation');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('actions')}</h1>

      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">
          Community actions feature coming soon! Here you&apos;ll be able to:
        </p>
        <ul className="mt-4 space-y-2 text-left max-w-md mx-auto text-gray-600">
          <li>• Browse local environmental initiatives</li>
          <li>• Join cleanup events</li>
          <li>• Track your participation</li>
          <li>• Earn points for community contributions</li>
        </ul>
      </div>
    </div>
  );
}
