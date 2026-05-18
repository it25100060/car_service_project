import * as React from 'react';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function AddServiceDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [formData, setFormData] = useState({
    type: '',
    mileage: '',
    provider: '',
    cost: '',
    details: ''
  });

  useEffect(() => {
    async function fetchVehicle() {
      if (!user || !open) return;
      try {
        const vehicles = await apiRequest(`/vehicles/${user.id}`);
        if (vehicles && vehicles.length > 0) {
          setVehicleId(vehicles[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
      }
    }
    fetchVehicle();
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      toast.error('No vehicle found to associate this service with.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/services/direct', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId,
          date: format(date, 'yyyy-MM-dd'),
          serviceType: formData.type,
          details: `${formData.details} (Mileage: ${formData.mileage}, Provider: ${formData.provider})`,
          cost: parseFloat(formData.cost)
        })
      });
      toast.success('Service record added successfully!');
      setOpen(false);
      // Optionally trigger a refresh of the service history
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.message || 'Failed to add service record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Service
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Service Record</DialogTitle>
            <DialogDescription>
              Enter the details of the maintenance performed on your vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Service Type</Label>
              <Select 
                required 
                onValueChange={(val) => setFormData({...formData, type: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oil Change">Oil Change</SelectItem>
                  <SelectItem value="Tire Rotation">Tire Rotation</SelectItem>
                  <SelectItem value="Brake Service">Brake Service</SelectItem>
                  <SelectItem value="General Inspection">General Inspection</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input 
                  id="mileage" 
                  type="number" 
                  placeholder="24,500" 
                  required 
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provider">Service Provider</Label>
              <Input 
                id="provider" 
                placeholder="Tesla Service Center" 
                required 
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Total Cost ($)</Label>
              <Input 
                id="cost" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required 
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="details">Additional Details</Label>
              <Input 
                id="details" 
                placeholder="e.g. Replaced air filter" 
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
