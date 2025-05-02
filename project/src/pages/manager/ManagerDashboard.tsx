import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Users, DollarSign, CalendarRange, Bus, TrendingUp } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { reservationsAtom } from '../../store/reservations';
import StatCard from '../../components/StatCard';
import { Reservation } from '../../types';

const ManagerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations] = useAtom(reservationsAtom);
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalDrivers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    recentReservations: [] as Reservation[],
  });
  
  // Ensure user exists and is a manager
  if (!user || user.role !== 'manager') {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    // Total reservations
    const totalReservations = reservations.length;
    
    // Total revenue
    const totalRevenue = reservations
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.paymentAmount, 0);
    
    // Unique passengers
    const uniquePassengerIds = new Set(reservations.map(r => r.passengerId));
    const totalPassengers = uniquePassengerIds.size;
    
    // Unique drivers
    const uniqueDriverIds = new Set();
    reservations.forEach(r => {
      if (r.driverId) uniqueDriverIds.add(r.driverId);
    });
    const totalDrivers = uniqueDriverIds.size;
    
    // Recent reservations (last 5)
    const sortedReservations = [...reservations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recentReservations = sortedReservations.slice(0, 5);
    
    setStats({
      totalPassengers,
      totalDrivers,
      totalReservations,
      totalRevenue,
      recentReservations,
    });
  }, [reservations]);
  
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('manager.overview')}
        </h1>
      </div>
      
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('manager.totalReservations')}
          value={stats.totalReservations}
          icon={<CalendarRange className="h-6 w-6" />}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title={t('navigation.passengers')}
          value={stats.totalPassengers}
          icon={<Users className="h-6 w-6" />}
          color="secondary"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title={t('manager.activeDrivers')}
          value={stats.totalDrivers}
          icon={<Bus className="h-6 w-6" />}
          color="accent"
        />
        
        <StatCard
          title={t('manager.revenue')}
          value={`${stats.totalRevenue} EGP`}
          icon={<DollarSign className="h-6 w-6" />}
          color="success"
          trend={{ value: 15, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <CalendarRange className="mr-2 h-5 w-5 text-primary-600" />
            {t('navigation.reservations')}
          </h2>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">{t('navigation.reservations')}</h3>
              <button
                onClick={() => navigate('/manager/reservations')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {t('common.viewAll')}
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentReservations.map(res => (
                <div 
                  key={res.id}
                  className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{res.passengerName}</p>
                    <p className="text-sm text-gray-500">
                      {t(`reservation.destinations.${res.destination}`)} - 
                      {t(`reservation.tripTypes.${res.tripType.replace('-', '')}`)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{res.paymentAmount} EGP</p>
                    <p className={`text-sm ${res.paymentStatus === 'paid' ? 'text-success-600' : 'text-error-600'}`}>
                      {t(`reservation.paymentStatuses.${res.paymentStatus}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <TrendingUp className="mr-2 h-5 w-5 text-secondary-600" />
            {t('manager.reports.weekly')}
          </h2>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-medium">{t('reservation.destination')}</h3>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">{t('reservation.destinations.sharq')}</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">{t('reservation.destinations.gharb')}</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs">{t('reservation.destinations.demo')}</span>
                </div>
              </div>
            </div>
            
            <div className="h-60 w-full">
              {/* Chart would go here in a real application */}
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-4 text-6xl text-gray-300">📊</div>
                <p className="text-center text-gray-500">
                  Weekly reservation statistics by destination
                </p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/manager/reports')}
                className="rounded-md bg-secondary-600 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-700"
              >
                {t('manager.reports.generate')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;