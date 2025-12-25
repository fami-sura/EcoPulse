import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

type Props = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: Props) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
