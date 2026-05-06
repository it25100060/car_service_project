import * as React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background with Gradient */}
      <div className="absolute inset-0 z-0 bg-blue-600" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90" />
      
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Start Managing Your Car <br /> Services Today
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Join thousands of vehicle owners and mechanics who trust AutoCare for their maintenance needs.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="h-14 bg-white px-8 text-lg font-bold text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-14 border-white/30 bg-white/10 px-8 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20 hover:scale-105 active:scale-95">
                Login to Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
