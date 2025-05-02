import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Search, Filter, Check, X } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { 
  reservationsAtom, 
  getReservationsByUser,
  updateReservationAttendance,
  updateReservationPayment
} from '../../store/reservations';
import ReservationCard from '../../components/ReservationCard';
import { Reservation, Destination, TripType, PaymentStatus } from '../../types';

const DriverPassengers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations, setReservations] = useAtom(reservationsAtom);
  const [driverReservations, setDriverReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState<Destination | 'all'>('all');
  const [filterTripType, setFilterTripType] = useState<TripType | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all');
  const [filterAttendance, setFilterAttendance] = useState<boolean | 'all'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Ensure user exists and is a driver
  if (!user || user.role !== 'driver') {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    if (user) {
      const filtered = getReservationsByUser(reservations, user.id, user.role);
      setDriverReservations(filtered);
      setFilteredReservations(filtered);
    }
  }, [user, reservations]);
  
  // Filter reservations
  useEffect(() => {
    let filtered = [...driverReservations];
    
    // Apply destination filter
    if (filterDestination !== 'all') {
      filtered = filtered.filter(res => res.destination === filterDestination);
    }
    
    // Apply trip type filter
    if (filterTripType !== 'all') {
      filtered = filtered.filter(res => res.tripType === filterTripType);
    }
    
    // Apply payment filter
    if (filterPayment !== 'all') {
      filtered = filtered.filter(res => res.paymentStatus === filterPayment);
    }
    
    // Apply attendance filter
    if (filterAttendance !== 'all') {
      filtered = filtered.filter(res => res.attended === filterAttendance);
    }
    
    // Apply date filter
    if (filterDate) {
      filtered = filtered.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return resDate === filterDate;
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.passengerName.toLowerCase().includes(term) ||
        res.passengerPhone.toLowerCase().includes(term)
      );
    }
    
    setFilteredReservations(filtered);
  }, [
    driverReservations, 
    searchTerm, 
    filterDestination, 
    filterTripType, 
    filterPayment, 
    filterAttendance,
    filterDate
  ]);
  
  const handleAttendanceUpdate = async (reservationId: string, attended: boolean) => {
    try {
      const updatedReservation = await updateReservationAttendance(reservationId, attended);
      
      // Update reservations atom
      setReservations(prev => 
        prev.map(r => r.id === reservationId ? { ...r, attended } : r)
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };
  
  const handlePaymentUpdate = async (reservationId: string, paid: boolean) => {
    try {
      const paymentStatus = paid ? 'paid' : 'unpaid';
      const updatedReservation = await updateReservationPayment(reservationId, paymentStatus);
      
      // Update reservations atom
      setReservations(prev => 
        prev.map(r => r.id === reservationId ? { ...r, paymentStatus } : r)
      );
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterDestination('all');
    setFilterTripType('all');
    setFilterPayment('all');
    setFilterAttendance('all');
    setFilterDate('');
  };
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('navigation.passengers')}
        </h1>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          <Filter className="mr-2 h-5 w-5" />
          {showFilters ? t('common.hideFilters') : t('common.showFilters')}
        </button>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input w-full pl-10"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {showFilters && (
          <div className="rounded-md bg-gray-50 p-4">
            <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="destination" className="label">
                  {t('reservation.destination')}
                </label>
                <select
                  id="destination"
                  className="select w-full"
                  value={filterDestination}
                  onChange={e => setFilterDestination(e.target.value as Destination | 'all')}
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="sharq">{t('reservation.destinations.sharq')}</option>
                  <option value="gharb">{t('reservation.destinations.gharb')}</option>
                  <option value="demo">{t('reservation.destinations.demo')}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tripType" className="label">
                  {t('reservation.tripType')}
                </label>
                <select
                  id="tripType"
                  className="select w-full"
                  value={filterTripType}
                  onChange={e => setFilterTripType(e.target.value as TripType | 'all')}
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="one-way-going">{t('reservation.tripTypes.oneWayGoing')}</option>
                  <option value="one-way-returning">{t('reservation.tripTypes.oneWayReturning')}</option>
                  <option value="round-trip">{t('reservation.tripTypes.roundTrip')}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="payment" className="label">
                  {t('reservation.paymentStatus')}
                </label>
                <select
                  id="payment"
                  className="select w-full"
                  value={filterPayment}
                  onChange={e => setFilterPayment(e.target.value as PaymentStatus | 'all')}
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="paid">{t('reservation.paymentStatuses.paid')}</option>
                  <option value="unpaid">{t('reservation.paymentStatuses.unpaid')}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="attendance" className="label">
                  {t('reservation.attend')}
                </label>
                <select
                  id="attendance"
                  className="select w-full"
                  value={filterAttendance === 'all' ? 'all' : filterAttendance ? 'true' : 'false'}
                  onChange={e => {
                    const val = e.target.value;
                    setFilterAttendance(val === 'all' ? 'all' : val === 'true');
                  }}
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="true">{t('reservation.attended')}</option>
                  <option value="false">{t('reservation.notAttended')}</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4 flex items-end space-x-4">
              <div className="flex-1">
                <label htmlFor="date" className="label">
                  {t('reservation.date')}
                </label>
                <input
                  id="date"
                  type="date"
                  className="input w-full"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                />
              </div>
              
              <button
                onClick={clearFilters}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                {t('common.clearFilters')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {filteredReservations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredReservations.map(reservation => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onAttendClick={handleAttendanceUpdate}
              onPaymentClick={handlePaymentUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-600">{t('driver.noPassengers')}</p>
        </div>
      )}
    </div>
  );
};

export default DriverPassengers;