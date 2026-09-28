import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building2, Wallet, Sparkles, AlertCircle } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';

export default function CheckoutModal({
  isOpen,
  selectedPlanId = 'PRO',
  onClose,
  onPaymentSuccess,
  onPaymentFailed
}) {
  if (!isOpen) return null;

  const plan = SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.PRO;
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING'
  const [upiId, setUpiId] = useState('user@upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = (isSuccess) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (isSuccess) {
        onPaymentSuccess({
          planId: plan.id,
          billingCycle: plan.billingCycle,
          paymentMethod
        });
      } else {
        onPaymentFailed({
          reason: 'Bank authorization declined during simulated test transaction.'
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-md">
                Sandbox Gateway
              </span>
              <span className="text-xs text-slate-400 font-medium">SSL 256-bit Encrypted</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">Complete Subscription</h2>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Summary Card */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-purple-600 tracking-wider">Plan Selected</span>
            <h3 className="text-base font-extrabold text-purple-950">{plan.name} Subscription</h3>
            <p className="text-xs text-purple-700 font-medium">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-purple-900">{plan.priceDisplay}</div>
            <span className="text-[10px] text-purple-600 font-bold">/ {plan.billingCycle}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Payment Method
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'UPI', label: 'UPI / GPay', icon: Smartphone },
              { id: 'CARD', label: 'Cards', icon: CreditCard },
              { id: 'NETBANKING', label: 'NetBanking', icon: Building2 }
            ].map((method) => {
              const IconComp = method.icon;
              const isSel = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSel
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isSel ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Input (Simulated sandbox inputs) */}
        {paymentMethod === 'UPI' && (
          <div className="form-group">
            <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="form-control"
              placeholder="username@upi"
            />
          </div>
        )}

        {paymentMethod === 'CARD' && (
          <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between text-slate-600 font-semibold">
              <span>Card Number (Test Mode)</span>
              <span>•••• •••• •••• 4242</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Note: Test payment architecture active. No raw card or CVV details stored.
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Modular payment gateway architecture ready for Razorpay / Stripe integration.</span>
        </div>

        {/* Simulation Action Controls */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment(true)}
            className="w-full btn btn-primary text-xs font-extrabold py-3 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Payment...' : `Pay ${plan.priceDisplay} & Activate Pro`}</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment(false)}
            className="w-full btn btn-secondary text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            Simulate Payment Failure (Test Error Handling)
          </button>
        </div>

      </div>
    </div>
  );
}
