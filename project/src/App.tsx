import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from './store/auth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import PassengerReservations from './pages/passenger/PassengerReservations';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverPassengers from './pages/driver/DriverPassengers';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerUsers from './pages/manager/ManagerUsers';
import ManagerReservations from './pages/manager/ManagerReservations';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect based on user role
  useEffect(() => {
    if (user && location.pathname === '/login') {
      if (user.role === 'passenger') navigate('/passenger/dashboard');
      if (user.role === 'driver') navigate('/driver/dashboard');
      if (user.role === 'manager') navigate('/manager/dashboard');
    }
  }, [user, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Passenger routes */}
        <Route
          path="passenger/*"
          element={
            <ProtectedRoute allowedRoles={['passenger']}>
              <Routes>
                <Route path="dashboard" element={<PassengerDashboard />} />
                <Route path="reservations" element={<PassengerReservations />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Driver routes */}
        <Route
          path="driver/*"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <Routes>
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="passengers" element={<DriverPassengers />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="manager/*"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Routes>
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="users" element={<ManagerUsers />} />
                <Route path="reservations" element={<ManagerReservations />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;