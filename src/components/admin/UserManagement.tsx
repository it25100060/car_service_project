import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-bold text-gray-900">Users Management</h2><p className="text-gray-600 mt-1">View all registered users ({users.length} total)</p></div>
      {users.length === 0 ? <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No users found</p></div> : 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{user.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
