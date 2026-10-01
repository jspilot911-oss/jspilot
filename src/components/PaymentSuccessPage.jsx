import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentSuccessPage({
  subscription,
  onReturnToDashboard
}) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  }, []);

  const planName = subscription?.plan || 'PRO';
  const paymentRef = subscription?.payment_reference || 'PAY_SAMPLE_8923';
  const amount = subscription?.amount || 49;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900 animate-fade-in">
      <div className="card p-8 bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-md w-full text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Premium Active</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">Payment Successful!</h1>
          <p className="text-xs text-slate-500 mt-1">Your Smart Planner {planName} subscription is now active.</p>
        </div>

        {/* Transaction Details Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-500">Plan Tier:</span>
            <span className="font-extrabold text-purple-700">{planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid:</span>
            <span className="font-extrabold text-slate-900">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction Ref:</span>
            <span className="font-mono text-slate-700 text-[11px]">{paymentRef}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-[11px]">
            <span className="text-slate-500">Subscription Status:</span>
            <span className="font-bold text-emerald-600">Active ✓</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onReturnToDashboard}
          className="w-full btn btn-primary font-extrabold py-3 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
