import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { formatDateKey } from '../engine/schedulerEngine.js';

export default function CalendarView({
  plan,
  selectedDate,
  onSelectDate
}) {
  const [viewMode, setViewMode] = useState('monthly'); // 'daily', 'weekly', 'monthly'
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(selectedDate || new Date()));

  if (!plan || !plan.scheduleMap) return null;

  const scheduleMap = plan.scheduleMap;

  // Month navigation
  const prevMonth = () => {
    const d = new Date(currentMonthDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonthDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentMonthDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonthDate(d);
  };

  // Generate calendar grid days for currentMonthDate
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  // Padding days from previous month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
    calendarDays.push({ dateKey: formatDateKey(prevDate), isCurrentMonth: false, dateNumber: prevDate.getDate() });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateKey = formatDateKey(dateObj);
    calendarDays.push({ dateKey, isCurrentMonth: true, dateNumber: d, dateObj });
  }

  // Format Month Title
  const monthTitle = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="card p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      
      {/* Calendar Header with View Switcher & Month Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Interactive Planner Calendar
            </h2>
            <p className="text-xs text-slate-500">Visual schedule breakdown & deadlines</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'monthly' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly Grid
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'weekly' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Weekly Agenda
            </button>
          </div>

          {/* Month Nav Buttons */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
            <button onClick={prevMonth} className="p-1 text-slate-600 hover:text-purple-600 hover:bg-slate-50 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 px-2 min-w-[110px] text-center">
              {monthTitle}
            </span>
            <button onClick={nextMonth} className="p-1 text-slate-600 hover:text-purple-600 hover:bg-slate-50 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Monthly Grid View */}
      {viewMode === 'monthly' && (
        <div className="space-y-2">
          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cd, index) => {
              const daySchedule = scheduleMap[cd.dateKey];
              const slots = daySchedule ? (daySchedule.slots || []) : [];
              const isSelected = cd.dateKey === selectedDate;
              const isExamDay = plan.targetDate === cd.dateKey;

              const criticalCount = slots.filter(s => s.priority?.level === 'critical').length;
              const highCount = slots.filter(s => s.priority?.level === 'high').length;
              const completedCount = slots.filter(s => s.completed).length;              const planTitle = (plan.title || plan.examName || 'Target Exam').replace(/\s*\(Reset\)\s*/g, '');

              return (
                <button
                  key={index}
                  onClick={() => onSelectDate(cd.dateKey)}
                  className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/50 shadow-md ring-2 ring-purple-400/30'
                      : cd.isCurrentMonth
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/20'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className={`text-xs font-bold ${
                      isSelected ? 'text-purple-700 dark:text-purple-300' : cd.isCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'
                    }`}>
                      {cd.dateNumber}
                    </span>

                    {isExamDay && (
                      <span 
                        className="text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-0.5 rounded-lg truncate max-w-[70px] sm:max-w-[100px] block shadow-xs"
                        title={`Exam Target: ${planTitle}`}
                      >
                        🎯 {planTitle}
                      </span>
                    )}
                  </div>

                  {/* Task Indicators inside day cell */}
                  {cd.isCurrentMonth && slots.length > 0 && (
                    <div className="space-y-1 my-1">
                      <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                        {slots.length} task{slots.length > 1 ? 's' : ''}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {criticalCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title={`${criticalCount} Critical Tasks`} />
                        )}
                        {highCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-orange-500" title={`${highCount} High Priority Tasks`} />
                        )}
                        {completedCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${completedCount} Completed`} />
                        )}
                      </div>
                    </div>
                  )}

                  {cd.isCurrentMonth && slots.length === 0 && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No tasks</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === 'weekly' && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Showing 7-day upcoming workload distribution:</p>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {Object.keys(scheduleMap).slice(0, 7).map((dKey) => {
              const day = scheduleMap[dKey];
              const slots = day.slots || [];
              const isSelected = dKey === selectedDate;
              const isExamDay = dKey === plan.targetDate;
              const planTitle = (plan.title || plan.examName || 'Target Exam').replace(/\s*\(Reset\)\s*/g, '');

              return (
                <div
                  key={dKey}
                  onClick={() => onSelectDate(dKey)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-200'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
                    <span>{day.dayName} ({dKey.slice(5)})</span>
                  </div>

                  {isExamDay && (
                    <div 
                      className="text-[10px] font-black bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-0.5 rounded-md mb-2 truncate shadow-xs"
                      title={`Exam Target: ${planTitle}`}
                    >
                      🎯 {planTitle}
                    </div>
                  )}

                  <div className="text-xs text-purple-700 dark:text-purple-400 font-bold mb-2">
                    {slots.length} Slots
                  </div>
                  <div className="space-y-1">
                    {slots.slice(0, 3).map((s, idx) => (
                      <div key={idx} className="text-[10px] p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate font-semibold">
                        {s.title}
                      </div>
                    ))}
                    {slots.length > 3 && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">+{slots.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
