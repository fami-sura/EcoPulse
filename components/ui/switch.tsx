'use client';

/**
 * Switch Component
 *
 * Toggle switch for boolean settings.
 * Based on Radix UI Switch primitive.
 *
 * @accessibility
 * - Keyboard accessible (Space/Enter to toggle)
 * - ARIA labels supported
 * - Focus visible styling
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  /** Whether the switch is checked */
  checked?: boolean;
  /** Callback when the switch is toggled */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Accessible label */
  'aria-label'?: string;
  /** Additional class names */
  className?: string;
  /** ID for the switch */
  id?: string;
  /** Name for form submission */
  name?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  'aria-label': ariaLabel,
  className,
  id,
  name,
}: SwitchProps) {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      name={name}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-green-600' : 'bg-gray-200',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0',
          'transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

export default Switch;
