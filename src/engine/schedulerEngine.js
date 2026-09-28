import { calculatePriority } from './priorityEngine.js';

/**
 * Helper to add days to a Date object
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format Date as YYYY-MM-DD
 */
export function formatDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Main Automatic Planner Generation Function
 */
export function generateSchedule(planData) {
  const {
    type = 'exam',
    examName = 'Target Exam',
    targetDate = null,
    availableHoursPerDay = 4,
    preferredTimings = 'morning_evening', // 'morning', 'afternoon', 'evening', 'morning_evening'
    weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    includePractice = true,
    includeMockTests = true,
    subjects = [],
    generalTasks = [],
    startDate = new Date()
  } = planData;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // Target / Exam Date
  const end = targetDate ? new Date(targetDate) : addDays(start, 30);
  end.setHours(23, 59, 59, 999);

  // Total calendar days
  const totalDaysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Filter active available days based on weeklyDays preference
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Flatten all syllabus topics & general tasks into actionable work items
  const allWorkItems = [];

  if (type === 'exam' || type === 'study' || subjects.length > 0) {
    subjects.forEach((subj) => {
      (subj.chapters || []).forEach((chap) => {
        const priorityObj = calculatePriority({
          examDate: targetDate,
          importance: chap.importance || subj.importance || 3,
          difficulty: chap.difficulty || 'medium',
          estimatedHours: chap.estimatedHours || 2,
          completionPercentage: chap.completionPercentage || 0,
          postponeCount: chap.postponeCount || 0
        });

        allWorkItems.push({
          id: chap.id || `chap_${Math.random().toString(36).substr(2, 9)}`,
          title: `${subj.name}: ${chap.name}`,
          subjectId: subj.id,
          subjectName: subj.name,
          chapterName: chap.name,
          type: 'learning',
          phase: 'Phase 1: Learning',
          estimatedHours: Number(chap.estimatedHours) || 2,
          remainingHours: (Number(chap.estimatedHours) || 2) * (1 - (chap.completionPercentage || 0) / 100),
          difficulty: chap.difficulty || 'medium',
          importance: chap.importance || 3,
          completionPercentage: chap.completionPercentage || 0,
          priority: priorityObj
        });
      });
    });
  }

  // Include general tasks
  if (generalTasks && generalTasks.length > 0) {
    generalTasks.forEach((gt) => {
      const priorityObj = calculatePriority({
        deadline: gt.deadline,
        importance: gt.importance || 3,
        difficulty: gt.difficulty || 'medium',
        estimatedHours: gt.estimatedHours || 1,
        completionPercentage: gt.completionPercentage || 0,
        postponeCount: gt.postponeCount || 0
      });

      allWorkItems.push({
        id: gt.id || `gt_${Math.random().toString(36).substr(2, 9)}`,
        title: gt.title,
        category: gt.category || 'General',
        type: 'general',
        phase: 'Task Execution',
        deadline: gt.deadline,
        estimatedHours: Number(gt.estimatedHours) || 1,
        remainingHours: (Number(gt.estimatedHours) || 1) * (1 - (gt.completionPercentage || 0) / 100),
        difficulty: gt.difficulty || 'medium',
        importance: gt.importance || 3,
        completionPercentage: gt.completionPercentage || 0,
        priority: priorityObj,
        isRecurring: gt.isRecurring || false,
        recurrenceFrequency: gt.recurrenceFrequency || 'weekly'
      });
    });
  }

  // Sort items by priority score (descending)
  allWorkItems.sort((a, b) => b.priority.score - a.priority.score);

  // Phase Time Allocations for Exam Preparation
  // Phase 1 (Learning): ~55% of available timeframe
  // Phase 2 (Practice): ~15%
  // Phase 3 (Revision): ~15%
  // Phase 4 (Mock Tests): ~10%
  // Phase 5 (Final Revision): ~5%
  const phase1Days = Math.max(1, Math.floor(totalDaysCount * 0.55));
  const phase2Days = Math.max(1, Math.floor(totalDaysCount * 0.15));
  const phase3Days = Math.max(1, Math.floor(totalDaysCount * 0.15));
  const phase4Days = Math.max(1, Math.floor(totalDaysCount * 0.10));
  const phase5Days = Math.max(1, totalDaysCount - (phase1Days + phase2Days + phase3Days + phase4Days));

  // Build daily schedule map: dateKey -> ScheduleDay
  const scheduleMap = {};
  let currentItemIndex = 0;
  
  // Create additional practice, revision, mock test items if Exam Plan
  const practiceItems = [];
  const revisionItems = [];
  const mockTestItems = [];
  const finalRevisionItems = [];

  if (type === 'exam') {
    // Generate Practice tasks for hard/medium topics
    allWorkItems.filter(i => i.difficulty === 'hard' || i.difficulty === 'medium').forEach(item => {
      practiceItems.push({
        id: `prac_${item.id}`,
        title: `Practice & Past Papers: ${item.title}`,
        subjectName: item.subjectName,
        type: 'practice',
        phase: 'Phase 2: Practice',
        estimatedHours: 1.5,
        remainingHours: 1.5,
        priority: { ...item.priority, badge: '🟠 High', reason: 'Phase 2 Practice for high weightage topic' },
        completionPercentage: 0
      });

      revisionItems.push({
        id: `rev_${item.id}`,
        title: `Active Revision: ${item.title}`,
        subjectName: item.subjectName,
        type: 'revision',
        phase: 'Phase 3: Revision',
        estimatedHours: 1.0,
        remainingHours: 1.0,
        priority: { ...item.priority, badge: '🟡 Medium', reason: 'Phase 3 Spaced Repetition' },
        completionPercentage: 0
      });
    });

    // Mock Tests
    if (includeMockTests) {
      const numMocks = Math.min(4, Math.max(1, Math.floor(totalDaysCount / 7)));
      for (let m = 1; m <= numMocks; m++) {
        mockTestItems.push({
          id: `mock_${m}`,
          title: `Full Length Mock Test #${m} (${examName})`,
          type: 'mock_test',
          phase: 'Phase 4: Mock Tests',
          estimatedHours: 3.0,
          remainingHours: 3.0,
          priority: { score: 90, level: 'critical', badge: '🔴 Critical', reason: 'Exam simulation practice' },
          completionPercentage: 0
        });
      }
    }

    // Final Revision
    allWorkItems.slice(0, 5).forEach(item => {
      finalRevisionItems.push({
        id: `finrev_${item.id}`,
        title: `Final Rapid Revision: ${item.title}`,
        subjectName: item.subjectName,
        type: 'final_revision',
        phase: 'Phase 5: Final Revision',
        estimatedHours: 1.0,
        remainingHours: 1.0,
        priority: { score: 95, level: 'critical', badge: '🔴 Critical', reason: 'Pre-exam final touchup' },
        completionPercentage: 0
      });
    });
  }

  // Daily allocation loop
  for (let dayOffset = 0; dayOffset < totalDaysCount; dayOffset++) {
    const dateObj = addDays(start, dayOffset);
    const dateKey = formatDateKey(dateObj);
    const dayName = dayNamesShort[dateObj.getDay()];

    // Check if user is available on this weekday
    const isAvailableDay = weeklyDays.includes(dayName);
    const dayAvailableHours = isAvailableDay ? Number(availableHoursPerDay) : 0;

    // Determine current phase based on dayOffset
    let currentPhaseName = 'Task Execution';
    let availableQueue = allWorkItems;

    if (type === 'exam') {
      if (dayOffset < phase1Days) {
        currentPhaseName = 'Phase 1: Learning';
        availableQueue = allWorkItems;
      } else if (dayOffset < phase1Days + phase2Days) {
        currentPhaseName = 'Phase 2: Practice';
        availableQueue = practiceItems.length > 0 ? practiceItems : allWorkItems;
      } else if (dayOffset < phase1Days + phase2Days + phase3Days) {
        currentPhaseName = 'Phase 3: Revision';
        availableQueue = revisionItems.length > 0 ? revisionItems : allWorkItems;
      } else if (dayOffset < phase1Days + phase2Days + phase3Days + phase4Days) {
        currentPhaseName = 'Phase 4: Mock Tests';
        availableQueue = mockTestItems.length > 0 ? mockTestItems : revisionItems;
      } else {
        currentPhaseName = 'Phase 5: Final Revision';
        availableQueue = finalRevisionItems.length > 0 ? finalRevisionItems : allWorkItems;
      }
    }

    // Allocate tasks for the day up to dayAvailableHours
    let hoursAllocated = 0;
    const daySlots = [];

    // Timings mapping generator
    const getStartTime = (slotIndex, preferredTiming) => {
      let baseHour = 9; // default 9:00 AM
      if (preferredTiming === 'afternoon') baseHour = 14;
      else if (preferredTiming === 'evening') baseHour = 18;
      else if (preferredTiming === 'morning_evening' && slotIndex % 2 === 1) baseHour = 16;
      
      const totalMins = (baseHour * 60) + (slotIndex * 90);
      const h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    const getEndTime = (startTimeStr, durationHours) => {
      const [time, ampm] = startTimeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;

      const endTotalMins = (h * 60) + m + Math.round(durationHours * 60);
      const endH = Math.floor(endTotalMins / 60) % 24;
      const endM = endTotalMins % 60;
      const endAmpm = endH >= 12 ? 'PM' : 'AM';
      const displayEndH = endH % 12 === 0 ? 12 : endH % 12;
      return `${displayEndH}:${String(endM).padStart(2, '0')} ${endAmpm}`;
    };

    let slotCounter = 0;
    
    if (dayAvailableHours > 0) {
      // Pick tasks from queue that have remaining hours
      for (let i = 0; i < availableQueue.length; i++) {
        const item = availableQueue[i];
        if (item.remainingHours <= 0) continue;

        // Allocate up to 1.5 - 2 hours block per topic
        const sessionHours = Math.min(item.remainingHours, 2.0, dayAvailableHours - hoursAllocated);
        if (sessionHours <= 0.25) continue;

        item.remainingHours -= sessionHours;
        hoursAllocated += sessionHours;

        const startTimeStr = getStartTime(slotCounter, preferredTimings);
        const endTimeStr = getEndTime(startTimeStr, sessionHours);

        daySlots.push({
          id: `slot_${dateKey}_${slotCounter}`,
          taskId: item.id,
          title: item.title,
          subjectName: item.subjectName || item.category || 'General',
          type: item.type,
          phase: currentPhaseName,
          durationHours: sessionHours,
          startTime: startTimeStr,
          endTime: endTimeStr,
          priority: item.priority,
          completed: false,
          isMissed: false
        });

        slotCounter++;
        if (hoursAllocated >= dayAvailableHours) break;
      }
    }

    // Every 7th day, if work queue permits, insert a Buffer / Rest & Catch-Up slot
    if ((dayOffset + 1) % 7 === 0 && daySlots.length > 0) {
      daySlots.push({
        id: `slot_${dateKey}_buffer`,
        taskId: `buffer_${dateKey}`,
        title: 'Buffer & Weekly Review / Rest Slot',
        subjectName: 'Catch-up & Wellness',
        type: 'buffer',
        phase: 'Weekly Buffer',
        durationHours: 1.0,
        startTime: getStartTime(slotCounter, preferredTimings),
        endTime: getEndTime(getStartTime(slotCounter, preferredTimings), 1.0),
        priority: { level: 'low', badge: '🟢 Low', reason: 'Weekly Buffer & Review' },
        completed: false,
        isMissed: false
      });
    }

    scheduleMap[dateKey] = {
      date: dateKey,
      dayName,
      isAvailableDay,
      availableHours: dayAvailableHours,
      phase: currentPhaseName,
      slots: daySlots,
      totalTasks: daySlots.length,
      completedTasks: 0,
      completionRate: 0
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    startDate: formatDateKey(start),
    targetDate: formatDateKey(end),
    totalDaysCount,
    allWorkItems,
    scheduleMap
  };
}
