import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { userAtom } from '../store/auth';
import { Destination, TripType } from '../types';

interface ReservationFormData {
  destination: Destination;
  tripType: TripType;
  date: string;
}

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void;
  isSubmitting: boolean;
}

const ReservationForm = ({ onSubmit, isSubmitting }: ReservationFormProps) => {
  const { t } = useTranslation();
  const [user] = useAtom(userAtom);
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>({
    defaultValues: {
      destination: 'sharq',
      tripType: 'one-way-going',
      date: new Date().toISOString().split('T')[0],
    }
  });
  
  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  const handleFormSubmit = (data: ReservationFormData) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="destination" className="label">
          {t('reservation.destination')}
        </label>
        <select
          id="destination"
          className="select w-full"
          {...register('destination', { required: true })}
        >
          <option value="sharq">{t('reservation.destinations.sharq')}</option>
          <option value="gharb">{t('reservation.destinations.gharb')}</option>
          <option value="demo">{t('reservation.destinations.demo')}</option>
        </select>
        {errors.destination && (
          <p className="mt-1 text-sm text-error-600">
            {t('reservation.destination')} {t('errors.isRequired')}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="tripType" className="label">
          {t('reservation.tripType')}
        </label>
        <select
          id="tripType"
          className="select w-full"
          {...register('tripType', { required: true })}
        >
          <option value="one-way-going">{t('reservation.tripTypes.oneWayGoing')}</option>
          <option value="one-way-returning">{t('reservation.tripTypes.oneWayReturning')}</option>
          <option value="round-trip">{t('reservation.tripTypes.roundTrip')}</option>
        </select>
        {errors.tripType && (
          <p className="mt-1 text-sm text-error-600">
            {t('reservation.tripType')} {t('errors.isRequired')}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="date" className="label">
          {t('reservation.date')}
        </label>
        <input
          id="date"
          type="date"
          className="input w-full"
          min={minDate}
          max={maxDateStr}
          {...register('date', { required: true })}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-error-600">
            {t('reservation.date')} {t('errors.isRequired')}
          </p>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common.loading') : t('reservation.new')}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;