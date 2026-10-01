import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { SmtpService } from '../services/smtpService.js';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [examCategory, setExamCategory] = useState('');
  const [customExamName, setCustomExamName] = useState('');
  const [examLevel, setExamLevel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Format email to default to @gmail.com if domain is omitted
  const formatEmailWithDefaultDomain = (inputEmail) => {
    let trimmed = (inputEmail || '').trim();
    if (!trimmed) return '';
    if (!trimmed.includes('@')) {
      return `${trimmed}@gmail.com`;
    }
    if (trimmed.endsWith('@')) {
      return `${trimmed}gmail.com`;
    }
    return trimmed;
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      setEmail(formatEmailWithDefaultDomain(email));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedEmail = formatEmailWithDefaultDomain(email);

    if (!formattedEmail || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setEmail(formattedEmail);

    const existingUsers = await SmtpService.getUserDatabase();
    const existingUser = existingUsers.find(u => u.email && u.email.toLowerCase() === formattedEmail.toLowerCase());

    if (mode === 'register' && existingUser) {
      setErrorMsg('An account with this email address already exists. Please sign in instead.');
      return;
    }

    const fullGoal = examCategory === 'Other'
      ? (customExamName.trim() || 'Custom Goal')
      : (examLevel.trim() ? `${examCategory} ${examLevel.trim()}` : examCategory);

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const isOwner = formattedEmail.toLowerCase().includes('owner') || formattedEmail.toLowerCase().includes('admin');

    const resolvedGoal = mode === 'register'
      ? (fullGoal.trim() || 'General Tasks & Habits')
      : (existingUser?.targetGoal || existingUser?.target_goal || (fullGoal.trim() ? fullGoal.trim() : 'General Tasks & Habits'));

    const userData = {
      user_id: existingUser?.user_id || `usr_${Date.now()}`,
      name: mode === 'register' ? name.trim() : (existingUser?.name || formattedEmail.split('@')[0] || 'User'),
      email: formattedEmail,
      targetGoal: resolvedGoal,
      current_plan: existingUser?.current_plan || 'PRO',
      subscription_status: isOwner ? 'active' : (existingUser?.subscription_status || 'trial'),
      subscription_start: existingUser?.subscription_start || new Date().toISOString(),
      trial_start: existingUser?.trial_start || new Date().toISOString(),
      trial_end: existingUser?.trial_end || trialEnd.toISOString(),
      role: isOwner ? 'owner' : (existingUser?.role || 'user'),
      isOwner
    };

    onLoginSuccess(userData, mode);
    onClose();
  };

  const handleDemoLogin = async (demoName, demoEmail) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const existingUsers = await SmtpService.getUserDatabase();
    const existingUser = existingUsers.find(u => u.email && u.email.toLowerCase() === demoEmail.trim().toLowerCase());

    const userData = {
      user_id: existingUser?.user_id || `usr_demo_${Date.now()}`,
      name: demoName,
      email: demoEmail,
      targetGoal: existingUser?.targetGoal || existingUser?.target_goal || 'General Tasks & Habits',
      current_plan: 'PRO',
      subscription_status: 'trial',
      subscription_start: new Date().toISOString(),
      trial_start: new Date().toISOString(),
      trial_end: trialEnd.toISOString()
    };
    onLoginSuccess(userData, 'login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 sm:p-8 relative text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Branding */}
        <div className="text-center space-y-2 mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-900/90 p-1.5 border border-purple-400/30 shadow-md mx-auto flex items-center justify-center overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="JSPilot Logo" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to JSPilot' : 'Create Your JSPilot Account'}
          </h2>

          <p className="text-xs text-purple-700 dark:text-purple-300 font-bold max-w-xs mx-auto">
            Tell JSPilot what you need to finish. It builds the plan for you.
          </p>
        </div>

        {/* Login / Register Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700 relative z-10">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${mode === 'login'
              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${mode === 'register'
              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="form-control"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label text-slate-800 dark:text-slate-200">
              <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Email Address</span>
            </label>
            <input
              type="text"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="user@gmail.com"
              className="form-control"
            />
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              💡 "@gmail.com" will be appended automatically if omitted.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label text-slate-800 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="form-group mb-0">
                <label className="form-label text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Primary Goal / Exam Category</span>
                </label>
                <select
                  required
                  value={examCategory}
                  onChange={(e) => setExamCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="" disabled>-- Select Goal / Exam Category --</option>
                  <option value="Business & Profession">Business & Profession</option>
                  <option value="CA">CA (Chartered Accountancy)</option>
                  <option value="CMA">CMA (Cost & Management Accountant)</option>
                  <option value="CS">CS (Company Secretary)</option>
                  <option value="General Tasks & Habits">General Tasks & Habits</option>
                  <option value="JEE">JEE (Engineering Entrance)</option>
                  <option value="NEET">NEET (Medical Entrance)</option>
                  <option value="Software / Work Projects">Software / Work Projects</option>
                  <option value="SSC">SSC (Staff Selection Commission)</option>
                  <option value="University Studies">University Studies</option>
                  <option value="UPSC">UPSC (Civil Services)</option>
                  <option value="Other">Other (Type Custom Category)</option>
                </select>
              </div>

              {examCategory === 'Other' && (
                <div className="form-group mb-0">
                  <label className="form-label text-xs text-slate-700 dark:text-slate-300">
                    <span>Custom Exam Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customExamName}
                    onChange={(e) => setCustomExamName(e.target.value)}
                    placeholder="e.g. Banking, State PSC, GATE"
                    className="form-control text-xs"
                  />
                </div>
              )}

              {['Business & Profession', 'CA', 'CMA', 'CS', 'JEE', 'NEET', 'SSC', 'University Studies', 'UPSC', 'Other'].includes(examCategory) && (
                <div className="form-group mb-0">
                  <label className="form-label text-xs text-slate-700 dark:text-slate-300">
                    <span>Exam Level / Stage</span>
                  </label>
                  <input
                    type="text"
                    value={examLevel}
                    onChange={(e) => setExamLevel(e.target.value)}
                    placeholder="e.g. Intermediate, Final, Prelims, Mains, Tier 1, 12th"
                    className="form-control text-xs"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn btn-primary py-3 text-xs font-black shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Sign In to JSPilot' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Sign In Option */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center relative z-10">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Quick 1-Click Demo Accounts
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleDemoLogin('Demo User', 'student@example.com')}
              className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 text-xs font-bold hover:bg-purple-100"
            >
              Sign In as Demo User
            </button>
            <button
              onClick={() => handleDemoLogin('Alex Student', 'alex@jspilot.app')}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100"
            >
              Sign In as Alex
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}