import * as React from 'react';
import { motion } from 'motion/react';
import { Car, Calendar, History, ShieldCheck, LayoutDashboard, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: "Manage Vehicles",
    description: "Keep all your vehicle details in one place. Track mileage, specs, and insurance easily.",
    icon: Car,
    color: "bg-blue-500"
  },
  {
    title: "Book Services Easily",
    description: "Schedule maintenance with expert mechanics in just a few clicks. Real-time availability.",
    icon: Calendar,
    color: "bg-indigo-500"
  },
  {
    title: "Track Service History",
    description: "A complete digital log of every service, part replacement, and inspection performed.",
    icon: History,
    color: "bg-purple-500"
  },
  {
    title: "Secure Payments",
    description: "Pay for services safely through our encrypted platform. Support for cards and cash.",
    icon: ShieldCheck,
    color: "bg-emerald-500"
  },
  {
    title: "Admin Dashboard",
    description: "Powerful tools for mechanics to manage tasks, update progress, and communicate with customers.",
    icon: LayoutDashboard,
    color: "bg-orange-500"
  },
  {
    title: "Expert Maintenance",
    description: "Connect with certified professionals who use high-quality parts and modern tools.",
    icon: Wrench,
    color: "bg-red-500"
  }
];

export function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl"
          >
            Everything you need to <br />
            <span className="text-blue-600">keep your car in top shape</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-600"
          >
            Powerful features designed for both vehicle owners and service professionals.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group h-full border-none bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <div className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110",
                    feature.color
                  )}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from '@/lib/utils';
