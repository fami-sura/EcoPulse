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
import { SmileIcon, NeutralIcon, SadIcon } from '@hugeicons/core-free-icons';
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
    icon: SmileIcon,
    color: '#10B981',
    bg: 'bg-green-500',
    label: 'Low severity',
  },
  {
    id: 'medium' as Severity,
    icon: NeutralIcon,
    color: '#F59E0B',
    bg: 'bg-amber-500',
    label: 'Medium severity',
  },
  {
    id: 'high' as Severity,
    icon: SadIcon,
    color: '#EF4444',
    bg: 'bg-red-500',
    label: 'High severity - urgent',
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
      className={cn('flex justify-center gap-3', className)}
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
            aria-label={severity.label}
            className={cn(
              'flex h-15 w-15 items-center justify-center rounded-lg border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isSelected
                ? `${severity.bg} scale-110 border-transparent focus:ring-${severity.bg.replace('bg-', '')}`
                : 'border-gray-200 bg-white hover:border-gray-300'
            )}
            onClick={() => onChange(severity.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <HugeiconsIcon
              icon={severity.icon}
              size={28}
              color={isSelected ? '#FFFFFF' : severity.color}
            />
          </button>
        );
      })}
    </div>
  );
}

export default SeveritySelector;
