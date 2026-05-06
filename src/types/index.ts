export type ServiceStatus = 'completed' | 'pending' | 'overdue';

export interface CarService {
  id: string;
  type: string;
  date: string;
  mileage: number;
  cost: number;
  provider: string;
  status: ServiceStatus;
  notes?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  currentMileage: number;
  licensePlate: string;
  imageUrl?: string;
}

export interface MaintenanceSchedule {
  id: string;
  task: string;
  intervalMileage: number;
  intervalMonths: number;
  lastCompletedMileage: number;
  lastCompletedDate: string;
  nextDueMileage: number;
  nextDueDate: string;
}
