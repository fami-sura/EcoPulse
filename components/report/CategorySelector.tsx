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
import { Delete02Icon, DropletIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
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
    label: 'Waste/Litter',
    description: 'Report waste or litter issue',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'drainage' as Category,
    icon: DropletIcon,
    label: 'Drainage',
    description: 'Report drainage or flood risk issue',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
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
      className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}
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
            aria-label={category.description}
            className={cn(
              'flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                : 'border-border bg-card hover:border-primary/30 hover:shadow-sm',
              showError && 'animate-shake border-destructive'
            )}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-lg shrink-0',
                isSelected ? category.bgColor : 'bg-muted'
              )}
            >
              <HugeiconsIcon
                icon={category.icon}
                size={28}
                className={cn(isSelected ? category.color : 'text-muted-foreground')}
              />
            </div>
            <div className="flex-1 text-left">
              <div
                className={cn(
                  'font-semibold text-base',
                  isSelected ? 'text-foreground' : 'text-foreground'
                )}
              >
                {category.label}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {isSelected ? 'Selected' : 'Tap to select'}
              </div>
            </div>
            {isSelected && (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={24}
                className="text-primary shrink-0"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategorySelector;
