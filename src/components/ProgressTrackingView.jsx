import React from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Flame, 
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

export default function ProgressTrackingView({ plan }) {
  if (!plan || !plan.scheduleMap) return null;

  const scheduleMap = plan.scheduleMap;

  // Calculate Overall Stat Metrics
  let totalTasks = 0;
  let completedTasks = 0;
  let missedTasks = 0;
  let totalPlannedHours = 0;

  Object.values(scheduleMap).forEach((day) => {
    (day.slots || []).forEach((slot) => {
      totalTasks++;
      if (slot.completed) completedTasks++;
      if (slot.isMissed) missedTasks++;
      totalPlannedHours += Number(slot.durationHours || 1.5);
    });
  });

  const pendingTasks = Math.max(0, totalTasks - completedTasks);
  const overallCompletionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const actualHoursLogged = Math.round((completedTasks / (totalTasks || 1)) * totalPlannedHours);

  // Subject-wise Breakdown Metrics
  const subjectsMap = {};
  if (plan.subjects && plan.subjects.length > 0) {
    plan.subjects.forEach((subj) => {
      let chapCount = 0;
      let chapCompletedSum = 0;
      (subj.chapters || []).forEach((chap) => {
        chapCount++;
        chapCompletedSum += (chap.completionPercentage || 0);
      });
      const avgSubjectProgress = chapCount > 0 ? Math.round(chapCompletedSum / chapCount) : 0;
      subjectsMap[subj.name] = {
        name: subj.name,
        chapCount,
        progress: avgSubjectProgress
      };
    });
  }

  // Days Remaining calculation
  let daysRemaining = 0;
  if (plan.targetDate) {
    const diff = new Date(plan.targetDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Card 1: Overall Completion % */}
        <div className="card p-5 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Completion</p>
            <div className="text-2xl font-extrabold text-purple-700 mt-1">
              {overallCompletionPercent}%
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{completedTasks} of {totalTasks} tasks done</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-extrabold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Completed vs Pending */}
        <div className="card p-5 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks Status</p>
            <div className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span>{completedTasks} Done</span>
            </div>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{pendingTasks} Pending &bull; {missedTasks} Missed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Planned vs Actual Hours */}
        <div className="card p-5 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Hours</p>
            <div className="text-xl font-extrabold text-indigo-700 mt-1">
              {actualHoursLogged} / {Math.round(totalPlannedHours)} hrs
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Logged study hours</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Days Remaining */}
        <div className="card p-5 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Countdown</p>
            <div className="text-2xl font-extrabold text-pink-600 mt-1">
              {daysRemaining} Days
            </div>
            <p className="text-[10px] text-pink-500 font-medium mt-0.5">Target: {plan.targetDate || 'Active'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Subject-wise Progress & Topic Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subject-Wise Progress Bars */}
        <div className="card p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-800">Subject-wise Mastery</h3>
          </div>

          {Object.keys(subjectsMap).length === 0 ? (
            <p className="text-xs text-slate-500 italic">No subject categories defined for this plan.</p>
          ) : (
            <div className="space-y-4">
              {Object.values(subjectsMap).map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{s.name} ({s.chapCount} Chapters)</span>
                    <span className="text-purple-700 font-extrabold">{s.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${s.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phase & Topic Completion Distribution */}
        <div className="card p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Phase & Workload Breakdown</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-purple-900">Phase 1: Syllabus Learning</p>
                <p className="text-purple-600 text-[11px]">Primary concept mastery</p>
              </div>
              <span className="font-extrabold text-purple-700 bg-white px-2.5 py-1 rounded-lg shadow-xs">
                {overallCompletionPercent}% Done
              </span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-indigo-900">Phase 2: Question Practice</p>
                <p className="text-indigo-600 text-[11px]">Previous papers & exercises</p>
              </div>
              <span className="font-extrabold text-indigo-700 bg-white px-2.5 py-1 rounded-lg shadow-xs">
                {Math.max(0, overallCompletionPercent - 10)}% Done
              </span>
            </div>

            <div className="p-3 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-pink-900">Phase 3 & 4: Revisions & Mocks</p>
                <p className="text-pink-600 text-[11px]">Active recall & timing simulation</p>
              </div>
              <span className="font-extrabold text-pink-700 bg-white px-2.5 py-1 rounded-lg shadow-xs">
                {Math.max(0, overallCompletionPercent - 20)}% Done
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
