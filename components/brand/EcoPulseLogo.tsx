'use client';

/**
 * EcoPulseLogo Component
 *
 * Official EcoPulse brand logo component with multiple variants.
 * Uses the official SVG logo for consistent branding across the app.
 *
 * @variants
 * - full: Logo icon + "EcoPulse" wordmark + optional tagline
 * - icon: Logo icon only (for favicon, mobile, compact spaces)
 * - wordmark: "EcoPulse" text only
 */

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type LogoVariant = 'full' | 'icon' | 'wordmark';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface EcoPulseLogoProps {
  /** Logo display variant */
  variant?: LogoVariant;
  /** Size preset */
  size?: LogoSize;
  /** Show tagline (only for 'full' variant) */
  showTagline?: boolean;
  /** Custom tagline text */
  tagline?: string;
  /** Additional CSS classes */
  className?: string;
  /** Icon-only additional classes */
  iconClassName?: string;
  /** Text additional classes */
  textClassName?: string;
}

const sizeConfig: Record<
  LogoSize,
  {
    iconSize: number;
    textClass: string;
    taglineClass: string;
    gap: string;
  }
> = {
  xs: {
    iconSize: 42,
    textClass: 'text-sm',
    taglineClass: 'text-[8px]',
    gap: 'gap-1.5',
  },
  sm: {
    iconSize: 55,
    textClass: 'text-base',
    taglineClass: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    iconSize: 66,
    textClass: 'text-xl',
    taglineClass: 'text-[10px]',
    gap: 'gap-2',
  },
  lg: {
    iconSize: 80,
    textClass: 'text-2xl',
    taglineClass: 'text-xs',
    gap: 'gap-2.5',
  },
  xl: {
    iconSize: 90,
    textClass: 'text-3xl',
    taglineClass: 'text-sm',
    gap: 'gap-3',
  },
};

export function EcoPulseLogo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  tagline = 'Community Verified',
  className,
  iconClassName,
  textClassName,
}: EcoPulseLogoProps) {
  const config = sizeConfig[size];

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Image
          src="/ecoPulse-no-background.png"
          alt="EcoPulse"
          width={config.iconSize}
          height={config.iconSize}
          className={cn('h-auto w-auto object-contain', iconClassName)}
          priority
        />
      </div>
    );
  }

  // Wordmark-only variant
  if (variant === 'wordmark') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span
          className={cn(
            config.textClass,
            'font-semibold text-foreground leading-none tracking-tight',
            textClassName
          )}
        >
          EcoPulse
        </span>
        {showTagline && (
          <span
            className={cn(
              config.taglineClass,
              'font-medium text-muted-foreground uppercase tracking-widest mt-0'
            )}
          >
            {tagline}
          </span>
        )}
      </div>
    );
  }

  // Full variant (default): icon + wordmark
  return (
    <div className={cn('flex items-center', config.gap, className)}>
      <Image
        src="/ecoPulse-no-background.png"
        alt=""
        width={config.iconSize}
        height={config.iconSize}
        className={cn('h-auto w-auto object-contain', iconClassName)}
        aria-hidden="true"
        priority
      />
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            config.textClass,
            'font-semibold text-foreground leading-none tracking-tight',
            textClassName
          )}
        >
          EcoPulse
        </span>
        {showTagline && (
          <span
            className={cn(
              config.taglineClass,
              'font-medium text-muted-foreground uppercase tracking-widest mt-0'
            )}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Compact icon for use in tight spaces (mobile nav, badges, etc.)
 */
export function EcoPulseIcon({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  return <EcoPulseLogo variant="icon" size={size} className={className} />;
}

export default EcoPulseLogo;
