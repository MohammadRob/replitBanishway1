import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { Bus, User, Lock, Phone } from 'lucide-react';
import { userAtom, registerUser } from '../store/auth';

interface RegisterFormData {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  // For password confirmation validation
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setRegisterError(null);
    
    try {
      // Only passenger registration is allowed from the frontend
      const user = await registerUser(data.name, data.phoneNumber, data.password, 'passenger');
      setUser(user);
      navigate('/passenger/dashboard');
    } catch (error) {
      setRegisterError(t('auth.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mx-auto flex max-w-md flex-col items-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <Bus className="h-12 w-12 text-primary-600" />
        <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
          {t('auth.register')} - {t('common.appName')}
        </h1>
        <p className="mt-2 text-center text-gray-600">
          {t('common.tagline')}
        </p>
      </div>
      
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        {registerError && (
          <div className="mb-4 rounded-md bg-error-50 p-3 text-error-700">
            {registerError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">
              {t('auth.name')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                className="input w-full pl-10"
                placeholder={t('auth.name')}
                {...register('name', {
                  required: true,
                  minLength: 3,
                })}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-error-600">
                {t('auth.name')} {t('errors.isRequired')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="label">
              {t('auth.phoneNumber')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
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
                {...register('password', {
                  required: true,
                  minLength: 6,
                })}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-600">
                {t('auth.password')} {t('errors.isRequired')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm {t('auth.password')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className="input w-full pl-10"
                placeholder="******"
                {...register('confirmPassword', {
                  required: true,
                  validate: value => value === password || "Passwords don't match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600">
                Passwords don't match
              </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.register')}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {t('auth.login')}?{' '}
          </span>
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            {t('auth.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;