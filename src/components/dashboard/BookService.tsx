import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Wrench, Car, Clock, CheckCircle2, MoreVertical, X, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

export function BookService() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [vehicleLabelId, setVehicleLabelId] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [serviceLabelId, setServiceLabelId] = useState<string>('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editDate, setEditDate] = useState<Date>();
  const [editServiceType, setEditServiceType] = useState<string>('');
  const [isEditDateCalendarOpen, setIsEditDateCalendarOpen] = useState(false);

  const handleVehicleChange = (id: string) => {
    setVehicleId(id);
    const selectedVehicle = vehicles.find(v => v.id === id);
    if (selectedVehicle) {
      setVehicleLabelId(`${selectedVehicle.model} (${selectedVehicle.licensePlate})`);
    }
  };

  const handleServiceChange = (type: string) => {
    setServiceType(type);
    const serviceMap: { [key: string]: string } = {
      oil: 'Oil Change',
      tire: 'Tire Rotation',
      brake: 'Brake Service',
      inspection: 'Full Inspection',
    };
    setServiceLabelId(serviceMap[type] || type);
  };

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, [user?.id]);

  const fetchVehicles = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }
    try {
      console.log('Fetching vehicles for user:', user.id);
      const response = await apiRequest(`/vehicles/owner/${user.id}`);
      console.log('Vehicles fetched:', response);
      const vehiclesList = Array.isArray(response) ? response : [];
      console.log('Setting vehicles:', vehiclesList);
      setVehicles(vehiclesList);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setVehicles([]);
    }
  };

  const fetchBookings = async () => {
    if (!user?.id) return;
    setIsLoadingBookings(true);
    try {
      const response = await apiRequest(`/bookings/customer/${user.id}`);
      const bookingsData = Array.isArray(response) ? response : [];
      
      // Enhance bookings with vehicle and service names
      const enhancedBookings = await Promise.all(
        bookingsData.map(async (booking: any) => {
          const vehicleData = vehicles.find(v => v.id === booking.vehicleId);
          const serviceName = getServiceName(booking.serviceType);
          return {
            ...booking,
            vehicleName: vehicleData?.model || 'Unknown Vehicle',
            serviceName: serviceName,
          };
        })
      );
      
      setBookings(enhancedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    }
    setIsLoadingBookings(false);
  };

  const getServiceName = (serviceType: string): string => {
    const serviceMap: { [key: string]: string } = {
      oil: 'Oil Change',
      tire: 'Tire Rotation',
      brake: 'Brake Service',
      inspection: 'Full Inspection',
    };
    return serviceMap[serviceType] || serviceType;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleId) {
      toast.error('Please select a vehicle');
      return;
    }
    if (!serviceType) {
      toast.error('Please select a service type');
      return;
    }
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        vehicleId,
        customerId: user?.id,
        date: format(date, 'yyyy-MM-dd'),
        serviceType,
        status: 'PENDING',
      };

      const response = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      if (response) {
        toast.success('Service booked successfully!');
        // Reset form
        setVehicleId('');
        setVehicleLabelId('');
        setServiceType('');
        setServiceLabelId('');
        setDate(undefined);
        // Refresh bookings list
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast.error('Failed to book service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await apiRequest(`/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      toast.success('Booking deleted successfully!');
      fetchBookings();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      toast.error('Failed to delete booking. Please try again.');
    }
  };

  const handleEditBooking = (booking: any) => {
    setEditingBooking(booking);
    setEditServiceType(booking.serviceType);
    setEditDate(new Date(booking.date));
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!editServiceType) {
      toast.error('Please select a service type');
      return;
    }
    if (!editDate) {
      toast.error('Please select a date');
      return;
    }

    try {
      const updateData = {
        serviceType: editServiceType,
        date: format(editDate, 'yyyy-MM-dd'),
      };

      await apiRequest(`/bookings/${editingBooking.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      toast.success('Booking updated successfully!');
      setIsEditDialogOpen(false);
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Book a Service</h1>
        <p className="text-slate-500">Schedule maintenance for your vehicles with our expert mechanics.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Booking Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Booking</CardTitle>
            <CardDescription>Select your vehicle and preferred time.</CardDescription>
          </CardHeader>
          <form onSubmit={handleBooking}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Vehicle</label>
                <Select value={vehicleId} onValueChange={handleVehicleChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder={vehicleLabelId || "Choose vehicle"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>
                      Choose vehicle
                    </SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Service Type</label>
                <Select value={serviceType} onValueChange={handleServiceChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder={serviceLabelId || "Choose service"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>
                      Choose service
                    </SelectItem>
                    <SelectItem value="oil">Oil Change</SelectItem>
                    <SelectItem value="tire">Tire Rotation</SelectItem>
                    <SelectItem value="brake">Brake Service</SelectItem>
                    <SelectItem value="inspection">Full Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Date</label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCalendarOpen(true)}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Calendar Dialog */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="w-auto p-0 border-0">
            <DialogHeader className="hidden">
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setIsCalendarOpen(false);
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Manage your upcoming and past service appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No bookings yet. Create one above!
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.vehicleName}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge
                          variant="warning"
                          className={cn(
                            booking.status === 'COMPLETED'
                              ? "bg-green-100 text-green-700"
                              : booking.status === 'CANCELLED'
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {booking.status === 'COMPLETED' ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : booking.status === 'CANCELLED' ? (
                            <X className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle</label>
                <div className="p-2 bg-slate-50 rounded border text-sm text-slate-600">
                  {editingBooking.vehicleName}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Service Type</label>
                <Select value={editServiceType} onValueChange={setEditServiceType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">Oil Change</SelectItem>
                    <SelectItem value="tire">Tire Rotation</SelectItem>
                    <SelectItem value="brake">Brake Service</SelectItem>
                    <SelectItem value="inspection">Full Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Date</label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDateCalendarOpen(true)}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editDate ? format(editDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleUpdateBooking}
                >
                  Update Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Date Calendar Dialog */}
      <Dialog open={isEditDateCalendarOpen} onOpenChange={setIsEditDateCalendarOpen}>
        <DialogContent className="w-auto p-0 border-0">
          <DialogHeader className="hidden">
            <DialogTitle>Select Date</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={editDate}
              onSelect={(selectedDate) => {
                setEditDate(selectedDate);
                setIsEditDateCalendarOpen(false);
              }}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
