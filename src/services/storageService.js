import { generateSchedule, formatDateKey } from '../engine/schedulerEngine.js';

const STORAGE_KEY_PLANS = 'smart_planner_plans_v1';
const STORAGE_KEY_ACTIVE = 'smart_planner_active_id_v1';
const STORAGE_KEY_NOTIFS = 'smart_planner_notifs_v1';

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Generate Clean Initial Plan
 */
export function createInitialPlan() {
  const today = new Date();

  const rawData = {
    id: `plan_${Date.now()}`,
    title: 'My Smart Plan',
    type: 'general',
    examName: '',
    targetDate: formatDateKey(today),
    availableHoursPerDay: 4,
    preferredTimings: 'morning_evening',
    weeklyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    includePractice: false,
    includeMockTests: false,
    createdAt: new Date().toISOString(),
    subjects: [],
    generalTasks: []
  };

  const gen = generateSchedule(rawData);
  return { ...rawData, ...gen };
}

/**
 * Storage API Service
 */
export const StorageService = {
  getStorageKey(userId) {
    return userId ? `${STORAGE_KEY_PLANS}_${userId}` : STORAGE_KEY_PLANS;
  },

  loadPlans(userId = null) {
    try {
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse plans from LocalStorage:', e);
    }

    // Fresh user workspace starts with 0 plans & 0 tasks
    return [];
  },

  savePlans(plans, userId = null) {
    try {
      const key = this.getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed to save plans to LocalStorage:', e);
    }
  },

  getActivePlanId(userId = null) {
    const key = userId ? `${STORAGE_KEY_ACTIVE}_${userId}` : STORAGE_KEY_ACTIVE;
    return localStorage.getItem(key) || '';
  },

  setActivePlanId(id, userId = null) {
    const key = userId ? `${STORAGE_KEY_ACTIVE}_${userId}` : STORAGE_KEY_ACTIVE;
    localStorage.setItem(key, id);
  },

  saveSinglePlan(updatedPlan, userId = null) {
    const plans = this.loadPlans(userId);
    const index = plans.findIndex(p => p.id === updatedPlan.id);
    let newPlans = [];
    if (index >= 0) {
      newPlans = [...plans];
      newPlans[index] = updatedPlan;
    } else {
      newPlans = [updatedPlan, ...plans];
    }
    this.savePlans(newPlans, userId);
  },

  deletePlan(planId, userId = null) {
    let plans = this.loadPlans(userId);
    plans = plans.filter(p => p.id !== planId);
    this.savePlans(plans, userId);
    if (this.getActivePlanId(userId) === planId && plans.length > 0) {
      this.setActivePlanId(plans[0].id, userId);
    }
  },

  clearUserPlans(userId = null) {
    const keyPlans = this.getStorageKey(userId);
    const keyActive = userId ? `${STORAGE_KEY_ACTIVE}_${userId}` : STORAGE_KEY_ACTIVE;
    localStorage.removeItem(keyPlans);
    localStorage.removeItem(keyActive);
    return [];
  }
};
