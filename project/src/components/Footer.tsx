import { useTranslation } from 'react-i18next';
import { Bus } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center">
            <Bus className="h-6 w-6" />
            <span className="ml-2 text-lg font-semibold">{t('common.appName')}</span>
          </div>
          
          <div className="text-center text-sm text-primary-100 md:text-right">
            <p>&copy; {currentYear} {t('common.appName')} - {t('common.tagline')}</p>
            <p className="mt-1">{t('EbnulkhayrTech')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;