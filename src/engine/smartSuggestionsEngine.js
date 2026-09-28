import { formatDateKey } from './schedulerEngine.js';

/**
 * Smart Suggestions Engine
 * Evaluates current plan state, daily progress, pending difficult topics,
 * exam date proximity, and missed tasks to yield rule-based advice cards.
 */
export function generateSmartSuggestions(plan, selectedDateStr = formatDateKey(new Date())) {
  if (!plan || !plan.scheduleMap) return [];

  const suggestions = [];
  const scheduleMap = plan.scheduleMap;
  const todayData = scheduleMap[selectedDateStr] || { slots: [] };

  // Calculate Overall Progress
  let totalTasksAllDays = 0;
  let completedTasksAllDays = 0;
  let totalMissedTasks = 0;

  Object.values(scheduleMap).forEach((day) => {
    (day.slots || []).forEach((slot) => {
      totalTasksAllDays++;
      if (slot.completed) completedTasksAllDays++;
      if (slot.isMissed) totalMissedTasks++;
    });
  });

  const overallCompletion = totalTasksAllDays > 0 ? Math.round((completedTasksAllDays / totalTasksAllDays) * 100) : 0;
  const incompletePercent = 100 - overallCompletion;

  // Calculate Exam Proximity
  let daysRemaining = 999;
  if (plan.targetDate) {
    const diff = new Date(plan.targetDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Today's high priority state
  const todaySlots = todayData.slots || [];
  const todayCriticalHigh = todaySlots.filter(s => s.priority && (s.priority.level === 'critical' || s.priority.level === 'high'));
  const completedCriticalHigh = todayCriticalHigh.filter(s => s.completed);

  // Suggestion 1: High Priority Completion Praise
  if (todayCriticalHigh.length > 0 && completedCriticalHigh.length === todayCriticalHigh.length) {
    suggestions.push({
      id: 'sug_high_done',
      type: 'success',
      icon: 'CheckCircle2',
      title: 'High Priority Milestone Achieved!',
      description: "You have completed all today's high-priority tasks! Excellent velocity. You can now relax or tackle a light medium-priority task.",
      actionLabel: 'Preview Tomorrow',
      actionType: 'preview'
    });
  }

  // Suggestion 2: Exam Approaching & Syllabus Incomplete Warning
  if (plan.type === 'exam' && daysRemaining <= 20 && incompletePercent > 25) {
    suggestions.push({
      id: 'sug_exam_warning',
      type: 'warning',
      icon: 'AlertTriangle',
      title: 'Exam Approaching — Syllabus Pace Alert',
      description: `Your exam "${plan.examName || 'Target Exam'}" is in ${daysRemaining} days and ${incompletePercent}% of the planned syllabus is incomplete.`,
      actionLabel: '+1 Hour Extra Study',
      actionType: 'increase_hours'
    });
  }

  // Suggestion 3: Difficult Topics Remaining
  const hardTopicsRemaining = (plan.allWorkItems || []).filter(item => item.difficulty === 'hard' && item.remainingHours > 0);
  if (hardTopicsRemaining.length >= 2) {
    suggestions.push({
      id: 'sug_hard_topics',
      type: 'tip',
      icon: 'BrainCircuit',
      title: 'Target Difficult Topics',
      description: `You have ${hardTopicsRemaining.length} challenging topics remaining (e.g. ${hardTopicsRemaining[0]?.title || 'Key Unit'}). Consider allocating an additional 1 hour tomorrow during peak focus hours.`,
      actionLabel: 'Prioritize Hard Topics',
      actionType: 'prioritize_hard'
    });
  }

  // Suggestion 4: Missed / Postponed Tasks Warning
  if (totalMissedTasks >= 1) {
    suggestions.push({
      id: 'sug_postponed',
      type: 'reschedule',
      icon: 'ClockAlert',
      title: 'Reschedule Buffer Active',
      description: `${totalMissedTasks} task(s) were postponed previously. Click below to automatically rebalance your upcoming daily workload.`,
      actionLabel: 'Auto Reschedule Now',
      actionType: 'reschedule_now'
    });
  }

  // Default Tip if no specific triggers
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'sug_steady',
      type: 'info',
      icon: 'Sparkles',
      title: 'Plan On Track!',
      description: 'Your daily momentum is well-balanced. Keep up the consistent study slots to achieve peak retention before your deadline.',
      actionLabel: 'View Progress',
      actionType: 'view_progress'
    });
  }

  return suggestions;
}
