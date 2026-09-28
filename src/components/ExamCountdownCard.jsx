import React from 'react';
import { Calendar, Target, Clock, ShieldCheck, Flame } from 'lucide-react';

export default function ExamCountdownCard({ plan, selectedDate }) {
  if (!plan || plan.type !== 'exam') return null;

  // Calculate days remaining to exam target date
  let daysRemaining = 0;
  if (plan.targetDate) {
    const target = new Date(plan.targetDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Determine current active phase for selected date
  const scheduleMap = plan.scheduleMap || {};
  const currentDayData = scheduleMap[selectedDate] || {};
  const currentPhase = currentDayData.phase || 'Phase 1: Learning';

  const phases = [
    { name: 'Phase 1: Learning', label: '1. Learning', desc: 'Core Syllabus' },
    { name: 'Phase 2: Practice', label: '2. Practice', desc: 'Questions & Papers' },
    { name: 'Phase 3: Revision', label: '3. Revision', desc: 'Weak Topics' },
    { name: 'Phase 4: Mock Tests', label: '4. Mock Tests', desc: 'Simulations' },
    { name: 'Phase 5: Final Revision', label: '5. Final Touch', desc: 'High Weightage' }
  ];

  return (
    <div data-tour="exam-countdown" className="p-6 sm:p-7 mb-6 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 text-slate-900 dark:text-white shadow-md rounded-3xl relative overflow-hidden border-2 border-purple-200 dark:border-purple-800/80 transition-all">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-pink-300/30 dark:bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Section: Exam Details */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-200/80 dark:bg-pink-900/40 border border-pink-300 dark:border-pink-700/50 text-xs font-extrabold text-pink-950 dark:text-pink-300">
            <Target className="w-3.5 h-3.5 text-pink-700 dark:text-pink-400" />
            <span>Target Exam &bull; {plan.examName}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
            {plan.examName || 'Target Exam'}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-100 shadow-xs">
              <Calendar className="w-4 h-4 text-purple-700 dark:text-purple-300" />
              Target Date: <strong className="text-purple-950 dark:text-purple-200 font-black ml-1">{plan.targetDate}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-100 shadow-xs">
              <Clock className="w-4 h-4 text-pink-700 dark:text-pink-300" />
              Daily Capacity: <strong className="text-pink-950 dark:text-pink-200 font-black ml-1">{plan.availableHoursPerDay} hrs/day</strong>
            </span>
          </div>
        </div>

        {/* Center/Right Section: Prominent Days Countdown Badge */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-600 p-4 sm:p-5 rounded-2xl border border-purple-400/40 shadow-xl shadow-purple-500/20 text-white shrink-0 self-start md:self-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            <Flame className="w-8 h-8 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {daysRemaining} Days
            </div>
            <p className="text-[11px] font-black uppercase tracking-wider text-pink-100 mt-1">
              REMAINING TO EXAM
            </p>
          </div>
        </div>

      </div>

      {/* Strategic 5-Phase Pipeline Indicator */}
      <div className="mt-6 pt-5 border-t border-purple-200/80 dark:border-white/15 relative z-10">
        <p className="text-[11px] font-black uppercase tracking-wider text-purple-950 dark:text-purple-200 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          Adaptive Strategic Exam Phases
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {phases.map((p) => {
            const isActive = currentPhase.includes(p.label.split('.')[1].trim());
            return (
              <div
                key={p.name}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 border-purple-500 text-white font-black shadow-lg shadow-purple-500/25 scale-[1.02]'
                    : 'bg-white/90 dark:bg-slate-900/80 border-purple-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs hover:border-purple-300 hover:bg-white'
                }`}
              >
                <div className={`text-xs font-black flex items-center justify-between ${isActive ? 'text-white' : 'text-purple-950 dark:text-white'}`}>
                  <span>{p.label}</span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-pink-300 animate-ping" />}
                </div>
                <div className={`text-[10px] mt-1 font-bold ${isActive ? 'text-pink-100' : 'text-purple-700 dark:text-purple-300'}`}>
                  {p.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
