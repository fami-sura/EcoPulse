'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  SecurityCheckIcon,
  UserGroupIcon,
  ChartLineData02Icon,
  HeartCheckIcon,
  Leaf01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

// FAQ categories with their questions
const faqCategories = [
  {
    key: 'howItWorks',
    icon: UserGroupIcon,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    questions: ['reporting', 'verification', 'anonymous'],
  },
  {
    key: 'privacy',
    icon: SecurityCheckIcon,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    questions: ['dataCollection', 'photoPrivacy', 'deletion'],
  },
  {
    key: 'pilot',
    icon: ChartLineData02Icon,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    questions: ['pilotScope', 'partnership', 'metrics'],
  },
  {
    key: 'impact',
    icon: HeartCheckIcon,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    questions: ['resolution', 'sustainability', 'expansion'],
  },
] as const;

export function FAQContent() {
  const t = useTranslations('marketing.faq');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (itemKey: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-8">
              <HugeiconsIcon icon={Leaf01Icon} size={16} className="mr-2" />
              {t('hero.badge')}
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div
                key={category.key}
                className="bg-background rounded-2xl border border-border overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 p-6 border-b border-border bg-muted/30">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}
                  >
                    <HugeiconsIcon icon={category.icon} size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {t(`categories.${category.key}.title`)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t(`categories.${category.key}.description`)}
                    </p>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-border">
                  {category.questions.map((question) => {
                    const itemKey = `${category.key}-${question}`;
                    const isOpen = openItems.has(itemKey);

                    return (
                      <div key={question}>
                        <button
                          type="button"
                          onClick={() => toggle(itemKey)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                          aria-expanded={isOpen}
                          aria-controls={`faq-${itemKey}`}
                        >
                          <span className="text-base font-medium text-foreground">
                            {t(`categories.${category.key}.questions.${question}.q`)}
                          </span>
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={20}
                            className={cn(
                              'shrink-0 text-muted-foreground transition-transform duration-200',
                              isOpen && 'rotate-180'
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          id={`faq-${itemKey}`}
                          className={cn(
                            'overflow-hidden transition-all duration-200',
                            isOpen ? 'max-h-[500px]' : 'max-h-0'
                          )}
                          role="region"
                        >
                          <div className="px-6 pb-5">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {t(`categories.${category.key}.questions.${question}.a`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80">{t('cta.description')}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="min-h-12 px-8">
                <Link href="/contact">
                  {t('cta.contactButton')}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="min-h-12 px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/pilot">{t('cta.pilotButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
