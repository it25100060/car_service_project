import * as React from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight transition-colors",
            isScrolled ? "text-slate-900" : "text-white"
          )}>
            AutoCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className={cn(
            "text-sm font-medium transition-colors hover:text-blue-600",
            isScrolled ? "text-slate-600" : "text-slate-200"
          )}>
            Features
          </a>
          <a href="#how-it-works" className={cn(
            "text-sm font-medium transition-colors hover:text-blue-600",
            isScrolled ? "text-slate-600" : "text-slate-200"
          )}>
            How It Works
          </a>
          <div className="h-4 w-px bg-slate-300/50" />
          <Link to="/login">
            <Button variant="ghost" className={cn(
              "font-medium transition-colors",
              isScrolled ? "text-slate-600" : "text-slate-200 hover:text-white"
            )}>
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={cn("h-6 w-6", isScrolled ? "text-slate-900" : "text-white")} />
          ) : (
            <Menu className={cn("h-6 w-6", isScrolled ? "text-slate-900" : "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b border-slate-200 bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            <a 
              href="#features" 
              className="text-lg font-medium text-slate-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-lg font-medium text-slate-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <hr className="border-slate-100" />
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-blue-600 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
