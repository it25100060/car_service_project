import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function MechanicManagement() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/mechanics');
        if (response.ok) setMechanics(await response.json());
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
      <div><h2 className="text-2xl font-bold text-gray-900">Mechanics</h2><p className="text-gray-600 mt-1">View all mechanics ({mechanics.length} total)</p></div>
      {mechanics.length === 0 ? <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No mechanics found</p></div> : 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mechanics.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{m.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{m.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
