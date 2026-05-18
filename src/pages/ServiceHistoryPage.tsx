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

export function ServiceHistoryPage() {
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
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await apiRequest(`/services/${serviceId}`, { method: 'DELETE' });
      toast.success('Service deleted successfully');
      setServices(services.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handlePay = (service: ServiceRecord) => {
    navigate('/checkout', { state: { service } });
  };

  const filteredServices = services.filter(service =>
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'PAID': 'bg-purple-100 text-purple-800',
      'Not Paid': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service History</CardTitle>
        <CardDescription>Track and manage all your service records</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.bookingId}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>${service.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn(getStatusColor(service.status))}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {service.bookingDate ? format(new Date(service.bookingDate), 'MMM dd, yyyy') : 'TBA'}
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
                              <CreditCard className="h-4 w-4" />
                              Pay Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service.id)}
                            className="gap-2 cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
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
        </div>
      </CardContent>
    </Card>
  );
}
