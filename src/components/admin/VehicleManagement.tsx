import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/vehicles');
        if (response.ok) setVehicles(await response.json());
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-bold text-gray-900">Vehicles</h2><p className="text-gray-600 mt-1">View all vehicles ({vehicles.length} total)</p></div>
      {vehicles.length === 0 ? <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No vehicles found</p></div> : 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">License Plate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mileage</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.model}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{v.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{v.licensePlate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{v.mileage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
