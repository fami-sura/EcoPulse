'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'footer';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 gap-1.5 text-muted-foreground hover:text-foreground',
              isPending && 'opacity-50',
              className
            )}
            disabled={isPending}
          >
            <HugeiconsIcon icon={Globe02Icon} size={16} />
            <span className="text-xs uppercase">{locale}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-30">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn('cursor-pointer gap-2', locale === lang.code && 'bg-muted font-medium')}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <HugeiconsIcon icon={Globe02Icon} size={16} className="text-muted-foreground" />
        <div className="flex items-center gap-1">
          {languages.map((lang, index) => (
            <span key={lang.code} className="flex items-center">
              {index > 0 && <span className="mx-1 text-muted-foreground/50">|</span>}
              <button
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending}
                className={cn(
                  'text-sm transition-colors hover:text-primary',
                  locale === lang.code ? 'font-medium text-primary' : 'text-muted-foreground',
                  isPending && 'opacity-50'
                )}
              >
                {lang.name}
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-2 border-muted-foreground/20',
            isPending && 'opacity-50',
            className
          )}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Globe02Icon} size={16} />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-35">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn('cursor-pointer gap-2', locale === lang.code && 'bg-muted font-medium')}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
