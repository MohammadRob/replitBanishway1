import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Calendar, Search } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { 
  reservationsAtom, 
  getReservationsByUser 
} from '../../store/reservations';
import ReservationCard from '../../components/ReservationCard';
import { Reservation, Destination, TripType } from '../../types';

const PassengerReservations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations] = useAtom(reservationsAtom);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState<Destination | 'all'>('all');
  const [filterTripType, setFilterTripType] = useState<TripType | 'all'>('all');
  
  // Ensure user exists and is a passenger
  if (!user || user.role !== 'passenger') {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    if (user) {
      const filtered = getReservationsByUser(reservations, user.id, user.role);
      setUserReservations(filtered);
      setFilteredReservations(filtered);
    }
  }, [user, reservations]);
  
  // Filter reservations based on search and filters
  useEffect(() => {
    let filtered = [...userReservations];
    
    // Apply destination filter
    if (filterDestination !== 'all') {
      filtered = filtered.filter(res => res.destination === filterDestination);
    }
    
    // Apply trip type filter
    if (filterTripType !== 'all') {
      filtered = filtered.filter(res => res.tripType === filterTripType);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.driverName?.toLowerCase().includes(term) ||
        new Date(res.date).toLocaleDateString().includes(term)
      );
    }
    
    setFilteredReservations(filtered);
  }, [userReservations, searchTerm, filterDestination, filterTripType]);
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('passenger.myReservations')}
        </h1>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="label">
              {t('common.search')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                className="input w-full pl-10"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="destination" className="label">
              {t('reservation.destination')}
            </label>
            <select
              id="destination"
              className="select"
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
              className="select"
              value={filterTripType}
              onChange={e => setFilterTripType(e.target.value as TripType | 'all')}
            >
              <option value="all">{t('common.all')}</option>
              <option value="one-way-going">{t('reservation.tripTypes.oneWayGoing')}</option>
              <option value="one-way-returning">{t('reservation.tripTypes.oneWayReturning')}</option>
              <option value="round-trip">{t('reservation.tripTypes.roundTrip')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredReservations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredReservations.map(reservation => (
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
            onClick={() => navigate('/passenger/dashboard')}
            className="mt-4 rounded-md bg-primary-100 px-4 py-2 font-medium text-primary-700 hover:bg-primary-200"
          >
            {t('passenger.newReservation')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PassengerReservations;