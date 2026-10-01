import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

export default function FreeUpgradeBanner({
  user,
  onExplorePro
}) {
  const isOwner = user?.role === 'owner' || user?.isOwner || (user?.email && (user.email.toLowerCase().includes('owner') || user.email.toLowerCase().includes('admin')));
  const isSubscribed = user?.subscription_status === 'active' || isOwner;

  const now = new Date();
  const regDate = user?.subscription_start || user?.trial_start ? new Date(user.subscription_start || user.trial_start) : new Date();
  const trialEnd = user?.trial_end ? new Date(user.trial_end) : new Date(regDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const isTrialActive = !isSubscribed && user?.subscription_status === 'trial' && now <= trialEnd;
  const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const formattedRegDate = regDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedEndDate = trialEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isSubscribed) {
    return (
      <div className="card p-4 mb-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-purple-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300 shrink-0">
            <Sparkles className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>JSPilot Pro Active</span>
              <span className="text-[10px] bg-pink-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {user?.current_plan || 'PRO'}
              </span>
            </h3>
            <p className="text-xs text-slate-200 font-semibold mt-0.5">
              Full unlimited access active. All priority engines & automated rescheduling unlocked.
            </p>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/80 flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Subscribed ✓
        </span>
      </div>
    );
  }

  if (isTrialActive) {
    return (
      <div className="card p-4 sm:p-5 mb-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white border-2 border-purple-400/40 shadow-lg rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shrink-0 shadow-md">
            <Zap className="w-5 h-5 fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="text-sm sm:text-base font-black text-white">
                7-Day Free PRO Trial Active
              </h3>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-xs">
                ⏳ {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
              </span>
            </div>
            <p className="text-xs text-purple-100 font-bold">
              Registered on <strong>{formattedRegDate}</strong> • Free PRO Trial ends on <strong>{formattedEndDate}</strong> (7 Days). Subscribe anytime to keep PRO access!
            </p>
          </div>
        </div>

        <button
          onClick={onExplorePro}
          className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-md shrink-0 self-end sm:self-center flex items-center gap-1.5 border border-pink-300/30"
        >
          <span>Subscribe to Pro</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

      </div>
    );
  }

  // Trial Expired (Reverted to Free Plan)
  return (
    <div className="card p-4 sm:p-5 mb-6 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-purple-500/10 border-2 border-amber-500/40 text-slate-900 dark:text-white shadow-sm rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-amber-600 text-white shrink-0 shadow-md">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm sm:text-base font-black text-amber-900 dark:text-amber-300">
              7-Day Free Trial Expired
            </h3>
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full">
              Free Plan (Limited)
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            Your 7-day registration trial ended on <strong>{formattedEndDate}</strong>. Subscribe now to unlock unlimited plans, calendar view, and auto-rescheduling!
          </p>
        </div>
      </div>

      <button
        onClick={onExplorePro}
        className="btn bg-gradient-to-r from-amber-600 to-purple-700 hover:from-amber-700 hover:to-purple-800 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-md shrink-0 self-end sm:self-center flex items-center gap-1.5"
      >
        <span>Subscribe to Pro Now</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>

    </div>
  );
}
