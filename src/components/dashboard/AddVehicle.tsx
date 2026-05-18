import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Car, Hash, Type, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

interface AddVehicleProps {
  onBackToOverview?: () => void;
}

interface FormErrors {
  licensePlate?: string;
  model?: string;
  year?: string;
  currentMileage?: string;
}

// Validation functions
const validateLicensePlate = (plate: string): string | null => {
  const sriLankaPlateRegex = /^[A-Z]{2,3}-\d{4}$/;
  if (!plate) return 'License plate is required';
  if (!sriLankaPlateRegex.test(plate)) {
    return 'Invalid format. Use ABC-1234 (2-3 letters, hyphen, 4 numbers)';
  }
  return null;
};

const validateYear = (year: number): string | null => {
  const currentYear = new Date().getFullYear();
  if (!year) return 'Year is required';
  if (year > currentYear) return `Year cannot be in the future. Maximum: ${currentYear}`;
  if (year < 1900) return 'Year seems invalid. Enter a year from 1900 onwards';
  return null;
};

const validateMileage = (mileage: number): string | null => {
  if (mileage < 0) return 'Mileage cannot be negative';
  if (mileage > 9999999) return 'Mileage seems too high';
  return null;
};

export function AddVehicle({ onBackToOverview }: AddVehicleProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    licensePlate: '',
    model: '',
    make: 'Generic',
    vehicleType: 'sedan',
    year: new Date().getFullYear(),
    currentMileage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    
    const platError = validateLicensePlate(formData.licensePlate);
    if (platError) newErrors.licensePlate = platError;
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model name is required';
    }
    
    const yearError = validateYear(formData.year);
    if (yearError) newErrors.year = yearError;
    
    const mileageError = validateMileage(formData.currentMileage);
    if (mileageError) newErrors.currentMileage = mileageError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to add a vehicle');
      return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ownerId: user.id,
        licensePlate: formData.licensePlate,
        model: formData.model,
        make: formData.make,
        year: parseInt(String(formData.year)),
        currentMileage: parseInt(String(formData.currentMileage)),
        vin: `VIN-${Date.now()}`,
        imageUrl: '',
      };

      await apiRequest('/vehicles', {
        method: 'POST',
        body: JSON.stringify(vehicleData),
      });

      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Vehicle added successfully!');
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Failed to add vehicle');
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Added!</h2>
        <p className="mt-2 text-slate-500">Your vehicle has been registered and is ready for tracking.</p>
        <div className="mt-8 flex gap-4">
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Add Another
          </Button>
          <Button onClick={onBackToOverview} className="bg-blue-600 hover:bg-blue-700">
            View Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Vehicle</h1>
        <p className="text-slate-500">Register a new vehicle to start tracking its maintenance history.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Enter the basic information about your car.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate">Vehicle Number / Plate</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="plate" 
                    placeholder="ABC-1234" 
                    className={`pl-10 ${errors.licensePlate ? 'border-red-500' : ''}`}
                    value={formData.licensePlate}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setFormData({ ...formData, licensePlate: value });
                      if (errors.licensePlate) {
                        setErrors({ ...errors, licensePlate: validateLicensePlate(value) || undefined });
                      }
                    }}
                  />
                </div>
                {errors.licensePlate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.licensePlate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model Name</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="model" 
                    placeholder="Tesla Model 3" 
                    className={`pl-10 ${errors.model ? 'border-red-500' : ''}`}
                    value={formData.model}
                    onChange={(e) => {
                      setFormData({ ...formData, model: e.target.value });
                      if (errors.model) {
                        setErrors({ ...errors, model: undefined });
                      }
                    }}
                  />
                </div>
                {errors.model && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.model}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <div className="relative">
                <Type className="absolute left-3 top-3 z-10 h-4 w-4 text-slate-400" />
                <Select 
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="electric">Electric / EV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year" 
                  type="number" 
                  placeholder="2024"
                  className={errors.year ? 'border-red-500' : ''}
                  value={formData.year}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, year: value });
                    if (errors.year) {
                      setErrors({ ...errors, year: validateYear(value) || undefined });
                    }
                  }}
                  max={new Date().getFullYear()}
                />
                {errors.year && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.year}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Current Mileage (mi)</Label>
                <Input 
                  id="mileage" 
                  type="number" 
                  placeholder="0"
                  className={errors.currentMileage ? 'border-red-500' : ''}
                  value={formData.currentMileage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, currentMileage: value });
                    if (errors.currentMileage) {
                      setErrors({ ...errors, currentMileage: validateMileage(value) || undefined });
                    }
                  }}
                  min="0"
                />
                {errors.currentMileage && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.currentMileage}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t bg-slate-50/50 p-6">
            <Button type="button" variant="outline" onClick={onBackToOverview}>Cancel</Button>
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </div>
              ) : (
                'Add Vehicle'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
