import { SUBSCRIPTION_PLANS, PLAN_IDS } from '../config/subscriptionPlans.js';

const STORAGE_KEY_USER = 'smart_planner_user_v1';
const STORAGE_KEY_SUBSCRIPTIONS = 'smart_planner_subscriptions_v1';

/**
 * Initial Default User Model
 */
const DEFAULT_USER = {
  user_id: 'usr_demo_101',
  name: 'Demo Student',
  email: 'student@example.com',
  current_plan: PLAN_IDS.FREE, // 'FREE' | 'PRO' | 'YEARLY'
  subscription_status: 'active', // 'active' | 'expired' | 'canceled'
  subscription_start: new Date().toISOString(),
  subscription_end: null,
  billing_cycle: 'none'
};

export const SubscriptionService = {
  /**
   * Fetch Current User Profile
   */
  getUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
    return null;
  },

  saveUser(user) {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  },

  logoutUser() {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Failed to logout user profile:', e);
    }
  },

  /**
   * Fetch All Subscriptions History
   */
  getSubscriptions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIPTIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load subscriptions:', e);
    }
    return [];
  },

  saveSubscriptions(subs) {
    try {
      localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subs));
    } catch (e) {
      console.error('Failed to save subscriptions:', e);
    }
  },

  /**
   * Check if User has Access to a Specific Feature
   */
  canUseFeature(featureKey) {
    const user = this.getUser();
    const planPlanId = user?.current_plan || PLAN_IDS.FREE;
    const planConfig = SUBSCRIPTION_PLANS[planPlanId] || SUBSCRIPTION_PLANS.FREE;

    // Check if subscription is active
    if (planPlanId !== PLAN_IDS.FREE && user?.subscription_status !== 'active') {
      return { allowed: false, reason: 'Subscription is expired or canceled' };
    }

    const isAllowed = Boolean(planConfig.limits[featureKey]);
    return {
      allowed: isAllowed,
      reason: isAllowed ? 'Included in your plan' : `Feature "${featureKey}" requires Smart Planner PRO`
    };
  },

  /**
   * Check Plan Creation Count Limit
   */
  canCreatePlan(currentPlansCount = 0) {
    const user = this.getUser();
    const planPlanId = user?.current_plan || PLAN_IDS.FREE;
    const planConfig = SUBSCRIPTION_PLANS[planPlanId] || SUBSCRIPTION_PLANS.FREE;
    const limit = planConfig.limits.active_plans;

    if (currentPlansCount >= limit) {
      return {
        allowed: false,
        limit,
        message: `Free plan is limited to ${limit} active plan. Upgrade to Pro for unlimited plans.`
      };
    }
    return { allowed: true, limit };
  },

  /**
   * Process Simulated Payment & Activate Subscription
   */
  processPayment({ planId, billingCycle, paymentMethod = 'UPI' }) {
    const planConfig = SUBSCRIPTION_PLANS[planId];
    if (!planConfig) {
      return { success: false, error: 'Invalid plan selected' };
    }

    const now = new Date();
    const endDate = new Date(now);
    if (billingCycle === 'year' || planId === PLAN_IDS.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const paymentRef = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create Subscription Model Record
    const subscriptionRecord = {
      subscription_id: `sub_${Date.now()}`,
      user_id: 'usr_demo_101',
      plan: planId,
      amount: planConfig.price,
      billing_cycle: billingCycle,
      status: 'active',
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      payment_reference: paymentRef,
      payment_method: paymentMethod,
      created_at: now.toISOString()
    };

    // Save Subscription Record
    const subs = this.getSubscriptions();
    this.saveSubscriptions([subscriptionRecord, ...subs]);

    // Update User Profile Status
    const user = this.getUser();
    const updatedUser = {
      ...user,
      current_plan: planId,
      subscription_status: 'active',
      subscription_start: now.toISOString(),
      subscription_end: endDate.toISOString(),
      billing_cycle: billingCycle,
      latest_payment_ref: paymentRef
    };

    this.saveUser(updatedUser);

    return {
      success: true,
      subscription: subscriptionRecord,
      user: updatedUser
    };
  },

  /**
   * Cancel Subscription (preserves data, sets status to canceled)
   */
  cancelSubscription() {
    const user = this.getUser();
    const updatedUser = {
      ...user,
      current_plan: PLAN_IDS.FREE,
      subscription_status: 'canceled',
      subscription_end: new Date().toISOString()
    };
    this.saveUser(updatedUser);
    return updatedUser;
  },

  /**
   * Test Helper: Simulate Expiry
   */
  simulateExpiry() {
    const user = this.getUser();
    const updatedUser = {
      ...user,
      current_plan: PLAN_IDS.FREE,
      subscription_status: 'expired',
      subscription_end: new Date().toISOString()
    };
    this.saveUser(updatedUser);
    return updatedUser;
  }
};
