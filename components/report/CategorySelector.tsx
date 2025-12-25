'use client';

/**
 * CategorySelector Component
 *
 * Icon-only category selection for low-literacy accessibility.
 *
 * @features
 * - 2 MVP categories: Waste, Drainage
 * - Large touch-friendly cards (100x100px)
 * - NO text labels (icon-only design)
 * - Visual selection indicator
 * - Keyboard navigable
 *
 * @accessibility
 * - aria-label for screen readers
 * - Arrow key navigation
 * - Enter to select
 */

import { useCallback, useRef, KeyboardEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, DropletIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export type Category = 'waste' | 'drainage';

interface CategorySelectorProps {
  /** Current selected category */
  value?: Category;
  /** Callback when category changes */
  onChange: (category: Category) => void;
  /** Show error state (for validation) */
  error?: boolean;
  /** Custom class names */
  className?: string;
}

const categories = [
  {
    id: 'waste' as Category,
    icon: Delete02Icon,
    label: 'Report waste or litter issue',
  },
  {
    id: 'drainage' as Category,
    icon: DropletIcon,
    label: 'Report drainage or flood risk issue',
  },
];

export function CategorySelector({ value, onChange, error, className }: CategorySelectorProps) {
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
          nextIndex = (index + 1) % categories.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (index - 1 + categories.length) % categories.length;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onChange(categories[index].id);
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
      className={cn('flex flex-wrap justify-center gap-4', className)}
      role="radiogroup"
      aria-label="Select issue category"
    >
      {categories.map((category, index) => {
        const isSelected = value === category.id;
        const showError = error && !value;

        return (
          <button
            key={category.id}
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={category.label}
            className={cn(
              'flex h-25 w-25 items-center justify-center rounded-lg border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
              isSelected
                ? 'border-[3px] border-green-600 bg-green-50'
                : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              showError && 'animate-shake border-red-500'
            )}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <HugeiconsIcon
              icon={category.icon}
              size={32}
              color={isSelected ? '#059669' : '#6B7280'}
            />
          </button>
        );
      })}
    </div>
  );
}

export default CategorySelector;
