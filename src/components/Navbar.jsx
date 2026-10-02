import React, { useState, useRef, useEffect } from 'react';
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
  SlidersHorizontal,
  MoreHorizontal
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  const isPremium = user?.current_plan === PLAN_IDS.PRO || user?.current_plan === PLAN_IDS.YEARLY;
  const isOwner = user?.role === 'owner' || user?.isOwner || user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase().includes('owner');
  const isTrial = user?.subscription_status === 'trial';

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors shadow-xs">
      
      {/* Top Header Bar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo & Title & Plan Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5" data-tour="brand-logo">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-xs border border-purple-200 dark:border-purple-800/80 overflow-hidden shrink-0">
              <img src={logoImg} alt="JSPilot Logo" className="w-full h-full object-contain" />
            </div>
            
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  JSPilot
                </h1>
                <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 font-black rounded-full leading-none shrink-0 ${
                  isTrial ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-xs animate-pulse' :
                  isPremium ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs' : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                }`}>
                  {isTrial ? '7-DAY TRIAL ✨' : isPremium ? 'PRO ✨' : 'FREE'}
                </span>
              </div>
              <p className="text-[10px] text-purple-700 dark:text-purple-300 font-extrabold tracking-tight mt-0.5 whitespace-nowrap hidden xl:block">
                Your Personal Planning Assistant
              </p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Active Plan Selector Pill (Desktop / Tablet) */}
          <div data-tour="plan-selector" className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shrink-0 max-w-[200px] md:max-w-[240px]">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">Plan:</span>
            <div className="relative flex items-center flex-1 min-w-0">
              <select
                value={activePlanId}
                onChange={(e) => onSelectPlan(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white pr-5 appearance-none cursor-pointer outline-none w-full truncate"
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
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* DESKTOP VIEW (md:flex) - Primary CTAs, Secondary Menu, Utility icons */}
        <div className="hidden md:flex items-center justify-end gap-2 sm:gap-2.5 flex-1 min-w-0">
          
          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              data-tour="create-plan-btn"
              onClick={onOpenWizard}
              className="btn btn-primary text-xs font-black py-2 px-3 sm:px-3.5 shadow-xs hover:shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Plan</span>
            </button>

            <button
              data-tour="add-task-btn"
              onClick={onOpenQuickAdd}
              className="btn bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Secondary Buttons (Directly visible on XL screens, collapsed into "More" dropdown on MD/LG screens) */}
          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            <button
              data-tour="pricing-btn"
              onClick={onOpenPricing}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              <span>Pricing</span>
            </button>

            <button
              data-tour="app-tour-btn"
              onClick={onOpenTutorial}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>App Tour</span>
            </button>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdAsHe9gkodxeSkOQL4mCeSJfgsTlZwExzTFD9lBiCtMwmBJg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-black flex items-center gap-1.5 transition-all"
              title="Give Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Feedback</span>
            </a>
          </div>

          {/* "More Actions" Dropdown for MD/LG screens */}
          <div className="relative xl:hidden" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-black flex items-center gap-1 transition-all"
              title="More Features & Links"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in">
                <button
                  data-tour="pricing-btn"
                  onClick={() => { onOpenPricing(); setIsMoreMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                  <span>Upgrade / Pricing</span>
                </button>

                <button
                  data-tour="app-tour-btn"
                  onClick={() => { onOpenTutorial(); setIsMoreMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>App Tour Guide</span>
                </button>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdAsHe9gkodxeSkOQL4mCeSJfgsTlZwExzTFD9lBiCtMwmBJg/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Send Feedback</span>
                </a>

                {isOwner && (
                  <button
                    onClick={() => { onOpenSmtpLogs(); setIsMoreMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Database & Logs</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Utility Icons & User Profile */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
            
            {/* Owner DB Button (XL screens) */}
            {isOwner && (
              <button
                onClick={onOpenSmtpLogs}
                className="hidden xl:flex px-2.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-black text-xs items-center gap-1 hover:bg-purple-200 transition-all"
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
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              data-tour="profile-btn"
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white font-black text-xs flex items-center justify-center shadow-xs border border-purple-300 dark:border-purple-700 hover:scale-105 transition-all shrink-0"
              title="User Profile & Settings"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
            </button>

            {/* Sign Out Button */}
            {user && (
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 font-extrabold text-xs flex items-center gap-1 hover:bg-red-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            )}
          </div>

        </div>

        {/* MOBILE VIEW RIGHT ACTIONS (< md) */}
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
            className="p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-black flex items-center gap-1 shadow-xs hover:bg-purple-100 transition-all"
            title="Toggle Quick Actions Toolbar"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            {isMobileActionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>

      {/* MOBILE COLLAPSIBLE DRAWER (< md) */}
      {isMobileActionsOpen && (
        <div className="md:hidden bg-slate-50/95 dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-800 p-3.5 px-4 animate-fade-in transition-all">
          <div className="flex flex-col gap-3">
            
            {/* Active Plan Selector Dropdown */}
            <div data-tour="plan-selector" className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">Plan:</span>
              <div className="relative flex-1">
                <select
                  value={activePlanId}
                  onChange={(e) => onSelectPlan(e.target.value)}
                  className="w-full text-xs font-bold bg-transparent text-slate-900 dark:text-white pr-6 appearance-none cursor-pointer outline-none"
                >
                  {plans && plans.length > 0 ? (
                    plans.map(p => (
                      <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                        {p.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">No Active Plan</option>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                data-tour="create-plan-btn"
                onClick={() => { onOpenWizard(); setIsMobileActionsOpen(false); }}
                className="btn btn-primary text-xs font-black py-2.5 px-3 shadow-xs bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Plan</span>
              </button>

              <button
                data-tour="add-task-btn"
                onClick={() => { onOpenQuickAdd(); setIsMobileActionsOpen(false); }}
                className="btn bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black py-2.5 px-3 flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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
                className="btn bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-200"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>App Tour</span>
              </button>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdAsHe9gkodxeSkOQL4mCeSJfgsTlZwExzTFD9lBiCtMwmBJg/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileActionsOpen(false)}
                className="col-span-2 btn bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-black py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Give Feedback</span>
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
                    className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 font-extrabold flex items-center gap-1 ml-auto"
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
