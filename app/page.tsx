'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { GroupForm } from '@/components/GroupForm';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { DecorativeElements } from '@/components/DecorativeElements';
import { Language } from '@/lib/i18n';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    const onboardingDismissed = localStorage.getItem('onboardingDismissed') === 'true';
    
    if (savedLang) {
      setLanguage(savedLang);
    }

    if (!onboardingDismissed) {
      setShowOnboarding(true);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <DecorativeElements />
      <div className="relative z-10">
        <Header currentLang={language} onLanguageChange={handleLanguageChange} />

        <main className="flex-1 py-8 sm:py-12">
          <GroupForm language={language} />
        </main>

        <Footer />
      </div>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        language={language}
      />
    </div>
  );
}
