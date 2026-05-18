import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Car,
  Calendar,
  User,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function PaymentUI() {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const serviceSummary = {
    id: 'SRV-8821',
    vehicle: 'Tesla Model 3',
    service: 'Full Inspection & Brake Service',
    date: 'April 12, 2024',
    amount: 450.00,
    tax: 36.00,
    total: 486.00
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    toast.success('Payment processed successfully!');
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Payment Successful!</h2>
        <p className="mt-2 text-slate-500">Your receipt has been sent to your email.</p>
        <div className="mt-8 flex gap-4">
          <Button variant="outline">Download PDF Receipt</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="text-slate-500">Complete your payment for the recent service.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Payment Form */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose how you'd like to pay for your service.</CardDescription>
          </CardHeader>
          <form onSubmit={handlePayment}>
            <CardContent className="space-y-6">
              {/* Method Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                    paymentMethod === 'card' 
                      ? "border-blue-600 bg-blue-50 text-blue-600" 
                      : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                  )}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm font-semibold">Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                    paymentMethod === 'cash' 
                      ? "border-blue-600 bg-blue-50 text-blue-600" 
                      : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                  )}
                >
                  <Banknote className="h-6 w-6" />
                  <span className="text-sm font-semibold">Cash</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'card' ? (
                  <motion.div
                    key="card-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="card-name" placeholder="John Doe" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="expiry" placeholder="MM/YY" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="cvv" placeholder="123" className="pl-10" required />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Your payment information is encrypted and secure.
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cash-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-dashed border-slate-200 p-6 text-center"
                  >
                    <Banknote className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm text-slate-500">
                      Please pay the total amount at the service desk.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 p-6">
              <Button
                type="submit"
                className="w-full bg-blue-600 py-6 text-lg font-bold text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Pay ${serviceSummary.total.toFixed(2)}
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Right: Summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{serviceSummary.vehicle}</p>
                  <p className="text-xs text-slate-500">{serviceSummary.service}</p>
                </div>
              </div>
              
              <div className="h-px bg-slate-200" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Amount</span>
                  <span className="font-medium text-slate-900">${serviceSummary.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax (8%)</span>
                  <span className="font-medium text-slate-900">${serviceSummary.tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="h-px bg-slate-200" />
              
              <div className="flex justify-between">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-blue-600">${serviceSummary.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
