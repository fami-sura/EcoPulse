import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { FloatingContactCTA } from '@/components/marketing/FloatingContactCTA';
import { ScrollProgress } from '@/components/marketing/ScrollProgress';
import { SkipToContent } from '@/components/marketing/SkipToContent';
import { StructuredData } from '@/components/marketing/StructuredData';

type Props = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: Props) {
  return (
    <>
      {/* Accessibility: Skip to content link */}
      <SkipToContent />

      {/* SEO: Structured data for Organization */}
      <StructuredData />

      {/* Visual: Scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      <MarketingHeader />

      {/* Main content */}
      <main id="main-content">{children}</main>

      {/* Conversion: Floating contact CTA */}
      <FloatingContactCTA />

      {/* Footer */}
      <MarketingFooter />
    </>
  );
}
