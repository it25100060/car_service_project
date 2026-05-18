import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function PaymentManagement() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/payments');
        if (response.ok) setPayments(await response.json());
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
      <div><h2 className="text-2xl font-bold text-gray-900">Payments</h2><p className="text-gray-600 mt-1">View all transactions ({payments.length} total)</p></div>
      {payments.length === 0 ? <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No payments found</p></div> : 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
                <td className="px-6 py-4 text-gray-600">${p.amount}</td>
                <td className="px-6 py-4 text-gray-600">{p.date}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
