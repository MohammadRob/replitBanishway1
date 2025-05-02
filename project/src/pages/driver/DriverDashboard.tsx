import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Users, DollarSign, BarChart3, MapPin } from 'lucide-react';
import { userAtom } from '../../store/auth';
import { 
  reservationsAtom, 
  getReservationsByUser,
  updateReservationAttendance,
  updateReservationPayment
} from '../../store/reservations';
import StatCard from '../../components/StatCard';
import ReservationCard from '../../components/ReservationCard';
import { Reservation, Destination, DriverStats } from '../../types';

const DriverDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [reservations, setReservations] = useAtom(reservationsAtom);
  const [driverReservations, setDriverReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<DriverStats>({
    totalPassengers: 0,
    totalCollectedTaxes: 0,
    tripBreakdown: [],
  });
  
  // Ensure user exists and is a driver
  if (!user || user.role !== 'driver') {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    if (user) {
      const filtered = getReservationsByUser(reservations, user.id, user.role);
      setDriverReservations(filtered);
      
      // Calculate stats
      const totalPassengers = filtered.length;
      const totalCollectedTaxes = filtered
        .filter(r => r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + r.paymentAmount, 0);
      
      // Calculate trip breakdown by destination
      const tripBreakdown: { destination: Destination; count: number }[] = [];
      const destinations = ['sharq', 'gharb', 'demo'] as Destination[];
      
      destinations.forEach(dest => {
        const count = filtered.filter(r => r.destination === dest).length;
        tripBreakdown.push({ destination: dest, count });
      });
      
      setStats({
        totalPassengers,
        totalCollectedTaxes,
        tripBreakdown,
      });
    }
  }, [user, reservations]);
  
  // Get today's reservations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayReservations = driverReservations.filter(res => {
    const resDate = new Date(res.date);
    resDate.setHours(0, 0, 0, 0);
    return resDate.getTime() === today.getTime();
  });
  
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
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('navigation.dashboard')}
        </h1>
      </div>
      
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <StatCard
          title={t('driver.totalPassengers')}
          value={stats.totalPassengers}
          icon={<Users className="h-6 w-6" />}
          color="primary"
        />
        
        <StatCard
          title={t('driver.totalEarnings')}
          value={`${stats.totalCollectedTaxes} EGP`}
          icon={<DollarSign className="h-6 w-6" />}
          color="success"
        />
        
        <StatCard
          title={t('driver.passengersAttendance')}
          value={
            `${driverReservations.filter(r => r.attended).length}/${driverReservations.length}`
          }
          icon={<BarChart3 className="h-6 w-6" />}
          color="accent"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          {t('driver.destinationBreakdown')}
        </h2>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.tripBreakdown.map(item => (
              <div key={item.destination} className="flex items-center justify-between p-3 rounded-md border border-gray-100">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                  <span className="font-medium">
                    {t(`reservation.destinations.${item.destination}`)}
                  </span>
                </div>
                <span className="text-lg font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="mb-4 flex items-center text-xl font-semibold">
          <Users className="mr-2 h-5 w-5 text-primary-600" />
          {t('driver.todayPassengers')}
        </h2>
        
        {todayReservations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {todayReservations.map(reservation => (
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
    </div>
  );
};

export default DriverDashboard;