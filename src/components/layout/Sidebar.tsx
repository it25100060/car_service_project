import { LayoutDashboard, History, Settings, Car, Bell, LogOut, Menu, X, Plus, Wrench, DollarSign, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['CUSTOMER', 'MECHANIC'] },
    { id: 'history', label: 'Service History', icon: History, roles: ['CUSTOMER'] },
    { id: 'book', label: 'Book Service', icon: Bell, roles: ['CUSTOMER'] },
    { id: 'mechanic', label: 'Mechanic View', icon: Wrench, roles: ['MECHANIC'] },
    { id: 'payment', label: 'Checkout', icon: DollarSign, roles: ['CUSTOMER'] },
    { id: 'add-vehicle', label: 'Add Vehicle', icon: Plus, roles: ['CUSTOMER'] },
    { id: 'vehicle', label: 'My Vehicle', icon: Car, roles: ['CUSTOMER'] },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['CUSTOMER', 'MECHANIC', 'ADMIN', 'SUPER_ADMIN'] },
  ];

  const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  const handleNavClick = (id: string) => {
    if (id === 'admin') {
      navigate('/admin');
    } else {
      setActiveTab(id);
      if (window.location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-50 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoCare</span>
          </div>

          <Separator className="bg-slate-800" />

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </ScrollArea>

          <Separator className="bg-slate-800" />

          {/* Footer */}
          <div className="p-4">
            <div className="flex items-center gap-3 rounded-lg bg-slate-900 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
