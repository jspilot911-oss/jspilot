import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Zap, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDateKey } from '../engine/schedulerEngine.js';

export default function RescheduleDatePickerModal({
  isOpen,
  onClose,
  plan,
  selectedDate,
  onConfirmReschedule
}) {
  const tomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDateKey(d);
  };

  const [targetDate, setTargetDate] = useState(tomorrowStr());
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [selectedSlotId, setSelectedSlotId] = useState('ALL');

  useEffect(() => {
    if (isOpen) {
      setTargetDate(tomorrowStr());
      setStartTime('09:00 AM');
      setEndTime('10:30 AM');
      setSelectedSlotId('ALL');
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  // Gather list of available tasks for selection dropdown
  const scheduleMap = plan.scheduleMap || {};
  const todayDayData = scheduleMap[selectedDate] || {};
  const currentTasks = todayDayData.slots || [];

  const handleQuickDatePreset = (daysAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAdd);
    setTargetDate(formatDateKey(d));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmReschedule({
      targetDateStr: targetDate,
      startTime,
      endTime,
      specificSlotId: selectedSlotId === 'ALL' ? null : selectedSlotId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-300 dark:border-purple-800 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative text-slate-900 dark:text-white space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Reschedule Date & Time Picker
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                Select custom date and time block to move tasks
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Select Tasks to Reschedule */}
          <div className="form-group mb-0">
            <label className="form-label text-xs">Select Task(s) to Reschedule</label>
            <select
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="form-control text-xs font-bold"
            >
              <option value="ALL">✨ All Today's & Pending Tasks ({currentTasks.length})</option>
              {currentTasks.map((s) => (
                <option key={s.id} value={s.id}>
                  📌 {s.title} ({s.startTime} - {s.endTime})
                </option>
              ))}
            </select>
          </div>

          {/* Target Reschedule Date Picker */}
          <div className="space-y-2">
            <label className="form-label text-xs">Choose New Target Reschedule Date 📅</label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-control text-xs font-bold font-mono"
            />

            {/* Quick Date Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickDatePreset(1)}
                className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-black hover:bg-purple-200 border border-purple-200 dark:border-purple-800"
              >
                Tomorrow (+1d)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDatePreset(2)}
                className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-black hover:bg-purple-200 border border-purple-200 dark:border-purple-800"
              >
                In 2 Days (+2d)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDatePreset(7)}
                className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-black hover:bg-purple-200 border border-purple-200 dark:border-purple-800"
              >
                Next Week (+7d)
              </button>
            </div>
          </div>

          {/* New Start Time & End Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group mb-0">
              <label className="form-label text-xs">New Start Time ⏰</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="form-control text-xs font-bold"
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">New End Time ⏰</label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="form-control text-xs font-bold"
              />
            </div>
          </div>

          {/* Info Callout */}
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Moving tasks to <strong>{targetDate}</strong> ({startTime} – {endTime}). Your plan stats and daily capacity will be recalculated.
            </span>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary py-2 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary py-2.5 px-6 text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Reschedule to Chosen Date</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
