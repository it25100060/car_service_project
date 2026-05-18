import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  MoreVertical, 
  Search,
  Filter,
  ClipboardList,
  DollarSign,
  FileText,
  Loader2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { format } from 'date-fns';

interface EnrichedBooking {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  serviceType: string;
  date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cost?: number;
  notes?: string;
}

interface ServiceRecord {
  id: string;
  bookingId: string;
  description: string;
  cost: number;
  status: string;
}

export function MechanicDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<EnrichedBooking | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateData, setUpdateData] = useState({
    status: '',
    cost: '',
    notes: ''
  });
  const [serviceData, setServiceData] = useState({
    description: '',
    cost: '',
    status: 'COMPLETED'
  });

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // Fetch all bookings
      const bookingsData = await apiRequest('/bookings');
      const bookingsList = Array.isArray(bookingsData) ? bookingsData : [];

      // Enrich bookings with customer and vehicle names
      const enrichedBookings = await Promise.all(
        bookingsList.map(async (booking: any) => {
          try {
            // Fetch customer data
            const customerData = await apiRequest(`/users/${booking.customerId}`);
            const customerName = customerData?.name || 'Unknown Customer';

            // Fetch vehicle data
            const vehicleData = await apiRequest(`/vehicles/${booking.vehicleId}`);
            const vehicleName = vehicleData ? `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}` : 'Unknown Vehicle';

            const serviceMap: { [key: string]: string } = {
              oil: 'Oil Change',
              tire: 'Tire Rotation',
              brake: 'Brake Service',
              inspection: 'Full Inspection',
            };

            return {
              ...booking,
              customerName,
              vehicleName,
              serviceType: serviceMap[booking.serviceType] || booking.serviceType,
              // Normalize status to uppercase
              status: booking.status?.toUpperCase() || 'PENDING',
            };
          } catch (error) {
            console.error('Error enriching booking:', booking.id, error);
            return {
              ...booking,
              customerName: 'Unknown Customer',
              vehicleName: 'Unknown Vehicle',
              serviceType: booking.serviceType,
              status: booking.status?.toUpperCase() || 'PENDING',
            };
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const inProgress = bookings.filter(b => b.status === 'IN_PROGRESS').length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;

    return { pending, inProgress, completed };
  };

  const fetchServices = async () => {
    try {
      const servicesData = await apiRequest('/services');
      const servicesList = Array.isArray(servicesData) ? servicesData : [];
      setServices(servicesList);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleUpdateClick = (booking: EnrichedBooking) => {
    setSelectedBooking(booking);
    setUpdateData({
      status: booking.status,
      cost: booking.cost?.toString() || '',
      notes: booking.notes || ''
    });
    setIsUpdateOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const updatedStatus = updateData.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 
                            updateData.status === 'COMPLETED' ? 'COMPLETED' :
                            updateData.status === 'PENDING' ? 'PENDING' : 'PENDING';

      // Update the booking status
      await apiRequest(`/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(updatedStatus),
      });

      // Update local state
      const updatedBookings = bookings.map(b =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: updatedStatus as any,
              cost: parseFloat(updateData.cost) || b.cost,
              notes: updateData.notes
            }
          : b
      );

      setBookings(updatedBookings);
      setIsUpdateOpen(false);
      toast.success(`Booking ${selectedBooking.id} updated successfully!`);
    } catch (error: any) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleAddServiceClick = (booking: EnrichedBooking) => {
    setSelectedBooking(booking);
    setServiceData({ description: '', cost: '', status: 'COMPLETED' });
    setIsAddServiceOpen(true);
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      if (!serviceData.description.trim()) {
        toast.error('Description is required');
        return;
      }
      if (!serviceData.cost || parseFloat(serviceData.cost) < 0) {
        toast.error('Cost must be a positive number');
        return;
      }

      // Create service record
      const newService = await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          description: serviceData.description,
          cost: parseFloat(serviceData.cost),
          status: serviceData.status
        }),
      });

      // Add to services list
      setServices([...services, newService]);

      // Update booking status to COMPLETED
      const updatedBookings = bookings.map(b =>
        b.id === selectedBooking.id ? { ...b, status: 'COMPLETED' as any } : b
      );
      setBookings(updatedBookings);

      setIsAddServiceOpen(false);
      toast.success(`Service record created successfully!`);
    } catch (error: any) {
      console.error('Failed to add service:', error);
      toast.error('Failed to create service record');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mechanic Workspace</h1>
          <p className="text-slate-500">Manage your assigned service tasks and update progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <ClipboardList className="mr-2 h-4 w-4" /> Export List
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-slate-500">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-slate-500">Active tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-slate-500">Total completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assigned Bookings</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Search bookings..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No bookings available
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.vehicleName}</TableCell>
                    <TableCell>{booking.serviceType}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          booking.status === 'COMPLETED' && "bg-green-100 text-green-700",
                          booking.status === 'IN_PROGRESS' && "bg-blue-100 text-blue-700",
                          booking.status === 'PENDING' && "bg-slate-100 text-slate-700",
                          booking.status === 'CANCELLED' && "bg-red-100 text-red-700"
                        )}
                      >
                        {booking.status === 'IN_PROGRESS' ? 'In Progress' : 
                         booking.status === 'PENDING' ? 'Pending' :
                         booking.status === 'COMPLETED' ? 'Completed' :
                         booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddServiceClick(booking)}
                          className="text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Service
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUpdateClick(booking)}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Edit3 className="mr-2 h-4 w-4" /> Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Update Service: {selectedBooking?.id}</DialogTitle>
              <DialogDescription>
                Update the status, add notes, and finalize the cost for this service.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Service Status</Label>
                <Select 
                  value={updateData.status} 
                  onValueChange={(val) => setUpdateData({...updateData, status: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost">Estimated/Final Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="cost" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-10"
                    value={updateData.cost}
                    onChange={(e) => setUpdateData({...updateData, cost: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Service Notes</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea 
                    id="notes" 
                    placeholder="Describe the work performed..." 
                    className="min-h-[100px] pl-10"
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddServiceSubmit}>
            <DialogHeader>
              <DialogTitle>Add Service Record: {selectedBooking?.id}</DialogTitle>
              <DialogDescription>
                Complete the service and document the work done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="service-desc">Work Description</Label>
                <Textarea 
                  id="service-desc" 
                  placeholder="E.g., Oil Changed" 
                  className="min-h-[80px]"
                  value={serviceData.description}
                  onChange={(e) => setServiceData({...serviceData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service-cost">Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="service-cost" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-10"
                    value={serviceData.cost}
                    onChange={(e) => setServiceData({...serviceData, cost: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service-status">Status</Label>
                <Select 
                  value={serviceData.status} 
                  onValueChange={(val) => setServiceData({...serviceData, status: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddServiceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Create Service Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
