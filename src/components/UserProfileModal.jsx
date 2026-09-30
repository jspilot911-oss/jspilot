import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Edit3,
  Save
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
  onUpdateUserPlan,
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTargetGoal, setEditTargetGoal] = useState('');
  const presetGoals = [
    'Business & Profession',
    'CA Intermediate',
    'CA Final',
    'CA Foundation',
    'CMA (Cost & Management Accountant)',
    'CS (Company Secretary)',
    'General Tasks & Habits',
    'JEE (Engineering Entrance)',
    'NEET (Medical Entrance)',
    'Software / Work Projects',
    'SSC (Staff Selection Commission)',
    'University Studies',
    'UPSC (Civil Services)'
  ];

  const [isCustomGoal, setIsCustomGoal] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      const goal = user.targetGoal || 'General Tasks & Habits';
      setEditTargetGoal(goal);
      if (presetGoals.includes(goal)) {
        setIsCustomGoal(false);
      } else {
        setIsCustomGoal(true);
      }
    }
  }, [user, isOpen]);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName.trim() || user.name,
        email: editEmail.trim() || user.email,
        targetGoal: editTargetGoal.trim() || 'General Tasks & Habits'
      });
    }
    setIsEditing(false);
  };

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/25 shrink-0">
              {(isEditing ? editName : user.name) ? (isEditing ? editName : user.name).charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                <span>{user.name || 'User Profile'}</span>
                {isOwner && (
                  <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold px-2 py-0.5 rounded-full border border-pink-300 dark:border-pink-800 shrink-0">
                    OWNER ADMIN
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-black py-1.5 px-3 flex items-center gap-1.5"
                title="Edit User Profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary text-xs font-bold py-1.5 px-3"
              >
                Cancel
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editable Profile Form vs Details View */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 animate-fade-in">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Account Details</span>
            </h3>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-control text-xs"
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Email Address</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="form-control text-xs"
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Primary Goal / Occupation</label>
              <select
                value={isCustomGoal ? 'Other' : editTargetGoal}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Other') {
                    setIsCustomGoal(true);
                  } else {
                    setIsCustomGoal(false);
                    setEditTargetGoal(val);
                  }
                }}
                className="form-control text-xs font-bold"
              >
                {presetGoals.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
                <option value="Other">Other / Custom Goal...</option>
              </select>
            </div>

            {isCustomGoal && (
              <div className="form-group mb-0 mt-2">
                <label className="form-label text-xs text-purple-700 dark:text-purple-300">Custom Goal / Stage Name</label>
                <input
                  type="text"
                  required
                  value={editTargetGoal}
                  onChange={(e) => setEditTargetGoal(e.target.value)}
                  placeholder="e.g. CA Intermediate, JEE Main, Senior Developer"
                  className="form-control text-xs font-bold"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary text-xs font-bold py-2 px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-xs font-black py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* Profile Details Card */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Account Details</span>
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Full Name:</span>
                <span className="text-slate-900 dark:text-white font-black">{user.name || 'User'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Email Address:</span>
                <span className="text-slate-900 dark:text-white font-bold">{user.email}</span>
              </div>

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
        )}

        {/* Subscription Status Card */}
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
