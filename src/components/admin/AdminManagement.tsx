import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Admin {
  id: string;
  username: string;
  email: string;
  active: boolean;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/admin');
      if (!response.ok) throw new Error('Failed to load admins');
      const data = await response.json();
      setAdmins(data);
    } catch (error: any) {
      toast.error('Failed to load admins: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = 'Username required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 chars';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!editingId && !formData.password.trim()) newErrors.password = 'Password required';
    else if (formData.password && formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (admin?: Admin) => {
    if (admin) {
      setEditingId(admin.id);
      setFormData({ username: admin.username, email: admin.email, password: '', confirmPassword: '' });
    } else {
      setEditingId(null);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload: Record<string, any> = { username: formData.username, email: formData.email, active: true };
      if (formData.password) payload.password = formData.password;

      const url = editingId ? `http://localhost:3000/api/admin/${editingId}` : 'http://localhost:3000/api/admin';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save admin');
      toast.success(editingId ? 'Admin updated' : 'Admin created');
      setShowModal(false);
      loadAdmins();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete');
      }
      toast.success('Admin deleted');
      setDeleteConfirm(null);
      loadAdmins();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600 mt-1">Manage administrator accounts</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} /> Add Admin
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">⚠️ At least one admin must exist. Cannot delete the last admin.</p>
      </div>

      {admins.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center"><p className="text-gray-600">No admins found</p></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-medium ${admin.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{admin.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenModal(admin)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={18} /></button>
                      {admins.length > 1 && (
                        <button onClick={() => setDeleteConfirm(admin.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Admin' : 'Create Admin'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded transition"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} placeholder="Enter username" />
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} placeholder="Enter email" />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId && '(optional)'}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} placeholder="Enter password" />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} placeholder="Confirm password" />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="animate-spin" size={18} />Saving...</> : (editingId ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Admin?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
