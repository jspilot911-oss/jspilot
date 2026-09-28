import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  UserPlus,
  Brain,
  Target,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { SmtpService } from '../services/smtpService.js';

export default function LoginPage({
  onLoginSuccess,
  theme = 'light',
  onToggleTheme
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [customExamName, setCustomExamName] = useState('');
  const [examLevel, setExamLevel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (mode === 'register') {
      const existingUsers = SmtpService.getUserDatabase();
      const duplicate = existingUsers.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
      if (duplicate) {
        setErrorMsg('An account with this email address already exists. Please sign in instead.');
        return;
      }
    }

    const fullGoal = examCategory === 'Other'
      ? (customExamName.trim() || 'Custom Goal')
      : (examLevel.trim() ? `${examCategory} ${examLevel.trim()}` : examCategory);

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const isOwner = email.toLowerCase().includes('owner') || email.toLowerCase().includes('admin');
    const userData = {
      user_id: `usr_${Date.now()}`,
      name: mode === 'register' ? name.trim() : (email.split('@')[0] || 'User'),
      email: email.trim(),
      targetGoal: fullGoal || 'CA Intermediate',
      current_plan: 'PRO',
      subscription_status: isOwner ? 'active' : 'trial',
      subscription_start: new Date().toISOString(),
      trial_start: new Date().toISOString(),
      trial_end: trialEnd.toISOString(),
      role: isOwner ? 'owner' : 'user',
      isOwner
    };

    onLoginSuccess(userData, mode);
  };

  const handleDemoLogin = (demoName, demoEmail, role = 'user') => {
    const isOwner = role === 'owner' || demoEmail.toLowerCase().includes('owner') || demoEmail.toLowerCase().includes('admin');
    const userData = {
      user_id: `usr_demo_${Date.now()}`,
      name: demoName,
      email: demoEmail,
      targetGoal: 'CA / Professional Prep',
      current_plan: isOwner ? 'PRO' : 'FREE',
      subscription_status: 'active',
      subscription_start: new Date().toISOString(),
      role: isOwner ? 'owner' : 'user',
      isOwner
    };
    onLoginSuccess(userData, 'login');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#090D16] text-white' : 'bg-slate-50 text-slate-900'} flex flex-col justify-between font-sans relative overflow-hidden transition-colors`}>
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border border-purple-200 dark:border-purple-800 shrink-0">
            <img src="/logo.png" alt="JSPilot Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              JSPilot
              <span className="text-[10px] px-2 py-0.5 font-extrabold rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                PRO ENGINE
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Your Personal AI Planning Assistant</p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Login / Register Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
        
        {/* Left Hero Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-black border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Welcome to JSPilot</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Plan smarter, achieve faster, <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              stress less.
            </span>
          </h1>

          <p className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Tell JSPilot what you need to finish. It builds the plan for you, calculates priority mathematical weights, and reschedules missed tasks automatically.
          </p>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white">Smart Engine</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Automated daily timetables</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white">Priority Engine</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real mathematical weighting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create Free Account'}
            </h2>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-bold">
              Sign in to access your personal workspace
            </p>
          </div>

          {/* Login / Register Toggle Switch */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-slate-800 dark:text-slate-200">
                <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
              />
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
                    <option value="CA">CA (Chartered Accountancy)</option>
                    <option value="CS">CS (Company Secretary)</option>
                    <option value="CMA">CMA (Cost & Management Accountant)</option>
                    <option value="SSC">SSC (Staff Selection Commission)</option>
                    <option value="UPSC">UPSC (Civil Services)</option>
                    <option value="JEE">JEE (Engineering Entrance)</option>
                    <option value="NEET">NEET (Medical Entrance)</option>
                    <option value="University Studies">University Studies</option>
                    <option value="Software / Work Projects">Software / Work Projects</option>
                    <option value="General Tasks & Habits">General Tasks & Habits</option>
                    <option value="Other">Other (Type Custom Exam)</option>
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

                {['CA', 'CS', 'CMA', 'SSC', 'UPSC', 'JEE', 'NEET', 'Other'].includes(examCategory) && (
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
              className="w-full btn btn-primary py-3 text-xs font-black shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? 'Sign In & Launch Dashboard' : 'Create Free Account & Start'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} JSPilot. Automated Planning & Exam Preparation System.</p>
      </footer>

    </div>
  );
}
