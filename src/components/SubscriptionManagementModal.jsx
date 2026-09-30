import React from 'react';
import { X, Sparkles, ShieldCheck, Zap, LogOut } from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

export default function SubscriptionManagementModal({
  isOpen,
  user,
  onClose,
  onUpgradeClick,
  onCancelSubscription,
  onLogout
}) {
  if (!isOpen) return null;

  const isPremium = user?.current_plan === PLAN_IDS.PRO || user?.current_plan === PLAN_IDS.YEARLY;

  const formattedEndDate = user?.subscription_end
    ? new Date(user.subscription_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">User Account & Subscription</h3>
              <p className="text-xs text-slate-500">{user?.name} ({user?.email})</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subscription Card */}
        <div className={`p-5 rounded-2xl border ${
          isPremium 
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border-purple-800 shadow-lg' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
              isPremium ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              Plan: {user?.current_plan || 'FREE'}
            </span>

            {isPremium && (
              <span className="text-xs font-extrabold text-pink-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Premium Active ✓
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className={isPremium ? 'text-slate-300' : 'text-slate-500'}>Subscription Status:</span>
              <span className="font-bold capitalize">{user?.subscription_status || 'Active'}</span>
            </div>

            {isPremium && (
              <div className="flex justify-between">
                <span className="text-slate-300">Next Billing Date:</span>
                <span className="font-bold text-white">{formattedEndDate}</span>
              </div>
            )}

            {user?.latest_payment_ref && (
              <div className="flex justify-between text-[11px] pt-1">
                <span className={isPremium ? 'text-purple-300' : 'text-slate-400'}>Payment Ref:</span>
                <span className="font-mono">{user.latest_payment_ref}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {!isPremium ? (
            <button
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="w-full btn btn-primary text-xs font-extrabold py-3 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-pink-300 fill-pink-300" />
              <span>Upgrade to Smart Planner Pro (₹49/mo)</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onUpgradeClick();
                }}
                className="w-full btn btn-secondary text-xs font-bold"
              >
                Change Subscription Plan
              </button>

              <button
                onClick={() => {
                  onCancelSubscription();
                  onClose();
                }}
                className="w-full btn btn-secondary text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel Subscription
              </button>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out & Return to Login Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
