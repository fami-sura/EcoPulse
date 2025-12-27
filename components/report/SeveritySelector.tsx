'use client';

/**
 * SeveritySelector Component
 *
 * Icon-only severity selection using face emojis.
 *
 * @features
 * - 3 severity levels: Low, Medium, High
 * - Emoji faces only (no text labels)
 * - Touch-friendly buttons (60x60px)
 * - Default to Medium
 * - Scale animation on selection
 *
 * @accessibility
 * - aria-label for screen readers
 * - Keyboard navigable
 */

import { useCallback, useRef, KeyboardEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkBadge01Icon,
  AlertDiamondIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export type Severity = 'low' | 'medium' | 'high';

interface SeveritySelectorProps {
  /** Current selected severity */
  value?: Severity;
  /** Callback when severity changes */
  onChange: (severity: Severity) => void;
  /** Custom class names */
  className?: string;
}

const severities = [
  {
    id: 'low' as Severity,
    icon: CheckmarkBadge01Icon,
    label: 'Low',
    description: 'Minor issue',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary',
    iconColor: 'text-primary',
    ariaLabel: 'Low severity - minor issue',
  },
  {
    id: 'medium' as Severity,
    icon: AlertDiamondIcon,
    label: 'Medium',
    description: 'Moderate concern',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-600',
    ariaLabel: 'Medium severity - moderate concern',
  },
  {
    id: 'high' as Severity,
    icon: AlertCircleIcon,
    label: 'High',
    description: 'Urgent action needed',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive',
    iconColor: 'text-destructive',
    ariaLabel: 'High severity - urgent action needed',
  },
];

export function SeveritySelector({ value = 'medium', onChange, className }: SeveritySelectorProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (index + 1) % severities.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (index - 1 + severities.length) % severities.length;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onChange(severities[index].id);
          return;
      }

      if (nextIndex !== null) {
        buttonsRef.current[nextIndex]?.focus();
      }
    },
    [onChange]
  );

  return (
    <div
      className={cn('grid grid-cols-3 gap-3', className)}
      role="radiogroup"
      aria-label="Select issue severity"
    >
      {severities.map((severity, index) => {
        const isSelected = value === severity.id;

        return (
          <button
            key={severity.id}
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={severity.ariaLabel}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              isSelected
                ? `${severity.bgColor} ${severity.borderColor} shadow-md scale-[1.02]`
                : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
            )}
            onClick={() => onChange(severity.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg',
                isSelected ? severity.bgColor : 'bg-muted'
              )}
            >
              <HugeiconsIcon
                icon={severity.icon}
                size={24}
                className={isSelected ? severity.iconColor : 'text-muted-foreground'}
              />
            </div>
            <div className="text-center">
              <div
                className={cn(
                  'font-semibold text-sm',
                  isSelected ? severity.color : 'text-foreground'
                )}
              >
                {severity.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{severity.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default SeveritySelector;
