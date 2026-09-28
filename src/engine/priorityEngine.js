/**
 * Intelligent Priority System Engine
 * Calculates priority scores dynamically based on mathematical weights:
 * - Deadline / Exam proximity (days remaining)
 * - Importance (1-5 scale)
 * - Difficulty (Easy=1, Medium=2, Hard=3)
 * - Estimated time & Remaining work (100 - completionPercentage)
 * - Postpone / Missed task penalty count
 */

export function calculatePriority({
  deadline = null,
  examDate = null,
  importance = 3,
  difficulty = 'medium', // 'easy', 'medium', 'hard'
  estimatedHours = 1,
  completionPercentage = 0,
  postponeCount = 0,
  isMissed = false,
  targetDate = null
}) {
  const now = new Date();
  
  // 1. Calculate days remaining to target deadline or exam
  let effectiveDate = deadline ? new Date(deadline) : (examDate ? new Date(examDate) : (targetDate ? new Date(targetDate) : null));
  let daysRemaining = 999;
  
  if (effectiveDate && !isNaN(effectiveDate.getTime())) {
    const diffMs = effectiveDate.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  // 2. Deadline Urgency Score (0 - 40 points)
  let deadlineScore = 0;
  if (daysRemaining === 0) deadlineScore = 40;
  else if (daysRemaining === 1) deadlineScore = 36;
  else if (daysRemaining <= 3) deadlineScore = 30;
  else if (daysRemaining <= 7) deadlineScore = 24;
  else if (daysRemaining <= 14) deadlineScore = 18;
  else if (daysRemaining <= 30) deadlineScore = 12;
  else deadlineScore = 5;

  // 3. Importance Score (1-5 scale mapped to 0 - 25 points)
  const imp = Math.min(5, Math.max(1, Number(importance) || 3));
  const importanceScore = imp * 5; // 5 to 25

  // 4. Difficulty Score (0 - 15 points)
  let difficultyScore = 10;
  const diffLower = (difficulty || 'medium').toLowerCase();
  if (diffLower === 'hard' || diffLower === 'high') difficultyScore = 15;
  else if (diffLower === 'medium') difficultyScore = 10;
  else difficultyScore = 5; // easy

  // 5. Remaining Work Score (0 - 10 points)
  const remainingPercent = Math.max(0, 100 - (Number(completionPercentage) || 0));
  const remainingWorkScore = (remainingPercent / 100) * 10;

  // 6. Missed / Postponed Penalty Score (0 - 10 points)
  let missedPenalty = Math.min(10, (postponeCount * 4) + (isMissed ? 6 : 0));

  // Total raw score (0 to 100)
  let totalScore = Math.min(100, Math.round(deadlineScore + importanceScore + difficultyScore + remainingWorkScore + missedPenalty));

  // Determine Level & Badge
  let level = 'medium';
  let badge = '🟡 Medium';
  
  if (totalScore >= 78 || (daysRemaining <= 2 && remainingPercent > 50)) {
    level = 'critical';
    badge = '🔴 Critical';
  } else if (totalScore >= 58 || (daysRemaining <= 7 && remainingPercent > 40)) {
    level = 'high';
    badge = '🟠 High';
  } else if (totalScore >= 35) {
    level = 'medium';
    badge = '🟡 Medium';
  } else {
    level = 'low';
    badge = '🟢 Low';
  }

  // Construct intelligent "WHY" explanation
  const reasons = [];
  
  if (diffLower === 'hard') reasons.push('difficult topic');
  if (daysRemaining <= 7) {
    if (daysRemaining === 0) reasons.push('due today!');
    else if (daysRemaining === 1) reasons.push('due tomorrow');
    else reasons.push(`target approaching (${daysRemaining} days left)`);
  }
  if (remainingPercent >= 60) reasons.push(`${remainingPercent}% incomplete`);
  if (imp >= 4) reasons.push(`high importance (${imp}/5)`);
  if (postponeCount > 0 || isMissed) reasons.push(`missed ${postponeCount > 0 ? postponeCount + 'x' : 'previously'}`);

  if (reasons.length === 0) {
    reasons.push('standard task progression');
  }

  const levelNameMap = {
    critical: 'Critical Priority',
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  const reasonText = `${levelNameMap[level]} — ${reasons.join(' + ')}.`;

  return {
    score: totalScore,
    level,
    badge,
    reason: reasonText,
    daysRemaining,
    remainingPercent
  };
}
