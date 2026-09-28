import React from 'react';
import { 
  Sparkles, 
  Edit3, 
  RefreshCw, 
  Zap, 
  Pause, 
  Play, 
  RotateCcw,
  Trash2
} from 'lucide-react';

export default function PlanControlsBar({
  plan,
  onOpenWizard,
  onEditPlan,
  onRegenerate,
  onReschedule,
  onTogglePause,
  onResetPlan,
  onDeletePlan
}) {
  if (!plan) return null;

  const isPaused = plan.isPaused || false;

  const cleanTitle = (plan.title || 'My Smart Plan').replace(/\s*\(Reset\)\s*/g, '');

  return (
    <div data-tour="plan-controls" className="card p-4 sm:p-5 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors">
      
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className={`w-3.5 h-3.5 rounded-full ${isPaused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 pulse-glow'}`} />
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{cleanTitle}</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
              isPaused ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
            }`}>
              {isPaused ? 'PAUSED' : 'ACTIVE'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            {plan.type === 'exam' ? `Exam: ${plan.examName || 'Custom Exam'}` : 'General Tasks Plan'} &bull; {plan.availableHoursPerDay || 4} hrs/day target capacity
          </p>
        </div>
      </div>

      {/* Control Buttons Group */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Create Plan */}
        <button
          onClick={onOpenWizard}
          className="btn bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 hover:bg-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-black py-2 px-3.5"
          title="Create a new smart plan"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
          <span>New Plan</span>
        </button>

        {/* Edit Plan */}
        <button
          onClick={onEditPlan}
          className="btn bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 border border-indigo-200 dark:border-indigo-800 text-xs font-black py-2 px-3.5"
          title="Edit syllabus, dates, or study timings"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-300" />
          <span>Edit Plan</span>
        </button>

        {/* Reschedule Missed */}
        <button
          data-tour="reschedule-btn"
          onClick={onReschedule}
          className="btn bg-pink-100 dark:bg-pink-900/60 text-pink-900 dark:text-pink-200 hover:bg-pink-200 border border-pink-200 dark:border-pink-800 text-xs font-black py-2 px-3.5"
          title="Auto carry-forward missed tasks"
        >
          <Zap className="w-3.5 h-3.5 text-pink-700 dark:text-pink-300 fill-pink-700 dark:fill-pink-300" />
          <span>Reschedule</span>
        </button>

        {/* Pause / Resume Plan */}
        <button
          onClick={onTogglePause}
          className={`btn text-xs font-black py-2 px-3.5 ${
            isPaused 
              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 border border-emerald-200' 
              : 'btn-secondary'
          }`}
          title={isPaused ? 'Resume schedule' : 'Pause schedule'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 fill-emerald-700" /> : <Pause className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isPaused ? 'Resume Plan' : 'Pause Plan'}</span>
        </button>

        {/* Reset Plan */}
        <button
          onClick={onResetPlan}
          className="btn btn-secondary text-xs font-black py-2 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          title="Reset plan tasks"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
          <span>Reset</span>
        </button>

        {/* Delete Plan */}
        <button
          onClick={onDeletePlan}
          className="btn bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100 border border-red-200 dark:border-red-800 text-xs font-black py-2 px-3"
          title="Delete this smart plan completely"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
          <span>Delete Plan</span>
        </button>
      </div>

    </div>
  );
}
