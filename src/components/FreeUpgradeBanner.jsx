import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

export default function FreeUpgradeBanner({
  user,
  onExplorePro
}) {
  const isPremium = user?.current_plan === PLAN_IDS.PRO || user?.current_plan === PLAN_IDS.YEARLY;

  if (isPremium) {
    return (
      <div className="card p-4 mb-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-purple-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300 shrink-0">
            <Sparkles className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>You are using JSPilot Pro</span>
              <span className="text-[10px] bg-pink-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {user?.current_plan}
              </span>
            </h3>
            <p className="text-xs text-slate-200 font-semibold mt-0.5">
              Your intelligent priority engine, automatic rescheduling, and study tracking features are active.
            </p>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/80 flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Active ✓
        </span>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-5 mb-6 bg-gradient-to-r from-purple-100 via-indigo-50 to-pink-100 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-purple-300 dark:border-purple-800 shadow-sm rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-purple-700 text-white shrink-0 shadow-md">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-purple-950 dark:text-white flex items-center gap-2">
            <span>Upgrade to JSPilot Pro</span>
          </h3>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-bold mt-0.5">
            Tell JSPilot what you need to finish. It builds the plan for you.
          </p>
        </div>
      </div>

      <button
        onClick={onExplorePro}
        className="btn bg-purple-700 hover:bg-purple-800 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-md shrink-0 self-end sm:self-center flex items-center gap-1.5"
      >
        <span>Explore Pro</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>

    </div>
  );
}
