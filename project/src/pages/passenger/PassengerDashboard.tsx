import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { 
  reservationsAtom, 
  getReservationsByUser, 
  addReservation 
} from '../../store/reservations';
import ReservationForm from '../../components/ReservationForm';
import ReservationCard from '../../components/ReservationCard';
import { Reservation } from '../../types';

const PassengerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations] = useAtom(reservationsAtom);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Ensure user exists and is a passenger
  if (!user || user.role !== 'passenger') {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    if (user) {
      const filtered = getReservationsByUser(reservations, user.id, user.role);
      setUserReservations(filtered);
    }
  }, [user, reservations]);
  
  const handleCreateReservation = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const newReservation = await addReservation(
        user.id,
        user.name,
        user.phoneNumber || '',
        data.destination,
        data.tripType,
        data.date
      );
      
      // In a real app, we would update the state with the new reservation
      // For now, just show success message and reset form
      setShowSuccess(true);
      setIsCreating(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get upcoming reservations (today or future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingReservations = userReservations.filter(res => {
    const resDate = new Date(res.date);
    resDate.setHours(0, 0, 0, 0);
    return resDate >= today;
  });
  
  // Get past reservations
  const pastReservations = userReservations.filter(res => {
    const resDate = new Date(res.date);
    resDate.setHours(0, 0, 0, 0);
    return resDate < today;
  });
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('navigation.dashboard')}
        </h1>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn btn-primary"
        >
          {isCreating ? t('common.cancel') : t('passenger.newReservation')}
        </button>
      </div>
      
      {showSuccess && (
        <div className="mb-6 rounded-md bg-success-50 p-4 text-success-800">
          <p className="font-medium">{t('reservation.success')}</p>
        </div>
      )}
      
      {isCreating ? (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {t('passenger.newReservation')}
          </h2>
          <ReservationForm
            onSubmit={handleCreateReservation}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="mb-4 flex items-center text-xl font-semibold">
              <Calendar className="mr-2 h-5 w-5 text-primary-600" />
              {t('passenger.upcomingTrips')}
            </h2>
            
            {upcomingReservations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {upcomingReservations.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">{t('passenger.noReservations')}</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 rounded-md bg-primary-100 px-4 py-2 font-medium text-primary-700 hover:bg-primary-200"
                >
                  {t('passenger.newReservation')}
                </button>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="mb-4 flex items-center text-xl font-semibold">
              <Clock className="mr-2 h-5 w-5 text-secondary-600" />
              {t('passenger.tripHistory')}
            </h2>
            
            {pastReservations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {pastReservations.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">{t('passenger.noReservations')}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PassengerDashboard;