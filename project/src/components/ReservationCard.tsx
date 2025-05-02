import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { 
  Calendar, MapPin, ArrowRight, RotateCcw, Check, X, DollarSign 
} from 'lucide-react';
import { Reservation, UserRole } from '../types';
import { userAtom } from '../store/auth';

interface ReservationCardProps {
  reservation: Reservation;
  onAttendClick?: (reservationId: string, attended: boolean) => void;
  onPaymentClick?: (reservationId: string, paid: boolean) => void;
}

const ReservationCard = ({ 
  reservation, 
  onAttendClick, 
  onPaymentClick 
}: ReservationCardProps) => {
  const { t } = useTranslation();
  const [user] = useAtom(userAtom);
  
  const getTripTypeIcon = () => {
    switch (reservation.tripType) {
      case 'one-way-going':
        return <ArrowRight className="h-5 w-5" />;
      case 'one-way-returning':
        return <ArrowRight className="h-5 w-5 direction-aware" />;
      case 'round-trip':
        return <RotateCcw className="h-5 w-5" />;
      default:
        return <ArrowRight className="h-5 w-5" />;
    }
  };
  
  const getTripTypeLabel = () => {
    switch (reservation.tripType) {
      case 'one-way-going':
        return t('reservation.tripTypes.oneWayGoing');
      case 'one-way-returning':
        return t('reservation.tripTypes.oneWayReturning');
      case 'round-trip':
        return t('reservation.tripTypes.roundTrip');
      default:
        return '';
    }
  };
  
  const getDestinationLabel = () => {
    switch (reservation.destination) {
      case 'sharq':
        return t('reservation.destinations.sharq');
      case 'gharb':
        return t('reservation.destinations.gharb');
      case 'demo':
        return t('reservation.destinations.demo');
      default:
        return '';
    }
  };
  
  const getDestinationColor = () => {
    switch (reservation.destination) {
      case 'sharq':
        return 'bg-blue-100 text-blue-800';
      case 'gharb':
        return 'bg-green-100 text-green-800';
      case 'demo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusColor = () => {
    return reservation.paymentStatus === 'paid'
      ? 'bg-success-100 text-success-800'
      : 'bg-error-100 text-error-800';
  };
  
  const getPaymentStatusLabel = () => {
    return reservation.paymentStatus === 'paid'
      ? t('reservation.paymentStatuses.paid')
      : t('reservation.paymentStatuses.unpaid');
  };
  
  const handleAttendClick = () => {
    if (onAttendClick) {
      onAttendClick(reservation.id, !reservation.attended);
    }
  };
  
  const handlePaymentClick = () => {
    if (onPaymentClick) {
      onPaymentClick(reservation.id, reservation.paymentStatus === 'unpaid');
    }
  };
  
  const formattedDate = new Date(reservation.date).toLocaleDateString(
    user?.role === 'passenger' ? 'en-US' : 'ar-EG',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
  
  return (
    <div className="card overflow-hidden transition-all hover:translate-y-[-2px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary-600" />
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
        
        <div className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor()}`}>
          {getPaymentStatusLabel()}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-secondary-600" />
          <div className={`rounded-md px-2 py-1 text-sm font-medium ${getDestinationColor()}`}>
            {getDestinationLabel()}
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex items-center">
        <div className="mr-2 text-accent-600">
          {getTripTypeIcon()}
        </div>
        <span className="text-sm">{getTripTypeLabel()}</span>
      </div>
      
      {(user?.role === 'driver' || user?.role === 'manager') && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">{t('reservation.passenger')}:</p>
          <p className="text-sm">{reservation.passengerName}</p>
          <p className="text-sm text-gray-500">{reservation.passengerPhone}</p>
        </div>
      )}
      
      {user?.role === 'passenger' && reservation.driverName && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">{t('reservation.driver')}:</p>
          <p className="text-sm">{reservation.driverName}</p>
        </div>
      )}
      
      <div className="mb-2 flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">{t('reservation.price')}:</p>
          <p className="text-lg font-semibold text-primary-700">
            {reservation.paymentAmount} EGP
          </p>
        </div>
        
        {user?.role === 'driver' && (
          <div className="flex space-x-2">
            {onAttendClick && (
              <button
                onClick={handleAttendClick}
                className={`btn ${
                  reservation.attended
                    ? 'btn-success'
                    : 'btn-outline hover:bg-success-50 hover:text-success-700'
                }`}
                title={t('reservation.attend')}
              >
                <Check className="h-5 w-5" />
              </button>
            )}
            
            {onPaymentClick && (
              <button
                onClick={handlePaymentClick}
                className={`btn ${
                  reservation.paymentStatus === 'paid'
                    ? 'btn-success'
                    : 'btn-outline hover:bg-success-50 hover:text-success-700'
                }`}
                title={t('reservation.paymentStatus')}
              >
                <DollarSign className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {user?.role === 'manager' && (
          <div className="flex space-x-2">
            {onPaymentClick && (
              <button
                onClick={handlePaymentClick}
                className={`btn ${
                  reservation.paymentStatus === 'paid'
                    ? 'btn-success'
                    : 'btn-outline hover:bg-success-50 hover:text-success-700'
                }`}
                title={t('reservation.paymentStatus')}
              >
                <DollarSign className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;