import { Calendar as CalendarIcon, Wrench, DollarSign, Gauge, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { AddServiceDialog } from './AddServiceDialog';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { Vehicle, MaintenanceSchedule } from '@/types';

interface OverviewProps {
  onAddVehicle?: () => void;
}

export function Overview({ onAddVehicle }: OverviewProps) {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    lastServiceDate: 'N/A',
    lastServiceCost: 0,
    avgMonthlyCost: 0,
    healthScore: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        console.log('No user logged in');
        return;
      }
      
      console.log('Fetching data for user:', user.id);
      try {
        // Fetch vehicles
        const vehicles = await apiRequest(`/vehicles/owner/${user.id}`);
        console.log('Fetched vehicles:', vehicles);
        
        if (!vehicles || vehicles.length === 0) {
          console.log('No vehicles found for user');
          setVehicle(null);
          setBookings([]);
          setSchedules([]);
          return;
        }

        // Try to use the previously selected vehicle, or fall back to first
        let mainVehicle = vehicles[0];
        if (vehicle && vehicles.find((v: any) => v.id === vehicle.id)) {
          mainVehicle = vehicles.find((v: any) => v.id === vehicle.id)!;
        }
        
        console.log('Using vehicle:', mainVehicle);
        setVehicle(mainVehicle);

        try {
          // Fetch maintenance schedules
          const scheduleData = await apiRequest(`/schedules/${mainVehicle.id}`);
          setSchedules(scheduleData || []);
        } catch (scheduleError) {
          console.warn('Failed to fetch schedules:', scheduleError);
          setSchedules([]);
        }

        try {
          // Fetch bookings/services for this user
          const allBookings = await apiRequest('/bookings');
          console.log('All bookings from API:', allBookings);
          
          // Filter bookings for this user (not just this vehicle, but all their vehicles)
          const userBookings = allBookings.filter((b: any) => b.customerId === user.id);
          console.log('All bookings for user:', userBookings);
          
          // Then filter by current vehicle for stats
          const vehicleBookings = userBookings.filter((b: any) => b.vehicleId === mainVehicle.id);
          console.log('Filtered bookings for vehicle ID', mainVehicle.id, ':', vehicleBookings);
          setBookings(vehicleBookings);

          // Calculate stats from bookings
          if (vehicleBookings && vehicleBookings.length > 0) {
            // Sort by date descending to find last service
            const sortedBookings = [...vehicleBookings].sort((a: any, b: any) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const lastService = sortedBookings[0];
            
            console.log('Last service:', lastService);
            
            // Calculate stats
            const completedCount = vehicleBookings.filter((b: any) => b.status === 'COMPLETED').length;
            console.log(`Completed: ${completedCount}/${vehicleBookings.length}`);
            
            const healthScore = vehicleBookings.length > 0 
              ? Math.round((completedCount / vehicleBookings.length) * 100)
              : 85;
            
            const estimatedTotalCost = vehicleBookings.length * 150;
            const avgCost = Math.round(estimatedTotalCost / Math.max(Math.ceil(vehicleBookings.length / 3), 1));

            console.log(`Health Score: ${healthScore}%, Avg Cost: $${avgCost}`);

            setStats({
              lastServiceDate: lastService.date || 'N/A',
              lastServiceCost: 150,
              avgMonthlyCost: avgCost,
              healthScore: Math.max(healthScore, 70), // Minimum 70%
            });
          } else {
            console.log('No bookings for this vehicle, using defaults');
            // Keep default stats if no bookings
            setStats({
              lastServiceDate: 'N/A',
              lastServiceCost: 0,
              avgMonthlyCost: 0,
              healthScore: 70, // Default minimum when no history
            });
          }
        } catch (bookingError) {
          console.error('Failed to fetch bookings:', bookingError);
          setBookings([]);
          setStats({
            lastServiceDate: 'N/A',
            lastServiceCost: 0,
            avgMonthlyCost: 0,
            healthScore: 70,
          });
        }
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Wrench className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">No Vehicle Found</h2>
        <p className="mt-2 text-slate-500">Add your first vehicle to start tracking maintenance.</p>
        <Button onClick={onAddVehicle} className="mt-6 bg-blue-600 hover:bg-blue-700">Add Vehicle</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vehicle Overview</h1>
          <p className="text-slate-500">
            Welcome back, {user?.name}. Your {vehicle?.year} {vehicle?.make} {vehicle?.model} is in good shape.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddServiceDialog />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Current Mileage',
            value: vehicle?.currentMileage ? `${vehicle.currentMileage.toLocaleString()} mi` : 'N/A',
            icon: Gauge,
            color: 'text-blue-600',
          },
          {
            title: 'Last Service',
            value: stats.lastServiceDate && stats.lastServiceDate !== 'N/A'
              ? format(new Date(stats.lastServiceDate), 'MMM d, yyyy')
              : 'N/A',
            icon: CalendarIcon,
            color: 'text-green-600',
          },
          {
            title: 'Avg. Monthly Cost',
            value: `$${stats.avgMonthlyCost || 0}`,
            icon: DollarSign,
            color: 'text-amber-600',
          },
          {
            title: 'Health Score',
            value: `${stats.healthScore || 70}%`,
            icon: Wrench,
            color: 'text-indigo-600',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Vehicle Card */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="relative h-48 w-full">
            <img
              src={vehicle?.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'}
              alt={vehicle?.model || 'Vehicle'}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{vehicle?.make} {vehicle?.model}</h3>
              <p className="text-sm opacity-90">{vehicle?.year} • {vehicle?.licensePlate}</p>
            </div>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">VIN</span>
                <span className="font-mono font-medium">{vehicle?.vin || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">License Plate</span>
                <span className="font-medium">{vehicle?.licensePlate || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Current Mileage</span>
                <span className="font-medium">{vehicle?.currentMileage ? vehicle.currentMileage.toLocaleString() : 'N/A'} mi</span>
              </div>
              <div className="pt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
                  <span>Maintenance Status</span>
                  <span>{stats.healthScore || 70}%</span>
                </div>
                <Progress value={stats.healthScore || 70} className="h-2 bg-slate-100" />
                <p className="mt-2 text-xs text-slate-500">{bookings.filter((b: any) => b.status === 'COMPLETED').length} services completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Stay ahead of your vehicle's needs with these scheduled tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {schedules.length > 0 ? schedules.map((item, i) => {
                const isOverdue = new Date(item.nextDueDate) < new Date();
                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{item.task}</p>
                        <Badge variant={isOverdue ? 'danger' : 'warning'}>
                          {isOverdue ? 'Overdue' : 'Upcoming'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          Due: {format(new Date(item.nextDueDate), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5" />
                          Due: {item.nextDueMileage.toLocaleString()} mi
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Complete</Button>
                  </div>
                );
              }) : (
                <div className="py-8 text-center text-slate-500">
                  No upcoming maintenance scheduled.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
