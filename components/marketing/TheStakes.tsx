import { useTranslations } from 'next-intl';
import { Alert02Icon, Sad01Icon, Target01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const challenges = [
  { icon: Alert02Icon, key: 'flooding' },
  { icon: Sad01Icon, key: 'health' },
  { icon: Target01Icon, key: 'scattered' },
] as const;

export function TheStakes() {
  const t = useTranslations('marketing.landing.stakes');

  return (
    <section className="bg-secondary py-16 sm:py-24 text-secondary-foreground overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: The Problem */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl mb-6">
              {t('title')}
            </h2>
            <blockquote className="text-lg text-secondary-foreground/90 leading-relaxed border-l-4 border-primary/50 pl-6 italic">
              {t('quote')}
            </blockquote>

            {/* Challenge bullets */}
            <div className="mt-8 space-y-4">
              {challenges.map((item) => (
                <div key={item.key} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary-foreground">
                    <HugeiconsIcon icon={item.icon} size={20} aria-hidden="true" />
                  </div>
                  <p className="text-secondary-foreground/80 pt-2">{t(`challenges.${item.key}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Solution Bridge */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-10 ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={20}
                  className="text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-secondary-foreground">{t('solution.title')}</h3>
            </div>

            <p className="text-lg text-secondary-foreground/90 leading-relaxed mb-8">
              {t('solution.description')}
            </p>

            {/* Solution bullets */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{t('solution.bullet1')}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{t('solution.bullet2')}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{t('solution.bullet3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
