import { Search, Filter, Download, MoreVertical, FileText, Trash2, Edit, Loader2, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ServiceRecord {
  id: string;
  bookingId: string;
  description: string;
  cost: number;
  status: string;
  bookingDate?: string;
  vehicleId?: string;
}

export function ServiceHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
  }, [user?.id]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const allServices = await apiRequest('/services');
      const servicesList = Array.isArray(allServices) ? allServices : [];
      
      // Enrich services with booking data if user is customer
      const enrichedServices = await Promise.all(
        servicesList.map(async (service: any) => {
          try {
            const booking = await apiRequest(`/bookings/${service.bookingId}`);
            return {
              ...service,
              bookingDate: booking?.date || 'Unknown',
              vehicleId: booking?.vehicleId,
            };
          } catch (error) {
            return {
              ...service,
              bookingDate: 'Unknown',
            };
          }
        })
      );

      setServices(enrichedServices);
    } catch (error) {
      console.error('Failed to fetch service history:', error);
      toast.error('Failed to load service history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await apiRequest(`/services/${serviceId}`, { method: 'DELETE' });
      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Service record deleted');
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Failed to delete service record');
    }
  };

  const handlePay = (service: ServiceRecord) => {
    navigate('/checkout', { state: { service } });
  };

  const filteredServices = services.filter(service =>
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle>Service History</CardTitle>
          <CardDescription>A detailed log of all maintenance performed on your vehicle.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by description or booking ID..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono text-xs font-medium">{service.id}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      {service.bookingDate && service.bookingDate !== 'Unknown' 
                        ? format(new Date(service.bookingDate), 'MMM d, yyyy')
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell className="font-semibold">${service.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          service.status === 'COMPLETED' && "bg-green-100 text-green-700",
                          service.status === 'PENDING' && "bg-amber-100 text-amber-700",
                          service.status === 'PAID' && "bg-purple-100 text-purple-700",
                          service.status === 'CANCELLED' && "bg-red-100 text-red-700"
                        )}
                      >
                        {service.status === 'COMPLETED' ? 'Completed' :
                         service.status === 'PENDING' ? 'Pending' :
                         service.status === 'PAID' ? 'Paid' :
                         service.status}
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
                          {service.status !== 'PAID' && (
                            <DropdownMenuItem 
                              onClick={() => handlePay(service)}
                              className="gap-2 cursor-pointer"
                            >
                              <CreditCard className="h-4 w-4" /> Pay Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No service records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
