import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { Bus, User, Lock } from 'lucide-react';
import { userAtom, loginUser } from '../store/auth';

interface LoginFormData {
  phoneNumber: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      phoneNumber: '',
      password: '',
    }
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const user = await loginUser(data.phoneNumber, data.password);
      setUser(user);
      
      // Redirect based on user role
      if (user.role === 'passenger') {
        navigate('/passenger/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      }
    } catch (error) {
      setLoginError(t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mx-auto flex max-w-md flex-col items-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <Bus className="h-12 w-12 text-primary-600" />
        <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
          {t('auth.login')} - {t('common.appName')}
        </h1>
        <p className="mt-2 text-center text-gray-600">
          {t('common.tagline')}
        </p>
      </div>
      
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        {loginError && (
          <div className="mb-4 rounded-md bg-error-50 p-3 text-error-700">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="label">
              {t('auth.phoneNumber')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                className="input w-full pl-10"
                placeholder="01XXXXXXXXX"
                {...register('phoneNumber', {
                  required: true,
                  pattern: /^01[0-9]{9}$/,
                })}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-error-600">
                {t('auth.phoneNumber')} {t('errors.isRequired')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="label">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="input w-full pl-10"
                placeholder="******"
                {...register('password', { required: true })}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-600">
                {t('auth.password')} {t('errors.isRequired')}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t('auth.rememberMe')}
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                {t('auth.forgotPassword')}?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.login')}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {t('auth.register')}?{' '}
          </span>
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            {t('auth.register')}
          </Link>
        </div>
      </div>
      
      {/* Demo credentials */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
        <h3 className="mb-2 font-semibold">Demo Credentials:</h3>
        <p><strong>Passenger:</strong> 01012345678</p>
        <p><strong>Driver:</strong> 01123456789</p>
        <p><strong>Manager:</strong> 01234567890</p>
        <p><strong>Password (all):</strong> 123456</p>
      </div>
    </div>
  );
};

export default LoginPage;