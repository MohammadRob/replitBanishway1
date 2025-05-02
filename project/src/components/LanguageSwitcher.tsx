import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Set RTL direction for Arabic
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const currentLanguage = i18n.language;
  const otherLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
  const otherLanguageLabel = currentLanguage === 'ar' ? t('common.english') : t('common.arabic');

  if (isMobile) {
    return (
      <button
        onClick={() => changeLanguage(otherLanguage)}
        className="flex w-full items-center rounded-md px-3 py-2 text-left text-base font-medium hover:bg-primary-600"
      >
        <Globe className="mr-2 h-5 w-5" />
        {otherLanguageLabel}
      </button>
    );
  }

  return (
    <button
      onClick={() => changeLanguage(otherLanguage)}
      className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600"
    >
      <Globe className="mr-2 h-5 w-5" />
      {otherLanguageLabel}
    </button>
  );
};

export default LanguageSwitcher;