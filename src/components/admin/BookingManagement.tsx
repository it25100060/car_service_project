import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/bookings');
        if (response.ok) setBookings(await response.json());
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
      <div><h2 className="text-2xl font-bold text-gray-900">Bookings</h2><p className="text-gray-600 mt-1">View all service bookings ({bookings.length} total)</p></div>
      {bookings.length === 0 ? <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No bookings found</p></div> : 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Service</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{b.id}</td>
                <td className="px-6 py-4 text-gray-600">{b.service}</td>
                <td className="px-6 py-4 text-gray-600">{b.date}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
