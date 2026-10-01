import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Bell,
  X,
  Volume2,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyDashboard({
  plan,
  selectedDate,
  onToggleTaskCompleted,
  onMarkTaskMissed,
  onRescheduleSingleTask,
  onOpenWizard,
  onDeleteTask,
  onUpdateTaskTime,
  onTriggerNotificationPop,
  onOpenPomodoro
}) {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTooltipId, setActiveTooltipId] = useState(null);
  
  // Custom Time & Notification Editor Modal State
  const [editingSlot, setEditingSlot] = useState(null);
  const [customStartTime, setCustomStartTime] = useState('09:00 AM');
  const [customEndTime, setCustomEndTime] = useState('10:30 AM');
  const [customDueDate, setCustomDueDate] = useState(selectedDate);
  const [reminderOffset, setReminderOffset] = useState('0');

  const handleOpenTimeEditor = (slot) => {
    setEditingSlot(slot);
    setCustomStartTime(slot.startTime || '09:00 AM');
    setCustomEndTime(slot.endTime || '10:30 AM');
    setCustomDueDate(slot.dueDate || selectedDate);
    setReminderOffset(slot.reminderOffset || '0');
  };

  const handleSaveCustomTime = () => {
    if (editingSlot && onUpdateTaskTime) {
      onUpdateTaskTime(selectedDate, editingSlot.id, customStartTime, customEndTime, customDueDate, reminderOffset);
      if (onTriggerNotificationPop) {
        const offsetLabel = reminderOffset === '0' ? 'at due time' : `${reminderOffset} mins before due time`;
        onTriggerNotificationPop({
          id: `notif_${Date.now()}`,
          title: 'Custom Notification Configured',
          message: `⏰ REMINDER SET: "${editingSlot.title}" is due on ${customDueDate} at ${customStartTime} (alert ${offsetLabel}).`,
          dueInfo: `${customDueDate} at ${customStartTime}`,
          source: 'User Custom Alarm',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }
    setEditingSlot(null);
  };

  const handleTestNotification = (slot) => {
    if (onTriggerNotificationPop) {
      const dueDateStr = slot.dueDate || selectedDate;
      onTriggerNotificationPop({
        id: `notif_${Date.now()}`,
        title: 'Task Alarm',
        message: `🔔 TASK ALARM: "${slot.title}" is due on ${dueDateStr} at ${slot.startTime}!`,
        dueInfo: `${dueDateStr} at ${slot.startTime}`,
        source: 'Instant Task Alert',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  if (!plan || !plan.scheduleMap) {
    return (
      <div className="card p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Study Plan</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Create a study plan to view your daily schedule.</p>
        <button
          onClick={onOpenWizard}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Plan</span>
        </button>
      </div>
    );
  }

  const dayData = plan.scheduleMap[selectedDate] || {
    date: selectedDate,
    dayName: 'Today',
    availableHours: plan.availableHoursPerDay || 4,
    slots: []
  };

  const slots = dayData.slots || [];

  const filteredSlots = slots.filter(slot => {
    if (priorityFilter === 'all') return true;
    return slot.priority && slot.priority.level === priorityFilter;
  });

  const completedSlotsCount = slots.filter(s => s.completed).length;
  const totalSlotsCount = slots.length;
  const todayProgressPercent = totalSlotsCount > 0 
    ? Math.round((completedSlotsCount / totalSlotsCount) * 100) 
    : 0;

  const handleCheckboxClick = (slotId, currentCompletedState) => {
    const nextState = !currentCompletedState;
    onToggleTaskCompleted(selectedDate, slotId);

    if (nextState && completedSlotsCount + 1 === totalSlotsCount) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const dateObj = new Date(selectedDate);
  const formattedDisplayDate = isNaN(dateObj.getTime())
    ? selectedDate
    : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      
      {/* TODAY Header Dashboard Card */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-3xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
              <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>TODAY'S DAILY PLANNER</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {formattedDisplayDate}
            </h2>
          </div>

          {/* Work/Study Hours Available Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800 flex items-center gap-2.5 text-purple-900 dark:text-purple-200">
              <Clock className="w-4.5 h-4.5 text-purple-700 dark:text-purple-300" />
              <div className="text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-bold">Capacity: </span>
                <strong className="font-black text-purple-950 dark:text-white">{dayData.availableHours} Hours Available</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Today's Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-slate-800 dark:text-slate-200">Today's Progress</span>
            <span className="text-purple-700 dark:text-purple-300 font-black text-sm">{todayProgressPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${todayProgressPercent === 100 ? 'progress-bar-fill-success' : ''}`}
              style={{ width: `${todayProgressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-bold">
            {completedSlotsCount} of {totalSlotsCount} scheduled study blocks completed today.
          </p>
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div data-tour="priority-engine" className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              priorityFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Tasks ({slots.length})
          </button>
          
          <button
            onClick={() => setPriorityFilter('critical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              priorityFilter === 'critical'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100'
            }`}
          >
            <span>🔴 Critical</span>
            <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1.5 py-0.2 rounded-full font-black">
              {slots.filter(s => s.priority?.level === 'critical').length}
            </span>
          </button>

          <button
            onClick={() => setPriorityFilter('high')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              priorityFilter === 'high'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-orange-800 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100'
            }`}
          >
            <span>🟠 High</span>
            <span className="text-[10px] bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 px-1.5 py-0.2 rounded-full font-black">
              {slots.filter(s => s.priority?.level === 'high').length}
            </span>
          </button>

          <button
            onClick={() => setPriorityFilter('medium')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              priorityFilter === 'medium'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
            }`}
          >
            <span>🟡 Medium</span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full font-black">
              {slots.filter(s => s.priority?.level === 'medium').length}
            </span>
          </button>

          <button
            onClick={() => setPriorityFilter('low')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              priorityFilter === 'low'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
            }`}
          >
            <span>🟢 Low</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded-full font-black">
              {slots.filter(s => s.priority?.level === 'low').length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold px-2 hidden md:inline">
          Intelligent Priority Engine
        </span>

      </div>

      {/* Agenda Time-Blocked Slots List */}
      <div data-tour="task-list" className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="card p-8 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Tasks Match Filter</h3>
            <p className="text-xs text-slate-500 mt-1">Select "All Tasks" or add new study slots.</p>
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const isCompleted = slot.completed || false;
            const isMissed = slot.isMissed || false;
            const priorityLevel = slot.priority?.level || 'medium';
            const priorityBadge = slot.priority?.badge || '🟡 Medium';
            const priorityReason = slot.priority?.reason || 'Standard task schedule';

            return (
              <div
                key={slot.id}
                className={`card p-4.5 bg-white dark:bg-slate-900 border transition-all relative ${
                  isCompleted 
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 opacity-80' 
                    : isMissed
                      ? 'border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Checkbox + Time + Task Title */}
                  <div className="flex items-start gap-3.5">
                    
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => handleCheckboxClick(slot.id, isCompleted)}
                      className="mt-0.5 text-slate-400 hover:text-purple-600 transition-colors"
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-6 h-6 text-purple-600 fill-purple-100 dark:fill-purple-900" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-purple-500" />
                      )}
                    </button>

                    <div>
                      {/* Time Slot Block & Customization Actions */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>{slot.startTime} – {slot.endTime}</span>
                        </span>

                        {/* Edit Time / Notification Alarm Button */}
                        <button
                          onClick={() => handleOpenTimeEditor(slot)}
                          className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors text-xs font-bold flex items-center gap-1"
                          title="Customize Task Time & Notification Pop Alarm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Customize Time</span>
                        </button>

                        {/* Pomodoro Focus Clock Button */}
                        <button
                          onClick={() => onOpenPomodoro && onOpenPomodoro(slot)}
                          className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors text-xs font-black flex items-center gap-1 border border-pink-200 dark:border-pink-800 shadow-2xs"
                          title="Launch 25m Focus Pomodoro Clock for this Task"
                        >
                          <Flame className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                          <span>Pomodoro Clock</span>
                        </button>

                        {/* Test Notification Bell Button */}
                        <button
                          onClick={() => handleTestNotification(slot)}
                          className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
                          title="Pop Notification Alert for this Task"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>

                        {/* Subject Badge */}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          {slot.subjectName || 'General'}
                        </span>

                        {/* Priority Badge */}
                        <span className={`badge ${
                          priorityLevel === 'critical' ? 'badge-critical' :
                          priorityLevel === 'high' ? 'badge-high' :
                          priorityLevel === 'medium' ? 'badge-medium' : 'badge-low'
                        }`}>
                          {priorityBadge}
                        </span>

                        {/* Priority Reason Tooltip */}
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActiveTooltipId(activeTooltipId === slot.id ? null : slot.id)}
                            className="text-slate-400 hover:text-purple-600 transition-colors p-0.5"
                            title="Why this priority?"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>

                          {activeTooltipId === slot.id && (
                            <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-2xl shadow-2xl z-50 animate-fade-in border border-slate-700">
                              <p className="font-black text-purple-300 mb-1">Why this Priority?</p>
                              <p className="text-slate-200 font-medium leading-relaxed">{priorityReason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Name & Phase */}
                      <h3 className={`text-sm sm:text-base font-black text-slate-900 dark:text-white ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {slot.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5 flex items-center gap-2">
                        <span>Phase: {slot.phase || 'Task Execution'}</span>
                        <span>&bull;</span>
                        <span>Est: {slot.durationHours || 1.5} hrs</span>
                      </p>
                    </div>

                  </div>

                  {/* Right Actions: Mark Missed & Delete Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isMissed && (
                      <span className="text-xs font-extrabold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-3 py-1 rounded-xl">
                        Missed & Postponed
                      </span>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={() => onMarkTaskMissed(selectedDate, slot.id)}
                        className="btn btn-secondary text-xs font-bold py-1.5 px-3 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800"
                        title="Mark task as missed today"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Mark Missed</span>
                      </button>
                    )}

                    {/* Delete Task Button */}
                    {onDeleteTask && (
                      <button
                        onClick={() => onDeleteTask(selectedDate, slot.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete task from schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customize Task Time Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 relative text-slate-900 dark:text-white space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-black">Customize Task Time</h3>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Customize scheduled time for <strong>"{editingSlot.title}"</strong>. When this time arrives, a notification pop will alert you.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group mb-0">
                <label className="form-label text-xs">Start Time</label>
                <input
                  type="text"
                  value={customStartTime}
                  onChange={(e) => setCustomStartTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="form-control text-xs"
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs">End Time</label>
                <input
                  type="text"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="form-control text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group mb-0">
                <label className="form-label text-xs">Due Date</label>
                <input
                  type="date"
                  value={customDueDate}
                  onChange={(e) => setCustomDueDate(e.target.value)}
                  className="form-control text-xs"
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs">Notification Reminder</label>
                <select
                  value={reminderOffset}
                  onChange={(e) => setReminderOffset(e.target.value)}
                  className="form-control text-xs"
                >
                  <option value="0">🔔 At due time</option>
                  <option value="5">🔔 5 mins before due time</option>
                  <option value="15">🔔 15 mins before due time</option>
                  <option value="30">🔔 30 mins before due time</option>
                  <option value="60">🔔 1 hour before due time</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingSlot(null)}
                className="btn btn-secondary py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomTime}
                className="btn btn-primary py-2 text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Save & Set Notification</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
