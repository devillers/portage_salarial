'use client';

import { cn } from '../../lib/utils';
import { supportedLocales } from '../../lib/i18n';
import { useTranslation } from '../providers/LanguageProvider';

const orderedLocales = ['fr', 'en'];

export default function LanguageToggle({ className }) {
  const { locale, setLocale, t } = useTranslation('language');

  const localesToRender = orderedLocales.filter((code) => supportedLocales.includes(code));

  return (
    <div className={cn('flex items-center gap-2 text-xs uppercase tracking-wide', className)}>
      <span className="sr-only">{t('label')}</span>
      <div className="flex rounded-full border border-neutral-200 bg-white/80 shadow-sm overflow-hidden">
        {localesToRender.map((code) => {
          const isActive = locale === code;
          const labelKey = code === 'fr' ? 'french' : code === 'en' ? 'english' : `short.${code}`;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                'px-3 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'bg-transparent text-neutral-600 hover:text-primary-700'
              )}
              aria-pressed={isActive}
              aria-label={t(labelKey)}
            >
              {t(`short.${code}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
