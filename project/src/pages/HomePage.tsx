import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bus, Calendar, MapPin, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-700 to-primary-900 py-16 px-6 text-white md:px-12">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1426516/pexels-photo-1426516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Bus className="mb-4 h-16 w-16" />
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('common.appName')}</h1>
          <p className="mb-8 max-w-2xl text-lg text-primary-100">{t('common.tagline')}</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-lg border border-white bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('auth.register')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-0">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          {t('home.ourServices')}
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t('home.easyReservations.title')}</h3>
            <p className="text-gray-600">{t('home.easyReservations.desc')}</p>
          </div>

          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t('home.multipleDestinations.title')}</h3>
            <p className="text-gray-600">{t('home.multipleDestinations.desc')}</p>
          </div>

          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t('home.secureReliable.title')}</h3>
            <p className="text-gray-600">{t('home.secureReliable.desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t('home.howItWorks')}
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t('home.step1.title')}</h3>
                <p className="text-gray-600">{t('home.step1.desc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t('home.step2.title')}</h3>
                <p className="text-gray-600">{t('home.step2.desc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t('home.step3.title')}</h3>
                <p className="text-gray-600">{t('home.step3.desc')}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/register')}
              className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              {t('home.getStarted')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
