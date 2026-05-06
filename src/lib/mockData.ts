import { CarService, Vehicle, MaintenanceSchedule } from '../types';

export const mockVehicle: Vehicle = {
  id: '1',
  make: 'Tesla',
  model: 'Model 3',
  year: 2022,
  vin: '5YJ3E1EB6NF000000',
  currentMileage: 24500,
  licensePlate: 'EV-DRIVE',
  imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
};

export const mockServices: CarService[] = [
  {
    id: '1',
    type: 'Tire Rotation',
    date: '2024-03-15',
    mileage: 22000,
    cost: 50,
    provider: 'Tesla Service Center',
    status: 'completed',
    notes: 'All tires checked and rotated.',
  },
  {
    id: '2',
    type: 'Brake Fluid Flush',
    date: '2023-11-10',
    mileage: 18500,
    cost: 120,
    provider: 'Tesla Service Center',
    status: 'completed',
  },
  {
    id: '3',
    type: 'Cabin Air Filter',
    date: '2023-05-20',
    mileage: 12000,
    cost: 45,
    provider: 'DIY',
    status: 'completed',
  },
];

export const mockSchedule: MaintenanceSchedule[] = [
  {
    id: '1',
    task: 'Tire Rotation',
    intervalMileage: 6250,
    intervalMonths: 6,
    lastCompletedMileage: 22000,
    lastCompletedDate: '2024-03-15',
    nextDueMileage: 28250,
    nextDueDate: '2024-09-15',
  },
  {
    id: '2',
    task: 'Brake Fluid Test',
    intervalMileage: 25000,
    intervalMonths: 24,
    lastCompletedMileage: 18500,
    lastCompletedDate: '2023-11-10',
    nextDueMileage: 43500,
    nextDueDate: '2025-11-10',
  },
  {
    id: '3',
    task: 'AC Desiccant Bag',
    intervalMileage: 50000,
    intervalMonths: 48,
    lastCompletedMileage: 0,
    lastCompletedDate: '2022-01-01',
    nextDueMileage: 50000,
    nextDueDate: '2026-01-01',
  },
];
