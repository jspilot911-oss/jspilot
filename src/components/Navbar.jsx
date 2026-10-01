import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Bell, 
  BookOpen, 
  ChevronDown,
  ChevronUp,
  User,
  Zap,
  LogOut,
  Database,
  HelpCircle,
  MessageSquare,
  Palette,
  SlidersHorizontal
} from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

import logoImg from '../assets/logo.png';

export default function Navbar({
  plans = [],
  activePlanId,
  onSelectPlan,
  onOpenWizard,
  onOpenQuickAdd,
  notifCount = 0,
  onToggleNotifs,
  user,
  onOpenSubscriptionModal,
  onOpenAuthModal,
  onOpenPricing,
  theme = 'light',
  onToggleTheme,
  onLogout,
  onOpenSmtpLogs,
  onOpenProfile,
  onOpenTutorial
}) {
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const activePlan = plans.find(p => p.id === activePlanId);
  const isPremium = user?.current_plan === PLAN_IDS.PRO || user?.current_plan === PLAN_IDS.YEARLY;
  const isOwner = user?.role === 'owner' || user?.isOwner || user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase().includes('owner');
  const isTrial = user?.subscription_status === 'trial';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-30 transition-colors">
      
      {/* Top Header Bar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo, Title, Badges */}
        <div className="flex items-center gap-3 shrink-0" data-tour="brand-logo">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border border-purple-200 dark:border-purple-800/80 overflow-hidden shrink-0">
            <img src={logoImg} alt="JSPilot Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                JSPilot
              </h1>
              <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 font-black rounded-full leading-none shrink-0 ${
                isTrial ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-xs animate-pulse' :
                isPremium ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs' : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
              }`}>
                {isTrial ? '7-DAY TRIAL ✨' : isPremium ? 'PRO ✨' : 'FREE'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-300 font-extrabold tracking-tight mt-0.5 whitespace-nowrap block">
              Your Personal Planning Assistant
            </p>
          </div>
        </div>

        {/* DESKTOP VIEW (md:flex) - Always Visible Horizontal Actions */}
        <div className="hidden md:flex items-center justify-end gap-3 flex-1 min-w-0">
          
          {/* Active Plan Selector */}
          <div data-tour="plan-selector" className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">Plan:</span>
            <div className="relative flex items-center">
              <select
                value={activePlanId}
                onChange={(e) => onSelectPlan(e.target.value)}
                className="bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 pr-6 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-purple-500/30 max-w-[170px] truncate"
              >
                {plans && plans.length > 0 ? (
                  plans.map(p => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                      {p.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    No Active Plan
                  </option>
                )}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              data-tour="create-plan-btn"
              onClick={onOpenWizard}
              className="btn btn-primary text-xs font-black py-2 px-3.5 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Plan</span>
            </button>

            <button
              data-tour="add-task-btn"
              onClick={onOpenQuickAdd}
              className="btn btn-secondary text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              <span>Add Task</span>
            </button>

            <button
              data-tour="pricing-btn"
              onClick={onOpenPricing}
              className="btn bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-purple-200 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              <span>Pricing</span>
            </button>

            <button
              data-tour="app-tour-btn"
              onClick={onOpenTutorial}
              className="btn btn-secondary text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>App Tour</span>
            </button>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdAsHe9gkodxeSkOQL4mCeSJfgsTlZwExzTFD9lBiCtMwmBJg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-pink-100 transition-all"
              title="Give Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Feedback</span>
            </a>
          </div>

          {/* Utility Icons & Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
            
            {isOwner && (
              <button
                onClick={onOpenSmtpLogs}
                className="px-2.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-black text-xs flex items-center gap-1"
                title="View User Database & SMTP Logs"
              >
                <Database className="w-3.5 h-3.5" />
                <span>DB</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              data-tour="notifications-bell"
              onClick={onToggleNotifs}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Logo Button */}
            <button
              data-tour="profile-btn"
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white font-black text-xs flex items-center justify-center shadow-md border border-purple-300 dark:border-purple-700 hover:scale-105 transition-all shrink-0"
              title="User Profile & Settings"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
            </button>

            {/* Sign Out Button */}
            {user && (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 font-extrabold text-xs flex items-center gap-1.5 hover:bg-red-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

        </div>

        {/* MOBILE VIEW RIGHT ACTIONS (md:hidden) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          
          <button
            data-tour="notifications-bell"
            onClick={onToggleNotifs}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {notifCount}
              </span>
            )}
          </button>

          <button
            data-tour="profile-btn"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xs flex items-center justify-center shadow-xs border border-purple-300 dark:border-purple-700 shrink-0"
            title="User Profile & Settings"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
          </button>

          <button
            onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}
            className="px-2.5 py-1.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-black flex items-center gap-1 shadow-xs hover:bg-purple-100 transition-all"
            title="Toggle Quick Actions Toolbar"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            {isMobileActionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>

      {/* MOBILE COLLAPSIBLE DRAWER (md:hidden) */}
      {isMobileActionsOpen && (
        <div className="md:hidden bg-slate-50/95 dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-800 p-3 px-4 animate-fade-in transition-all">
          <div className="flex flex-col gap-3">
            
            {/* Active Plan Selector Dropdown */}
            <div data-tour="plan-selector" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">Active Plan:</span>
              <div className="relative flex-1">
                <select
                  value={activePlanId}
                  onChange={(e) => onSelectPlan(e.target.value)}
                  className="form-control text-xs font-bold py-1.5 px-3 pr-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 w-full appearance-none cursor-pointer"
                >
                  {plans && plans.length > 0 ? (
                    plans.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.type})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No Active Plan</option>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                data-tour="create-plan-btn"
                onClick={() => { onOpenWizard(); setIsMobileActionsOpen(false); }}
                className="btn btn-primary text-xs font-black py-2 px-3 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Plan</span>
              </button>

              <button
                data-tour="add-task-btn"
                onClick={() => { onOpenQuickAdd(); setIsMobileActionsOpen(false); }}
                className="btn btn-secondary text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600" />
                <span>Add Task</span>
              </button>

              <button
                data-tour="pricing-btn"
                onClick={() => { onOpenPricing(); setIsMobileActionsOpen(false); }}
                className="btn bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                <span>Pricing</span>
              </button>

              <button
                data-tour="app-tour-btn"
                onClick={() => { onOpenTutorial(); setIsMobileActionsOpen(false); }}
                className="btn btn-secondary text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>App Tour</span>
              </button>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdAsHe9gkodxeSkOQL4mCeSJfgsTlZwExzTFD9lBiCtMwmBJg/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileActionsOpen(false)}
                className="btn bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Feedback</span>
              </a>
            </div>

            {/* Owner & Account Links */}
            {(isOwner || user) && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                {isOwner && (
                  <button
                    onClick={() => { onOpenSmtpLogs(); setIsMobileActionsOpen(false); }}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-black flex items-center gap-1"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Database Logs</span>
                  </button>
                )}
                {user && (
                  <button
                    onClick={() => { onLogout(); setIsMobileActionsOpen(false); }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 font-bold flex items-center gap-1 ml-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
}
