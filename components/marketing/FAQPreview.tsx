'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

const faqItems = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export function FAQPreview() {
  const t = useTranslations('marketing.landing.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-muted/30 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {faqItems.map((item, index) => (
            <div key={item} className={cn(index !== 0 && 'border-t border-border')}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base font-medium text-foreground pr-4">
                  {t(`${item}.question`)}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={20}
                  className={cn(
                    'shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === index && 'rotate-180 text-primary'
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${item}.answer`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link to full FAQ */}
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
