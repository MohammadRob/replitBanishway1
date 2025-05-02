import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <AlertTriangle className="h-20 w-20 text-error-500" />
      <h1 className="mt-6 text-4xl font-bold text-gray-900">{t('errors.notFound')}</h1>
      <p className="mt-4 text-lg text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 rounded-md bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
      >
        {t('common.backToHome')}
      </button>
    </div>
  );
};

export default NotFoundPage;