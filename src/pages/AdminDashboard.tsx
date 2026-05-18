import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Users, Wrench, Truck, Calendar, CreditCard, Settings, Shield } from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import MechanicManagement from '@/components/admin/MechanicManagement';
import VehicleManagement from '@/components/admin/VehicleManagement';
import BookingManagement from '@/components/admin/BookingManagement';
import PaymentManagement from '@/components/admin/PaymentManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import { toast } from 'sonner';

type ActiveTab = 'overview' | 'users' | 'mechanics' | 'vehicles' | 'bookings' | 'payments' | 'admins' | 'settings';

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as ActiveTab, label: 'Users', icon: Users },
    { id: 'mechanics' as ActiveTab, label: 'Mechanics', icon: Wrench },
    { id: 'vehicles' as ActiveTab, label: 'Vehicles', icon: Truck },
    { id: 'bookings' as ActiveTab, label: 'Bookings', icon: Calendar },
    { id: 'payments' as ActiveTab, label: 'Payments', icon: CreditCard },
    { id: 'admins' as ActiveTab, label: 'Admins', icon: Shield },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'mechanics':
        return <MechanicManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'admins':
        return <AdminManagement />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">AutoCare</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-6 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700 p-4 mt-auto flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md flex-shrink-0">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{admin?.username}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {sidebarOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
          </button>
          <div className="text-right">
            <p className="text-gray-500 text-sm font-medium">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-900">{admin?.username}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 min-h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
