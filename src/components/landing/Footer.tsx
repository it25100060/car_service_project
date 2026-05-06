import * as React from 'react';
import { Link } from 'react-router-dom';
import { Car, Github, Twitter, Linkedin } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 py-16 text-slate-400">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AutoCare</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              The modern platform for vehicle maintenance and service tracking. Built for clarity, speed, and reliability.
            </p>
            <div className="flex gap-4">
              <a href="#" className="transition-colors hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="transition-colors hover:text-white"><Github className="h-5 w-5" /></a>
              <a href="#" className="transition-colors hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Pricing</a></li>
              <li><a href="#" className="transition-colors hover:text-white">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/login" className="transition-colors hover:text-white">Login</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-white">Register</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">About Us</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} AutoCare Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
