import React from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Gift
} from 'lucide-react';

export default function StartFreeTrialModal({
  isOpen,
  onClose,
  onActivateTrial
}) {
  if (!isOpen) return null;

  const today = new Date();
  const trialEnd = new Date();
  trialEnd.setDate(today.getDate() + 7);

  const formattedStart = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedEnd = trialEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const trialFeatures = [
    { title: 'Automated Carry-Forward Rescheduling', desc: 'Missed a task? The engine automatically rebalances your timetable.' },
    { title: 'Full Interactive Calendar View', desc: 'Visualize your entire month, subject workloads, and exam milestones.' },
    { title: 'Intelligent Priority Engine', desc: 'Mathematical urgency weighting (Critical, High, Medium, Low).' },
    { title: 'Integrated Pomodoro Clock & Alarms', desc: 'Focus timer with custom start/due time notification pops.' },
    { title: 'Unlimited Smart Plans', desc: 'Create preparation plans for multiple exams and habits.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/40 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative text-slate-900 dark:text-white space-y-6 overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute -right-20 -top-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-0.5 mx-auto shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Gift className="w-8 h-8 text-pink-400 animate-bounce" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-black border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Special Welcome Offer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Start Your 7-Day Free PRO Trial
          </h2>

          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Get full access to JSPilot's automated AI planning, calendar view, and rescheduling for 7 days FREE.
          </p>
        </div>

        {/* Trial Schedule Date Highlight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Trial Start Date</span>
            <p className="font-extrabold text-slate-900 dark:text-white">{formattedStart}</p>
          </div>
          <div className="h-8 w-px bg-purple-200 dark:bg-purple-800" />
          <div>
            <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Trial End Date (7 Days)</span>
            <p className="font-extrabold text-slate-900 dark:text-white">{formattedEnd}</p>
          </div>
          <div className="h-8 w-px bg-purple-200 dark:bg-purple-800" />
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Total Price</span>
            <p className="font-black text-emerald-600 dark:text-emerald-400">$0.00 FREE</p>
          </div>
        </div>

        {/* Included Features List */}
        <div className="space-y-2.5 relative z-10">
          <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Included in your 7-Day Trial:
          </p>
          {trialFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-extrabold">{feat.title}: </strong>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{feat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 relative z-10">
          <button
            onClick={onActivateTrial}
            className="w-full btn btn-primary py-3.5 text-xs sm:text-sm font-black shadow-xl shadow-purple-500/25 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
          >
            <span>🚀 Activate 7-Day Free Trial Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1"
          >
            Continue with Limited Free Plan
          </button>
        </div>

      </div>
    </div>
  );
}
