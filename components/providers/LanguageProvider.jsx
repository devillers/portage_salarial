'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, translations, supportedLocales } from '../../lib/i18n';

const STORAGE_KEY = 'chalet-manager-language';

const LanguageContext = createContext(null);

function getNestedValue(object, key) {
  if (!object || !key) {
    return object;
  }

  return key.split('.').reduce((acc, segment) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, segment)) {
      return acc[segment];
    }
    return undefined;
  }, object);
}

export function LanguageProvider({ children, initialLocale }) {
  const [locale, setLocale] = useState(() => {
    if (initialLocale && supportedLocales.includes(initialLocale)) {
      return initialLocale;
    }
    return defaultLocale;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (storedLocale && supportedLocales.includes(storedLocale)) {
      setLocale(storedLocale);
      return;
    }

    const browserLocale = window.navigator.language?.slice(0, 2).toLowerCase();
    if (browserLocale && supportedLocales.includes(browserLocale)) {
      setLocale(browserLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const dictionary = useMemo(() => {
    return translations[locale] ?? translations[defaultLocale];
  }, [locale]);

  const translate = useCallback(
    (key, fallback) => {
      if (!key) {
        return dictionary;
      }
      const value = getNestedValue(dictionary, key);
      if (value === undefined) {
        return fallback ?? key;
      }
      return value;
    },
    [dictionary]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dictionary,
      translate
    }),
    [dictionary, locale, translate]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation(namespace) {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { locale, setLocale, dictionary, translate } = context;

  const content = useMemo(() => {
    if (!namespace) {
      return dictionary;
    }
    const section = translate(namespace);
    return typeof section === 'object' && section !== null ? section : {};
  }, [dictionary, namespace, translate]);

  const t = useCallback(
    (key, fallback) => {
      if (!namespace) {
        return translate(key, fallback);
      }
      if (!key) {
        return content;
      }
      const value = getNestedValue(content, key);
      if (value === undefined) {
        return fallback ?? key;
      }
      return value;
    },
    [content, namespace, translate]
  );

  return {
    locale,
    setLocale,
    t,
    content
  };
}
