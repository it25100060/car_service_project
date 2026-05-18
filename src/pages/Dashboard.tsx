import * as React from 'react';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Overview } from '@/components/dashboard/Overview';
import { ServiceHistory } from '@/components/dashboard/ServiceHistory';
import { AddVehicle } from '@/components/dashboard/AddVehicle';
import { MyVehicle } from '@/components/dashboard/MyVehicle';
import { BookService } from '@/components/dashboard/BookService';
import { MechanicDashboard } from '@/components/dashboard/MechanicDashboard';
import { PaymentUI } from '@/components/dashboard/PaymentUI';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'MECHANIC' ? 'mechanic' : 'dashboard');
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Overview onAddVehicle={() => setActiveTab('add-vehicle')} />}
              {activeTab === 'history' && <ServiceHistory />}
              {activeTab === 'book' && <BookService />}
              {activeTab === 'mechanic' && <MechanicDashboard />}
              {activeTab === 'payment' && <PaymentUI />}
              {activeTab === 'add-vehicle' && <AddVehicle onBackToOverview={() => setActiveTab('dashboard')} />}
              {activeTab === 'vehicle' && <MyVehicle />}
              {activeTab === 'settings' && (
                <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
                    <p className="text-slate-500">Configure your account and notification preferences.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
