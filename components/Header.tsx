'use client';

import { useState } from 'react';
import { Language, t } from '@/lib/i18n';
import { useTheme } from '@/lib/useTheme';
import Image from 'next/image';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ currentLang, onLanguageChange }: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ];

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange(lang);
    setMobileMenuOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="relative z-40 border-b-4 border-black bg-cream dark:bg-primary-blue-dark dark:border-white/30 dark:text-white">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-full">
        {/* Logo and Site Name */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-black bg-white dark:bg-white/10 flex items-center justify-center text-xl font-bold">
            U
          </div>
          <h1 className="text-lg sm:text-2xl font-black hidden sm:block">Uni Group Finder</h1>
        </div>

        {/* Desktop Language Selector */}
        <div className="hidden sm:flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                currentLang === lang.code
                  ? 'bg-yellow text-black'
                  : 'bg-cream dark:bg-primary-blue text-black dark:text-white hover:bg-yellow/80'
              }`}
              aria-label={`Switch to ${lang.label}`}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Theme Toggle and Mobile Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 border-2 border-black bg-cream dark:bg-primary-blue dark:border-white/30 hover:bg-yellow dark:hover:bg-yellow/80 transition-all rounded text-lg"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 border-2 border-black bg-cream dark:bg-primary-blue dark:border-white/30 hover:bg-yellow dark:hover:bg-yellow/80 transition-all"
            aria-label="Toggle language menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Language Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t-4 border-black dark:border-white/30 bg-cream dark:bg-primary-blue dark:text-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 font-bold text-left border-2 border-black transition-all ${
                  currentLang === lang.code
                    ? 'bg-yellow text-black'
                    : 'bg-cream dark:bg-primary-blue text-black dark:text-white hover:bg-yellow/80'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
