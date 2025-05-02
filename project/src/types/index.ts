// User and auth types
export type UserRole = 'passenger' | 'driver' | 'manager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
}

// Destination types
export type Destination = 'sharq' | 'gharb' | 'demo';

// Trip types
export type TripType = 'one-way-going' | 'one-way-returning' | 'round-trip';

// Payment status
export type PaymentStatus = 'paid' | 'unpaid';

// Reservation
export interface Reservation {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  driverId?: string;
  driverName?: string;
  destination: Destination;
  tripType: TripType;
  date: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
}

// Driver stats
export interface DriverStats {
  totalPassengers: number;
  totalCollectedTaxes: number;
  tripBreakdown: {
    destination: Destination;
    count: number;
  }[];
}