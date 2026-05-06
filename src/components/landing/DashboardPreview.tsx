import * as React from 'react';
import { motion } from 'motion/react';

export function DashboardPreview() {
  return (
    <section className="overflow-hidden bg-slate-950 py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-white md:text-5xl"
            >
              A powerful dashboard <br />
              <span className="text-blue-500">at your fingertips</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-slate-400"
            >
              Monitor your vehicle's health, upcoming services, and spending with our intuitive interface. Designed for clarity and speed.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm text-slate-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-sm text-slate-500">Services Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9/5</div>
                <div className="text-sm text-slate-500">User Rating</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex-1"
          >
            <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-blue-500/10">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
                alt="Dashboard Preview"
                className="rounded-xl shadow-inner"
                referrerPolicy="no-referrer"
              />
              {/* Glassmorphism Overlay Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-10 -right-10 hidden w-64 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:block"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">Monthly Spending</span>
                  <span className="text-xs font-bold text-green-400">+12%</span>
                </div>
                <div className="text-2xl font-bold text-white">$1,240.00</div>
                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-blue-500" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
