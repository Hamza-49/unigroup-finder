'use client';

import { useState, useEffect } from 'react';
import { Language, t } from '@/lib/i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function OnboardingModal({ isOpen, onClose, language }: OnboardingModalProps) {
  const [checked, setChecked] = useState(false);

  const handleClose = () => {
    if (checked) {
      localStorage.setItem('onboardingDismissed', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md bg-cream dark:bg-primary-blue-dark dark:text-white retro-border p-6 sm:p-8"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <h2 className="text-2xl sm:text-3xl font-black mb-4 text-center">{t(language, 'onboarding_title')}</h2>

        <p className="text-sm sm:text-base mb-6 text-center">{t(language, 'onboarding_desc')}</p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-lg sm:text-xl font-bold text-yellow flex-shrink-0">1.</span>
            <p className="text-sm sm:text-base">{t(language, 'onboarding_step1')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg sm:text-xl font-bold text-yellow flex-shrink-0">2.</span>
            <p className="text-sm sm:text-base">{t(language, 'onboarding_step2')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg sm:text-xl font-bold text-yellow flex-shrink-0">3.</span>
            <p className="text-sm sm:text-base">{t(language, 'onboarding_step3')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg sm:text-xl font-bold text-yellow flex-shrink-0">4.</span>
            <p className="text-sm sm:text-base">{t(language, 'onboarding_step4')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 border-2 border-black p-3 bg-white/50 dark:bg-black/20">
          <input
            type="checkbox"
            id="dont-show"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <label htmlFor="dont-show" className="text-sm cursor-pointer">
            {t(language, 'onboarding_dont_show')}
          </label>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-brown border-3 border-black text-white font-black py-3 px-4 hover:bg-yellow hover:text-black transition-all text-base sm:text-lg"
        >
          {t(language, 'onboarding_start_btn')}
        </button>
      </div>
    </div>
  );
}
