'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { submitContact } from '@/app/actions/submitContact';

export function ContactForm() {
  const t = useTranslations('marketing.contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const response = await submitContact(formData);

    setIsSubmitting(false);
    setResult({
      success: response.success,
      message: response.success ? t('success') : t('error'),
    });

    if (response.success) {
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t('form.name')}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('form.namePlaceholder')}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('form.email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('form.emailPlaceholder')}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">{t('form.organization')}</Label>
        <Input
          id="organization"
          name="organization"
          type="text"
          placeholder={t('form.organizationPlaceholder')}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t('form.message')}</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t('form.messagePlaceholder')}
          className="resize-none"
        />
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 text-sm ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
          role="alert"
        >
          {result.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full min-h-11">
        {isSubmitting ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
}
