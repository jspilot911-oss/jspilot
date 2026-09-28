import React from 'react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Zap,
  Target,
  Calendar,
  Sun,
  Moon,
  LogOut,
  Clock,
  Palette,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PLAN_IDS } from '../config/subscriptionPlans.js';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  theme = 'light',
  onSelectTheme,
  onOpenPricing,
  onLogout,
  onUpdateUserPlan
}) {
  if (!isOpen || !user) return null;

  const isOwner = user.role === 'owner' || user.isOwner || (user.email && (user.email.toLowerCase().includes('owner') || user.email.toLowerCase().includes('admin')));
  const isPro = user.current_plan === PLAN_IDS.PRO || user.current_plan === PLAN_IDS.YEARLY || isOwner;
  const isTrial = user.subscription_status === 'trial';

  let trialDaysLeft = 7;
  if (user.trial_end) {
    const end = new Date(user.trial_end);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const themesList = [
    { id: 'light', name: 'Light Slate ⚪', icon: Sun, color: 'bg-slate-100 text-slate-800 border-slate-300 font-extrabold' },
    { id: 'dark', name: 'Soft Dark 🌙', icon: Moon, color: 'bg-slate-700 text-slate-100 border-slate-600 font-extrabold' },
    { id: 'theme-cyber', name: 'Pastel Lavender 🪻', icon: Sparkles, color: 'bg-purple-200 text-purple-950 border-purple-400 font-extrabold' },
    { id: 'theme-ocean', name: 'Pastel Sky Blue 🌊', icon: Palette, color: 'bg-sky-200 text-sky-950 border-sky-400 font-extrabold' },
    { id: 'theme-emerald', name: 'Pastel Mint Emerald 🍃', icon: Palette, color: 'bg-emerald-200 text-emerald-950 border-emerald-400 font-extrabold' },
    { id: 'theme-rose', name: 'Pastel Candy Pink 🌸', icon: Palette, color: 'bg-pink-200 text-pink-950 border-pink-400 font-extrabold' },
    { id: 'theme-amber', name: 'Pastel Sunshine Amber ☀️', icon: Palette, color: 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold' },
    { id: 'theme-peach', name: 'Pastel Peach Coral 🍑', icon: Palette, color: 'bg-orange-200 text-orange-950 border-orange-400 font-extrabold' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto space-y-6">

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/25">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{user.name || 'User Profile'}</span>
                {isOwner && (
                  <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold px-2 py-0.5 rounded-full border border-pink-300 dark:border-pink-800">
                    OWNER ADMIN
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Free Trial / Subscription Status Card */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {isTrial ? '🎉 7-Day Free Trial Active' : isPro ? '✨ Smart Planner PRO Active' : '🆓 Free Plan'}
              </span>
            </div>

            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isPro ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
              {user.current_plan || 'FREE'}
            </span>
          </div>

          {isTrial && (
            <div className="p-3 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Trial Expiry: <strong>{trialDaysLeft} Days Remaining</strong></span>
              </span>
              <span className="text-[10px] font-mono bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded font-extrabold">
                ALL PRO UNLOCKED
              </span>
            </div>
          )}

          {/* Owner Plan Setter Controls */}
          {isOwner && onUpdateUserPlan && (
            <div className="p-3 rounded-xl bg-purple-100/80 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 space-y-2 text-xs">
              <div className="flex items-center justify-between font-black text-purple-950 dark:text-purple-200">
                <span>👑 Owner Control: Set Plan Tier</span>
                <span className="text-[9px] bg-purple-200 dark:bg-purple-900 px-1.5 py-0.5 rounded font-bold">ADMIN OVERRIDE</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateUserPlan(user.email, 'FREE')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black border transition-all ${
                    user.current_plan === 'FREE' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  Set FREE
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateUserPlan(user.email, 'PRO')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black border transition-all ${
                    user.current_plan === 'PRO' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 hover:bg-purple-50 border-purple-300 dark:bg-purple-900 dark:text-purple-200'
                  }`}
                >
                  Set PRO
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateUserPlan(user.email, 'YEARLY')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black border transition-all ${
                    user.current_plan === 'YEARLY' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-700 hover:bg-pink-50 border-pink-300 dark:bg-pink-950 dark:text-pink-200'
                  }`}
                >
                  Set YEARLY
                </button>
              </div>
            </div>
          )}

          {!isPro && (
            <button
              onClick={() => { onClose(); onOpenPricing(); }}
              className="w-full btn btn-primary py-2.5 text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 shadow-md"
            >
              <span>Upgrade to Unlimited PRO</span>
            </button>
          )}
        </div>

        {/* Profile Details List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Account Details</span>
          </h3>

          <div className="space-y-2 text-xs font-bold">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Account ID:</span>
              <span className="font-mono text-purple-700 dark:text-purple-300">{user.user_id}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Target Goal / Stage:</span>
              <span className="text-slate-900 dark:text-white font-black">{user.targetGoal || 'General Tasks'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Member Since:</span>
              <span className="text-slate-900 dark:text-white">
                {user.subscription_start ? new Date(user.subscription_start).toLocaleDateString() : 'Today'}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Color Theme Selector */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-pink-600" />
            <span>Select App Color Theme</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {themesList.map((t) => {
              const isSelected = theme === t.id;
              const ThemeIcon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs font-bold flex items-center gap-2 ${t.color} ${isSelected ? 'ring-2 ring-purple-600 shadow-md font-black' : 'opacity-80 hover:opacity-100'
                    }`}
                >
                  <ThemeIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="btn btn-secondary text-xs font-bold py-2 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary text-xs font-black py-2 px-5"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
