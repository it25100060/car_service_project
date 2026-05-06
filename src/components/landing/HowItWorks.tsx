import * as React from 'react';
import { motion } from 'motion/react';
import { UserPlus, Car, Calendar, Wrench, CreditCard, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds and set up your profile as a customer or mechanic.",
    icon: UserPlus,
  },
  {
    title: "Add Vehicle",
    description: "Enter your vehicle details to start tracking its maintenance history.",
    icon: Car,
  },
  {
    title: "Book Service",
    description: "Choose a service type and pick a date that works for you.",
    icon: Calendar,
  },
  {
    title: "Get Service Done",
    description: "Our expert mechanics will handle the maintenance with precision.",
    icon: Wrench,
  },
  {
    title: "Make Payment",
    description: "Pay securely through the app and get your digital receipt.",
    icon: CreditCard,
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Get your car serviced in 5 simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-slate-100 md:block" />

          <div className="grid gap-12 md:grid-cols-5">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 ring-8 ring-white">
                  <step.icon className="h-7 w-7" />
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute top-8 -right-6 hidden h-5 w-5 text-slate-300 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
