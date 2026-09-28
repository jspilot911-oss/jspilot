import React from 'react';
import { 
  X, 
  Zap, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Target
} from 'lucide-react';

export default function RescheduleSummaryModal({
  isOpen,
  onClose,
  changes = [],
  plan
}) {
  if (!isOpen) return null;

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Today';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-pink-300 dark:border-pink-800 shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative text-slate-900 dark:text-white max-h-[90vh] flex flex-col space-y-5 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Schedule Rebalanced & Rescheduled</span>
                <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold px-2.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-800">
                  AUTO-CARRIED FORWARD
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                JSPilot Priority Engine recalculated your study timeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Changes Summary Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 relative z-10">
          
          {changes.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Schedule Up to Date!</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No missed or pending tasks were found. All your study blocks are fully on schedule according to your target exam timeline!
              </p>
            </div>
          ) : (
            <>
              {/* Stat Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 dark:from-purple-950/60 to-pink-50 dark:to-pink-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs font-bold text-purple-950 dark:text-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>
                    Successfully rescheduled <strong>{changes.length} study block(s)</strong> with updated priority ratings and daily capacity limits.
                  </span>
                </div>
                <span className="text-xs font-mono font-black bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 px-3 py-1 rounded-xl whitespace-nowrap">
                  Cap: {plan?.availableHoursPerDay || 4} hrs/day
                </span>
              </div>

              {/* Detailed Changed Tasks List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-600" />
                  <span>Changed Dates & Scheduled Times</span>
                </h3>

                {changes.map((item, idx) => (
                  <div
                    key={item.taskId || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-purple-300 transition-all space-y-3"
                  >
                    {/* Task Title & Subject */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-md">
                            {item.subjectName || 'General'}
                          </span>
                          <span className="text-xs font-black text-pink-600 dark:text-pink-400">
                            {item.priorityBadge || '🔴 Critical'}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>

                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">
                        {item.durationHours || 1.5} hrs
                      </span>
                    </div>

                    {/* Before ➔ After Date & Time Comparison Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs font-bold">
                      
                      {/* Old Date */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Previous Date:</span>
                        <span className="line-through text-slate-400 font-mono text-[11px]">
                          {formatDateLabel(item.originalDate)}
                        </span>
                      </div>

                      {/* NEW Scheduled Date & Time */}
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-100/70 to-purple-100/70 dark:from-pink-950/60 dark:to-purple-950/60 border border-pink-300 dark:border-pink-800 text-pink-950 dark:text-pink-200 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-pink-700 dark:text-pink-400">NEW Date & Time:</span>
                        <div className="text-right">
                          <div className="font-black text-purple-900 dark:text-purple-100 font-mono text-[11px] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-pink-600" />
                            <span>{formatDateLabel(item.newDate)}</span>
                          </div>
                          <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-indigo-600" />
                            <span>{item.newStartTime} – {item.newEndTime}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end relative z-10 shrink-0">
          <button
            onClick={onClose}
            className="btn btn-primary py-2.5 px-6 text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Accept & View Schedule</span>
          </button>
        </div>

      </div>
    </div>
  );
}
