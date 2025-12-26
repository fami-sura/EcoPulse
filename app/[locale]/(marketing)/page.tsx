import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Hero,
  ValuePillars,
  TheStakes,
  WhyWereDifferent,
  HowItWorks,
  ImpactGallery,
  PilotSnapshot,
  WhoItsFor,
  FAQPreview,
  CTABand,
  TeamGovernance,
  PartnershipsInProgress,
} from '@/components/marketing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.landing' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Emotional hook + 3 CTAs + trust indicators */}
      <Hero />

      {/* Value Pillars - Why EcoPulse (Privacy, Verification, Actionable, Africa-Native) */}
      <ValuePillars />

      {/* The Stakes - The problem we're solving */}
      <TheStakes />

      {/* Why We're Different - Differentiation from Western civic tech */}
      <WhyWereDifferent />

      {/* Verification Loop - 4-step process with "why it matters" */}
      <HowItWorks />

      {/* Pilot Use Cases - What the pilot will address */}
      <ImpactGallery />

      {/* Pilot Framework - 90-day timeline + target metrics */}
      <PilotSnapshot />

      {/* Who It's For - Tailored for communities, NGOs, civic */}
      <WhoItsFor />

      {/* FAQ Preview - Funder-specific questions */}
      <FAQPreview />

      {/* Team & Governance - Built responsibly */}
      <TeamGovernance />

      {/* Partnerships in Progress - Social proof placeholder */}
      <PartnershipsInProgress />

      {/* Final CTA Band - Multi-path conversion */}
      <CTABand />
    </div>
  );
}
