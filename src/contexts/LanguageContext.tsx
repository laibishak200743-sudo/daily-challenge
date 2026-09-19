import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { translations, Language } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('wanderwise-language');

    if (
      saved === 'en' ||
      saved === 'ar' ||
      saved === 'fr' ||
      saved === 'es'
    ) {
      return saved;
    }

    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wanderwise-language', lang);
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const t = (key: string) => {
    return (
      translations[language]?.[key] ??
      translations.en?.[key] ??
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false,
    };
  }

  return context;
}
