import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Award, 
  ArrowLeft, 
  HelpCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, COMPARISON_FEATURES, PLAN_IDS } from '../config/subscriptionPlans.js';

import logoImg from '../assets/logo.png';

export default function PricingPage({
  user,
  onSelectPlanToBuy,
  onBackToDashboard
}) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const isFreeUser = !user?.current_plan || user?.current_plan === PLAN_IDS.FREE;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 animate-fade-in">
      
      {/* Top Header & Navigation */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 border border-purple-200 shadow-sm flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="JSPilot Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-extrabold text-slate-800">JSPilot</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
          <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
          <span>7-Day Free Trial Included &bull; Pro SaaS Pricing &bull; Cancel Anytime</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Tell JSPilot what you need to finish. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            It builds the plan for you.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
          Plan. Prioritize. Track. Reschedule. Achieve. Start your 7-Day Free Trial of Pro to unlock dynamic automatic scheduling, missed task recovery, and unlimited plans.
        </p>

        {/* Monthly vs Yearly Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Monthly Billing
          </span>

          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-14 h-8 rounded-full p-1 transition-colors relative ${
              billingCycle === 'yearly' ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>

          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-purple-700' : 'text-slate-400'}`}>
            <span>Yearly Billing</span>
            <span className="bg-pink-100 text-pink-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-pink-200">
              Save 33%
            </span>
          </span>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16">
        
        {/* FREE Card */}
        <div className="card p-6 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col justify-between relative">
          <div>
            <h3 className="text-lg font-bold text-slate-800">FREE</h3>
            <p className="text-xs text-slate-500 mt-1">{SUBSCRIPTION_PLANS.FREE.description}</p>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              <span className="text-xs text-slate-400 font-medium ml-1">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Account creation & basic dashboard</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 Active Plan limit</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic task checklist & manual creation</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic priority tags</span>
              </li>
              {isFreeUser && (
                <li className="flex items-center gap-2 font-bold text-purple-700 bg-purple-50 p-2 rounded-xl border border-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Includes 7-Day Free Trial of PRO for all new users</span>
                </li>
              )}
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 shrink-0" />
                <span className="line-through">Automatic rescheduling</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlanToBuy(PLAN_IDS.FREE)}
            className="w-full btn btn-secondary text-xs font-bold py-3"
            disabled={user?.current_plan === PLAN_IDS.FREE}
          >
            {user?.current_plan === PLAN_IDS.FREE ? 'Current Plan' : 'Start Free'}
          </button>
        </div>

        {/* PRO Card (MOST POPULAR) */}
        <div className="card p-6 bg-white border-2 border-purple-500 shadow-xl rounded-3xl flex flex-col justify-between relative transform md:-translate-y-2">
          
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-purple-600 text-white text-[11px] font-extrabold tracking-wider shadow-md">
            MOST POPULAR
          </div>

          <div>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-lg font-extrabold text-purple-900">PRO</h3>
              {isFreeUser && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                  🎁 7-Day Free Trial
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{SUBSCRIPTION_PLANS.PRO.description}</p>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-slate-900">₹49</span>
              <span className="text-xs text-slate-500 font-medium ml-1">/ month</span>
              {isFreeUser && (
                <p className="text-[11px] font-extrabold text-purple-600 mt-1">7 Days Free Trial, then ₹49/month</p>
              )}
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
              {isFreeUser && (
                <li className="flex items-center gap-2 font-bold text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>7-Day Free Trial for all new users</span>
                </li>
              )}
              <li className="flex items-center gap-2 font-bold text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Everything in FREE +</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited active plans & tasks</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Automatic Intelligent Priority Engine</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Automatic Rescheduling & Missed Recovery</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>5-Phase Exam & Syllabus Planner</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Interactive Calendar & Study Analytics</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlanToBuy(PLAN_IDS.PRO)}
            className="w-full btn btn-primary text-xs font-extrabold py-3 shadow-lg shadow-purple-500/30 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {user?.current_plan === PLAN_IDS.PRO ? 'Current Active Plan' : 'Start 7-Day Free Trial'}
          </button>
        </div>

        {/* YEARLY Card (BEST VALUE) */}
        <div className="card p-6 bg-gradient-to-b from-purple-50 to-white border border-purple-200 shadow-lg rounded-3xl flex flex-col justify-between relative">
          
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold tracking-wider shadow-md">
            BEST VALUE
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-2">YEARLY</h3>
            <p className="text-xs text-slate-500 mt-1">{SUBSCRIPTION_PLANS.YEARLY.description}</p>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-slate-900">₹499</span>
              <span className="text-xs text-slate-500 font-medium ml-1">/ year</span>
              <div className="text-[11px] font-bold text-purple-600 mt-1">
                Standard Annual Plan (~₹41/month)
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Everything in PRO for 1 Year</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Guaranteed lowest price lock</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Priority support & plan health analysis</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-pink-500 shrink-0" />
                <span>All future engine upgrades included</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlanToBuy(PLAN_IDS.YEARLY)}
            className="w-full btn bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 text-white text-xs font-extrabold py-3 shadow-lg hover:shadow-pink-500/25"
          >
            {user?.current_plan === PLAN_IDS.YEARLY ? 'Current Active Plan' : 'Get Yearly'}
          </button>
        </div>

      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">Comprehensive Plan Comparison</h2>
          <p className="text-xs text-slate-500">Transparent feature matrix with no hidden fees</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-center">FREE</th>
                <th className="py-3 px-4 text-center text-purple-700 bg-purple-50/60 rounded-t-xl">PRO</th>
                <th className="py-3 px-4 text-center">YEARLY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {COMPARISON_FEATURES.map((feat) => (
                <tr key={feat.key} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{feat.label}</td>
                  
                  <td className="py-3 px-4 text-center text-slate-600">
                    {typeof feat.free === 'boolean' ? (
                      feat.free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span className="font-bold">{feat.free}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-purple-900 bg-purple-50/40">
                    {typeof feat.pro === 'boolean' ? (
                      feat.pro ? <Check className="w-4 h-4 text-purple-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span>{feat.pro}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    {typeof feat.yearly === 'boolean' ? (
                      feat.yearly ? <Check className="w-4 h-4 text-pink-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span>{feat.yearly}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
