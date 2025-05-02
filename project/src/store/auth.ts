import { atom } from 'jotai';
import { User } from '../types';

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Passenger',
    role: 'passenger',
    phoneNumber: '01012345678',
  },
  {
    id: '2',
    name: 'Mohammed Driver',
    role: 'driver',
    phoneNumber: '01123456789',
  },
  {
    id: '3',
    name: 'Admin Manager',
    role: 'manager',
    phoneNumber: '01234567890',
  },
];

// User atom
export const userAtom = atom<User | null>(null);

// Auth functions
export const loginUser = (phoneNumber: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.phoneNumber === phoneNumber);
      
      if (user && password === '123456') {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const registerUser = (name: string, phoneNumber: string, password: string, role: 'passenger'): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (mockUsers.some(u => u.phoneNumber === phoneNumber)) {
        reject(new Error('Phone number already registered'));
      } else {
        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          name,
          role,
          phoneNumber,
        };
        
        // In a real app, this would add to database
        mockUsers.push(newUser);
        resolve(newUser);
      }
    }, 800);
  });
};