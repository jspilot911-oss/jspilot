import { formatDateKey } from './schedulerEngine.js';
import { calculatePriority } from './priorityEngine.js';

/**
 * Dynamic Rescheduling Engine
 * Rebalances missed tasks without overloading daily hours limit.
 */
export function rescheduleMissedTasks(currentPlan, targetDateStr = formatDateKey(new Date())) {
  if (!currentPlan || !currentPlan.scheduleMap) {
    return { plan: currentPlan, notification: null };
  }

  const scheduleMap = JSON.parse(JSON.stringify(currentPlan.scheduleMap));
  const dateKeys = Object.keys(scheduleMap).sort();
  
  const todayKey = targetDateStr;
  const missedSlots = [];

  // Step 1: Collect incomplete & missed slots from past and today
  dateKeys.forEach((dKey) => {
    if (dKey <= todayKey) {
      const dayData = scheduleMap[dKey];
      if (dayData && dayData.slots) {
        dayData.slots.forEach((slot) => {
          if (!slot.completed && !slot.isBuffer) {
            missedSlots.push({ ...slot, originalDate: dKey });
            slot.isMissed = true; // Mark historical slot as missed
          }
        });
      }
    }
  });

  if (missedSlots.length === 0) {
    return {
      plan: currentPlan,
      notification: {
        type: 'info',
        message: 'No missed tasks detected! Your schedule is fully up to date.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };
  }

  // Step 2: Upgrade priority of missed tasks
  missedSlots.forEach((slot) => {
    slot.postponeCount = (slot.postponeCount || 0) + 1;
    const updatedPriority = calculatePriority({
      examDate: currentPlan.targetDate,
      importance: 4,
      difficulty: 'hard',
      estimatedHours: slot.durationHours || 1.5,
      completionPercentage: 0,
      postponeCount: slot.postponeCount,
      isMissed: true
    });
    
    slot.priority = updatedPriority;
    slot.title = `[Carried Forward] ${slot.title.replace('[Carried Forward] ', '')}`;
    slot.isMissed = false; // Reset status for new date assignment
  });

  // Sort missed slots by highest updated priority
  missedSlots.sort((a, b) => b.priority.score - a.priority.score);

  // Step 3: Insert into upcoming days starting tomorrow
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowObj);

  const futureDates = dateKeys.filter(k => k >= tomorrowKey);
  const availableHoursCap = Number(currentPlan.availableHoursPerDay || 4);

  const rescheduledChanges = [];
  let placedCount = 0;

  missedSlots.forEach((missedItem) => {
    for (const fKey of futureDates) {
      const fDay = scheduleMap[fKey];
      if (!fDay) continue;

      const currentAllocatedHours = fDay.slots.reduce((sum, s) => sum + (s.completed ? 0 : s.durationHours), 0);
      
      if (currentAllocatedHours + missedItem.durationHours <= availableHoursCap + 0.5) {
        // Prepend high-priority missed task to tomorrow's schedule
        const newSlot = {
          ...missedItem,
          id: `resched_${fKey}_${Math.random().toString(36).substr(2, 6)}`,
          startTime: '09:00 AM',
          endTime: '10:30 AM'
        };

        fDay.slots.unshift(newSlot);
        fDay.totalTasks = fDay.slots.length;
        placedCount++;

        rescheduledChanges.push({
          taskId: newSlot.id,
          title: missedItem.title.replace('[Carried Forward] ', ''),
          subjectName: missedItem.subjectName || 'General',
          originalDate: missedItem.originalDate,
          newDate: fKey,
          newStartTime: newSlot.startTime,
          newEndTime: newSlot.endTime,
          priorityBadge: missedItem.priority?.badge || '🔴 Critical',
          durationHours: missedItem.durationHours || 1.5
        });

        break;
      }
    }
  });

  // Recalculate daily stats for updated schedule
  Object.keys(scheduleMap).forEach((k) => {
    const day = scheduleMap[k];
    if (day.slots) {
      const comp = day.slots.filter(s => s.completed).length;
      day.completedTasks = comp;
      day.totalTasks = day.slots.length;
      day.completionRate = day.totalTasks > 0 ? Math.round((comp / day.totalTasks) * 100) : 0;
    }
  });

  const updatedPlan = {
    ...currentPlan,
    scheduleMap,
    lastRescheduledAt: new Date().toISOString()
  };

  const notification = {
    id: `notif_${Date.now()}`,
    type: 'reschedule',
    message: `Smart Update: Your plan was automatically rebalanced. ${placedCount} missed high-priority task(s) carried forward without overloading your daily hours limit.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    count: placedCount
  };

  return { plan: updatedPlan, notification, rescheduledChanges };
}

/**
 * Reschedule Tasks to a Specific User-Chosen Target Date and Time Block
 */
export function rescheduleTasksToCustomDate(currentPlan, options = {}) {
  const { 
    targetDateStr = formatDateKey(new Date(Date.now() + 86400000)), // tomorrow
    startTime = '09:00 AM',
    endTime = '10:30 AM',
    specificSlotId = null,
    currentDateStr = formatDateKey(new Date())
  } = options;

  if (!currentPlan || !currentPlan.scheduleMap) {
    return { plan: currentPlan, notification: null, rescheduledChanges: [] };
  }

  const scheduleMap = JSON.parse(JSON.stringify(currentPlan.scheduleMap));
  const rescheduledChanges = [];

  // Ensure target date exists in scheduleMap
  if (!scheduleMap[targetDateStr]) {
    scheduleMap[targetDateStr] = {
      date: targetDateStr,
      dayName: new Date(targetDateStr).toLocaleDateString('en-US', { weekday: 'long' }),
      availableHours: currentPlan.availableHoursPerDay || 4,
      slots: [],
      completedTasks: 0,
      totalTasks: 0,
      completionRate: 0
    };
  }

  const tasksToMove = [];

  // Collect tasks to move
  Object.keys(scheduleMap).forEach((dKey) => {
    const dayData = scheduleMap[dKey];
    if (dayData && dayData.slots) {
      if (specificSlotId) {
        const index = dayData.slots.findIndex(s => s.id === specificSlotId);
        if (index >= 0) {
          const [removed] = dayData.slots.splice(index, 1);
          tasksToMove.push({ ...removed, originalDate: dKey });
        }
      } else {
        if (dKey <= currentDateStr) {
          const remainingSlots = [];
          dayData.slots.forEach((slot) => {
            if (!slot.completed && !slot.isBuffer) {
              tasksToMove.push({ ...slot, originalDate: dKey });
            } else {
              remainingSlots.push(slot);
            }
          });
          dayData.slots = remainingSlots;
        }
      }
    }
  });

  if (tasksToMove.length === 0) {
    // If no past incomplete tasks found, fallback to today's active tasks or plan subjects
    const todaySlots = (scheduleMap[currentDateStr]?.slots || []).filter(s => !s.completed);
    if (todaySlots.length > 0) {
      todaySlots.forEach(s => tasksToMove.push({ ...s, originalDate: currentDateStr }));
    }
  }

  // Insert moved tasks into targetDateStr day slots
  const targetDayData = scheduleMap[targetDateStr];
  tasksToMove.forEach((item, idx) => {
    item.postponeCount = (item.postponeCount || 0) + 1;
    item.isMissed = false;
    item.startTime = startTime;
    item.endTime = endTime;

    const newSlotId = `custom_resched_${targetDateStr}_${Date.now()}_${idx}`;
    const newSlot = {
      ...item,
      id: newSlotId,
      startTime,
      endTime
    };

    targetDayData.slots.unshift(newSlot);

    rescheduledChanges.push({
      taskId: newSlotId,
      title: item.title,
      subjectName: item.subjectName || 'General',
      originalDate: item.originalDate || currentDateStr,
      newDate: targetDateStr,
      newStartTime: startTime,
      newEndTime: endTime,
      priorityBadge: item.priority?.badge || '🔴 Critical',
      durationHours: item.durationHours || 1.5
    });
  });

  // Recalculate daily stats
  Object.keys(scheduleMap).forEach((k) => {
    const day = scheduleMap[k];
    if (day.slots) {
      const comp = day.slots.filter(s => s.completed).length;
      day.completedTasks = comp;
      day.totalTasks = day.slots.length;
      day.completionRate = day.totalTasks > 0 ? Math.round((comp / day.totalTasks) * 100) : 0;
    }
  });

  const updatedPlan = {
    ...currentPlan,
    scheduleMap,
    lastRescheduledAt: new Date().toISOString()
  };

  const notification = {
    id: `notif_${Date.now()}`,
    type: 'reschedule',
    message: `Rescheduled ${rescheduledChanges.length} task(s) to ${targetDateStr} (${startTime} - ${endTime}).`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    count: rescheduledChanges.length
  };

  return { plan: updatedPlan, notification, rescheduledChanges };
}
