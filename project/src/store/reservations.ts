import { atom } from 'jotai';
import { Reservation, Destination, TripType, UserRole, PaymentStatus } from '../types';

// Example data for reservations
const currentDate = new Date().toISOString();
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowISODate = tomorrowDate.toISOString();

const mockReservations: Reservation[] = [
  {
    id: '1',
    passengerId: '1',
    passengerName: 'Ahmed Passenger',
    passengerPhone: '01012345678',
    driverId: '2',
    driverName: 'Mohammed Driver',
    destination: 'sharq',
    tripType: 'one-way-going',
    date: currentDate,
    paymentStatus: 'paid',
    paymentAmount: 25,
    attended: true,
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: '2',
    passengerId: '1',
    passengerName: 'Ahmed Passenger',
    passengerPhone: '01012345678',
    driverId: '2',
    driverName: 'Mohammed Driver',
    destination: 'gharb',
    tripType: 'round-trip',
    date: tomorrowISODate,
    paymentStatus: 'unpaid',
    paymentAmount: 40,
    attended: false,
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: '3',
    passengerId: '4',
    passengerName: 'Sara Ahmed',
    passengerPhone: '01234578901',
    driverId: '2',
    driverName: 'Mohammed Driver',
    destination: 'demo',
    tripType: 'one-way-returning',
    date: currentDate,
    paymentStatus: 'paid',
    paymentAmount: 25,
    attended: true,
    createdAt: currentDate,
    updatedAt: currentDate,
  },
];

// Reservations atom
export const reservationsAtom = atom<Reservation[]>(mockReservations);

// Filter reservations by user and role
export const getReservationsByUser = (
  reservations: Reservation[],
  userId: string,
  userRole: UserRole
): Reservation[] => {
  if (userRole === 'passenger') {
    return reservations.filter(res => res.passengerId === userId);
  }
  if (userRole === 'driver') {
    return reservations.filter(res => res.driverId === userId);
  }
  // Manager sees all
  return reservations;
};

// Add a new reservation
export const addReservation = (
  passengerId: string,
  passengerName: string,
  passengerPhone: string,
  destination: Destination,
  tripType: TripType,
  date: string
): Promise<Reservation> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const newReservation: Reservation = {
        id: Math.random().toString(36).substring(2, 9),
        passengerId,
        passengerName,
        passengerPhone,
        destination,
        tripType,
        date,
        paymentStatus: 'unpaid',
        paymentAmount: tripType === 'round-trip' ? 40 : 25,
        attended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, this would add to database
      resolve(newReservation);
    }, 800);
  });
};

// Update reservation attendance
export const updateReservationAttendance = (
  reservationId: string,
  attended: boolean
): Promise<Reservation> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const reservation = mockReservations.find(r => r.id === reservationId);
      
      if (reservation) {
        const updatedReservation = {
          ...reservation,
          attended,
          updatedAt: new Date().toISOString(),
        };
        
        // In a real app, this would update the database
        resolve(updatedReservation);
      } else {
        reject(new Error('Reservation not found'));
      }
    }, 800);
  });
};

// Update reservation payment status
export const updateReservationPayment = (
  reservationId: string,
  paymentStatus: PaymentStatus
): Promise<Reservation> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const reservation = mockReservations.find(r => r.id === reservationId);
      
      if (reservation) {
        const updatedReservation = {
          ...reservation,
          paymentStatus,
          updatedAt: new Date().toISOString(),
        };
        
        // In a real app, this would update the database
        resolve(updatedReservation);
      } else {
        reject(new Error('Reservation not found'));
      }
    }, 800);
  });
};