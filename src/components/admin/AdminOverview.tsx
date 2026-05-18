import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Wrench, CreditCard, Calendar, Truck, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/dashboard-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Mechanics', value: stats?.mechanics || 0, icon: Wrench, color: 'orange' },
    { label: 'Customers', value: stats?.customers || 0, icon: Users, color: 'green' },
    { label: 'Vehicles', value: stats?.totalVehicles || 0, icon: Truck, color: 'purple' },
    { label: 'Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'red' },
    { label: 'Revenue', value: `$${stats?.totalRevenue || '0.00'}`, icon: CreditCard, color: 'cyan' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', orange: 'bg-orange-100 text-orange-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600', red: 'bg-red-100 text-red-600', cyan: 'bg-cyan-100 text-cyan-600' };
    return colors[color] || colors.blue;
  };

  const getGradientClasses = (color: string) => {
    const gradients: Record<string, string> = { blue: 'from-blue-400 to-blue-600', orange: 'from-orange-400 to-orange-600', green: 'from-green-400 to-green-600', purple: 'from-purple-400 to-purple-600', red: 'from-red-400 to-red-600', cyan: 'from-cyan-400 to-cyan-600' };
    return gradients[color] || gradients.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Real-time system statistics and analytics</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                    <p className="text-4xl font-bold text-gray-900 mt-3">{card.value}</p>
                  </div>
                  <div className={`${getColorClasses(card.color)} p-4 rounded-lg`}>
                    <Icon size={28} />
                  </div>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${getGradientClasses(card.color)}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
