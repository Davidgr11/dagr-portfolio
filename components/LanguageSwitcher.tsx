'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';

const languages = {
  en: { name: 'English', flag: '🇺🇸', short: 'EN' },
  es: { name: 'Español', flag: '🇪🇸', short: 'ES' },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLanguage = languages[locale as keyof typeof languages];
  const otherLocale = locale === 'en' ? 'es' : 'en';
  const otherLanguage = languages[otherLocale as keyof typeof languages];

  return (
    <button
      onClick={switchLanguage}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
      aria-label={`Switch to ${otherLanguage.name}`}
    >
      <Languages className="h-4 w-4 text-white group-hover:text-cyan-400 transition-colors" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white hidden sm:inline">
          {currentLanguage.name}
        </span>
        <span className="text-sm font-medium text-white sm:hidden">
          {currentLanguage.short}
        </span>
        <span className="text-white/40 hidden sm:inline">→</span>
        <span className="text-sm text-white/60 group-hover:text-cyan-400 transition-colors hidden sm:inline">
          {otherLanguage.name}
        </span>
        <span className="text-sm text-white/60 group-hover:text-cyan-400 transition-colors sm:hidden">
          {otherLanguage.short}
        </span>
      </div>
    </button>
  );
}
