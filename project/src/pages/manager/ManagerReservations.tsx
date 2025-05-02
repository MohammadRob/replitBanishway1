import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Search, Filter, Download, Printer } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { 
  reservationsAtom,
  updateReservationPayment
} from '../../store/reservations';
import ReservationCard from '../../components/ReservationCard';
import { Reservation, Destination, TripType, PaymentStatus } from '../../types';

const ManagerReservations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations, setReservations] = useAtom(reservationsAtom);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState<Destination | 'all'>('all');
  const [filterTripType, setFilterTripType] = useState<TripType | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all');
  const [filterDriver, setFilterDriver] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get unique driver names
  const uniqueDrivers = Array.from(
    new Set(
      reservations
        .filter(r => r.driverName)
        .map(r => r.driverName)
    )
  );
  
  // Ensure user exists and is a manager
  if (!user || user.role !== 'manager') {
    navigate('/login');
    return null;
  }
  
  // Filter reservations
  useEffect(() => {
    let filtered = [...reservations];
    
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
    
    // Apply driver filter
    if (filterDriver !== 'all') {
      filtered = filtered.filter(res => res.driverName === filterDriver);
    }
    
    // Apply date range filter
    if (filterDateFrom) {
      filtered = filtered.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return resDate >= filterDateFrom;
      });
    }
    
    if (filterDateTo) {
      filtered = filtered.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return resDate <= filterDateTo;
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.passengerName.toLowerCase().includes(term) ||
        res.passengerPhone.toLowerCase().includes(term) ||
        (res.driverName && res.driverName.toLowerCase().includes(term))
      );
    }
    
    setFilteredReservations(filtered);
  }, [
    reservations, 
    searchTerm, 
    filterDestination, 
    filterTripType, 
    filterPayment,
    filterDriver,
    filterDateFrom,
    filterDateTo
  ]);
  
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
    setFilterDriver('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };
  
  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('navigation.reservations')}
        </h1>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            <Filter className="mr-2 h-5 w-5" />
            {showFilters ? t('common.hideFilters') : t('common.showFilters')}
          </button>
          
          <button
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            <Download className="mr-2 h-5 w-5" />
            {t('manager.reports.export')}
          </button>
          
          <button
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            <Printer className="mr-2 h-5 w-5" />
            {t('manager.reports.print')}
          </button>
        </div>
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
            <div className="mb-4 grid gap-4 md:grid-cols-3">
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
                <label htmlFor="driver" className="label">
                  {t('reservation.driver')}
                </label>
                <select
                  id="driver"
                  className="select w-full"
                  value={filterDriver}
                  onChange={e => setFilterDriver(e.target.value)}
                >
                  <option value="all">{t('common.all')}</option>
                  {uniqueDrivers.map(driver => (
                    <option key={driver} value={driver}>
                      {driver}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="dateFrom" className="label">
                  {t('common.dateFrom')}
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  className="input w-full"
                  value={filterDateFrom}
                  onChange={e => setFilterDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="dateTo" className="label">
                  {t('common.dateTo')}
                </label>
                <input
                  id="dateTo"
                  type="date"
                  className="input w-full"
                  value={filterDateTo}
                  onChange={e => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
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
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('common.showing')} {filteredReservations.length} {t('common.of')} {reservations.length} {t('navigation.reservations')}
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md px-3 py-1 ${
              viewMode === 'grid' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md px-3 py-1 ${
              viewMode === 'list' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            List
          </button>
        </div>
      </div>
      
      {filteredReservations.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReservations.map(reservation => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onPaymentClick={handlePaymentUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.passenger')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.destination')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.tripType')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.driver')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('reservation.paymentStatus')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {reservation.passengerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {t(`reservation.destinations.${reservation.destination}`)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {t(`reservation.tripTypes.${reservation.tripType === 'one-way-going' ? 'oneWayGoing' : 
                        reservation.tripType === 'one-way-returning' ? 'oneWayReturning' : 'roundTrip'}`)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {reservation.driverName || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {new Date(reservation.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        reservation.paymentStatus === 'paid' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {t(`reservation.paymentStatuses.${reservation.paymentStatus}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-600">{t('reservation.noReservations')}</p>
        </div>
      )}
    </div>
  );
};

export default ManagerReservations;