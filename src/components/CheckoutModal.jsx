import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building2, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
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

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        planId: plan.id,
        billingCycle: plan.billingCycle,
        paymentMethod
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Secure Checkout
              </span>
              <span className="text-xs text-slate-400 font-bold">256-bit SSL Encrypted</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">Complete Subscription</h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">Plan Selected</span>
            <h3 className="text-base font-extrabold text-purple-950 dark:text-purple-200">{plan.name} Subscription</h3>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-purple-900 dark:text-purple-200">{plan.priceDisplay}</div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold">/ {plan.billingCycle}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    isSel
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-black shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-purple-300'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isSel ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-extrabold">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Details Input */}
        {paymentMethod === 'UPI' && (
          <div className="form-group">
            <label className="form-label text-slate-800 dark:text-slate-200 font-bold">UPI ID / VPA Address</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="form-control"
              placeholder="username@upi / mobile@gpay"
            />
          </div>
        )}

        {paymentMethod === 'CARD' && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
              <span>Card Number</span>
              <span>•••• •••• •••• 4242</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Supports Visa, Mastercard, RuPay, and American Express credit/debit cards.
            </p>
          </div>
        )}

        {paymentMethod === 'NETBANKING' && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              Select Bank: HDFC, SBI, ICICI, Axis, Kotak
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              You will be securely redirected to your bank's portal to complete authorization.
            </p>
          </div>
        )}

        {/* Security Guarantee Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Instant activation upon confirmation. SSL 256-bit encrypted security.</span>
        </div>

        {/* Production Checkout Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleProcessPayment}
            className="w-full btn btn-primary text-xs sm:text-sm font-black py-3.5 shadow-xl shadow-purple-500/25 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>{isProcessing ? 'Processing Payment...' : `🚀 Pay ${plan.priceDisplay} & Activate Plan`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
