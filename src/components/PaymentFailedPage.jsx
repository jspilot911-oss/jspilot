import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage({
  errorReason = 'Transaction declined by bank authorization server.',
  onRetryPayment,
  onReturnToDashboard
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900 animate-fade-in">
      <div className="card p-8 bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-md w-full text-center space-y-6">
        
        {/* Failed Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Payment Failed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Transaction Could Not Complete</h1>
          <p className="text-xs text-slate-500 mt-1">{errorReason}</p>
        </div>

        <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 text-xs text-slate-700 text-left space-y-1">
          <p className="font-bold text-red-900">What happened?</p>
          <p>No money was charged to your account. Your current plan remains safely on FREE with all your existing tasks intact.</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onRetryPayment}
            className="w-full btn btn-primary font-extrabold py-3 shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Payment Again</span>
          </button>

          <button
            onClick={onReturnToDashboard}
            className="w-full btn btn-secondary text-xs"
          >
            Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
