import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Bell, 
  BookOpen, 
  ChevronDown,
  User,
  Zap,
  Moon,
  Sun,
  LogOut,
  Database,
  HelpCircle,
  Palette
} from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

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
  const activePlan = plans.find(p => p.id === activePlanId);
  const isPremium = user?.current_plan === PLAN_IDS.PRO || user?.current_plan === PLAN_IDS.YEARLY;
  const isOwner = user?.role === 'owner' || user?.isOwner || user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase().includes('owner');
  const isTrial = user?.subscription_status === 'trial';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80px] py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 shrink-0" data-tour="brand-logo">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border border-purple-200 dark:border-purple-800/80 overflow-hidden shrink-0">
            <img src="/logo.png" alt="JSPilot Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                JSPilot
              </h1>
              <span className={`text-[10px] px-2 py-0.5 font-black rounded-full ${
                isTrial ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-xs animate-pulse' :
                isPremium ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs' : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
              }`}>
                {isTrial ? '7-DAY TRIAL ✨' : isPremium ? 'PRO ✨' : 'FREE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Your Personal Planning Assistant</p>
          </div>
        </div>
        
        {/* Active Plan Selector */}
        <div className="hidden md:flex items-center gap-3" data-tour="plan-selector">
          <div className="relative group">
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-purple-300 transition-all text-left shadow-xs">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">Current Plan</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {activePlan ? activePlan.title : 'Select a Plan'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 hidden group-hover:block z-50 animate-fade-in">
              <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider">Your Plans</p>
              <div className="space-y-1 my-1 max-h-48 overflow-y-auto">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPlan(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      p.id === activePlanId
                        ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                      p.type === 'exam' ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}>
                      {p.type}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1">
                <button
                  onClick={onOpenWizard}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Feature Tutorial Tour Button */}
          <button
            data-tour="tour-btn"
            onClick={onOpenTutorial}
            className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all text-xs font-bold flex items-center gap-1.5"
            title="Open Interactive Feature Walkthrough Tutorial"
          >
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden xl:inline">App Tour</span>
          </button>

          {/* Theme & Profile Customizer Button */}
          <button
            data-tour="profile-theme-btn"
            onClick={onOpenProfile}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-amber-400"
            title="Customize Multi-Color Themes & User Profile"
          >
            <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          </button>

          {/* User Database & SMTP Email Protocol Logger (RESTRICTED TO OWNER ONLY) */}
          {isOwner && (
            <button
              onClick={onOpenSmtpLogs}
              className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Inspect Registered User Database & SMTP Transcripts (Owner / Admin Only)"
            >
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden xl:inline">SMTP Database</span>
              <span className="text-[9px] font-black bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1 rounded">OWNER</span>
            </button>
          )}

          {/* User Profile & Account Settings Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all text-xs font-black shadow-xs"
                title="View User Profile & Details"
              >
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="hidden lg:inline">{user.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                  isTrial ? 'bg-purple-200 dark:bg-purple-900 text-purple-950 dark:text-purple-200' :
                  isPremium ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                }`}>
                  {isTrial ? '7-DAY TRIAL' : user.current_plan || 'FREE'}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                title="Sign Out to Login Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-600 hover:bg-purple-700 text-white transition-all text-xs font-black shadow-xs"
              title="Sign In to Your Account"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Pricing Link Button */}
          <button
            onClick={onOpenPricing}
            className="btn bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-xs font-bold py-2.5 px-3.5"
          >
            <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
            <span className="hidden sm:inline">Pricing</span>
          </button>

          {/* Quick Add Task Button */}
          <button
            data-tour="add-task-btn"
            onClick={onOpenQuickAdd}
            className="btn btn-secondary text-xs sm:text-sm font-bold border-slate-200 dark:border-slate-700 hover:border-purple-300 py-2.5 px-4"
          >
            <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Create Smart Plan CTA */}
          <button
            data-tour="create-plan-btn"
            onClick={onOpenWizard}
            className="btn btn-primary text-xs sm:text-sm font-extrabold py-2 px-4 shadow-md hover:shadow-purple-500/25 bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Create Smart Plan</span>
          </button>

          {/* Notifications Bell */}
          <button
            data-tour="notifications-bell"
            onClick={onToggleNotifs}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {notifCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
