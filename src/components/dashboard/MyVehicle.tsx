import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Vehicle } from '@/types';

export function MyVehicle() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Vehicle>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await apiRequest(`/vehicles/owner/${user.id}`);
      const vehiclesList = Array.isArray(data) ? data : [];
      setVehicles(vehiclesList);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setEditFormData(vehicle);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      const updatedVehicle = {
        ...editingVehicle,
        ...editFormData,
      };
      await apiRequest('/vehicles', {
        method: 'PUT',
        body: JSON.stringify(updatedVehicle),
      });
      setIsEditing(false);
      setEditingVehicle(null);
      toast.success('Vehicle updated successfully!');
      fetchVehicles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update vehicle');
    }
  };

  const handleDelete = async () => {
    if (!deleteVehicleId) return;

    try {
      setIsDeleting(true);
      await apiRequest(`/vehicles/${deleteVehicleId}`, {
        method: 'DELETE',
      });
      toast.success('Vehicle deleted successfully!');
      setShowDeleteDialog(false);
      setDeleteVehicleId(null);
      fetchVehicles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">No Vehicles Found</h2>
        <p className="mt-2 text-slate-500">Add your first vehicle to start tracking.</p>
      </div>
    );
  }

  if (isEditing && editingVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsEditing(false);
              setEditingVehicle(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Vehicle</h1>
            <p className="text-slate-500">{editingVehicle.year} {editingVehicle.make} {editingVehicle.model}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdate}>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={editFormData.make || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, make: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={editFormData.model || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={editFormData.year || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={editFormData.licensePlate || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, licensePlate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input
                    id="vin"
                    value={editFormData.vin || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, vin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={editFormData.currentMileage || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, currentMileage: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end gap-3 border-t bg-slate-50/50 p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingVehicle(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Vehicles</h1>
        <p className="text-slate-500">View and manage all your vehicles.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{vehicle.model}</CardTitle>
                  <p className="text-sm text-slate-500">{vehicle.year} {vehicle.make}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">License Plate:</span>
                <span className="font-medium">{vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">VIN:</span>
                <span className="font-mono text-xs font-medium">{vehicle.vin || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Mileage:</span>
                <span className="font-medium">{vehicle.currentMileage?.toLocaleString() || 0} mi</span>
              </div>
            </CardContent>
            <div className="flex gap-2 border-t p-4">
              <Button
                onClick={() => startEdit(vehicle)}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={() => {
                  setDeleteVehicleId(vehicle.id);
                  setShowDeleteDialog(true);
                }}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Vehicle?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your vehicle record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
