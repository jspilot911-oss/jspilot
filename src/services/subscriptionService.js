import { SUBSCRIPTION_PLANS, PLAN_IDS } from '../config/subscriptionPlans.js';

const STORAGE_KEY_USER = 'smart_planner_user_v1';
const STORAGE_KEY_SUBSCRIPTIONS = 'smart_planner_subscriptions_v1';

/**
 * Initial Default User Model
 */
const defaultTrialEnd = new Date();
defaultTrialEnd.setDate(defaultTrialEnd.getDate() + 7);

const DEFAULT_USER = {
  user_id: 'usr_demo_101',
  name: 'Demo Student',
  email: 'student@example.com',
  current_plan: PLAN_IDS.PRO, // Default 7-Day Free Trial PRO Access
  subscription_status: 'trial', // 'active' | 'trial' | 'expired' | 'canceled'
  subscription_start: new Date().toISOString(),
  trial_start: new Date().toISOString(),
  trial_end: defaultTrialEnd.toISOString(),
  billing_cycle: 'none'
};

export const SubscriptionService = {
  /**
   * Fetch Current User Profile
   */
  getUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        let u = JSON.parse(stored);
        if (u) {
          const now = new Date();
          const trialEndDate = u.trial_end ? new Date(u.trial_end) : null;
          const isPaidOrOwner = u.subscription_status === 'active' || u.role === 'owner' || u.isOwner || (u.email && (u.email.toLowerCase().includes('owner') || u.email.toLowerCase().includes('admin')));

          if (isPaidOrOwner) {
            u.current_plan = u.current_plan || PLAN_IDS.PRO;
            u.subscription_status = 'active';
          } else if (u.subscription_status === 'trial' || u.trial_activated) {
            if (trialEndDate && now > trialEndDate) {
              // 7-Day trial expired! Revert to FREE plan unless subscribed
              u.current_plan = PLAN_IDS.FREE;
              u.subscription_status = 'expired';
              this.saveUser(u);
            } else {
              // Still within active 7-Day Free Trial
              u.current_plan = PLAN_IDS.PRO;
              u.subscription_status = 'trial';
              if (!u.trial_end) {
                const defaultEnd = new Date();
                defaultEnd.setDate(defaultEnd.getDate() + 7);
                u.trial_end = defaultEnd.toISOString();
                u.trial_start = u.trial_start || now.toISOString();
                this.saveUser(u);
              }
            }
          } else {
            // Free plan user (trial not activated yet)
            u.current_plan = u.current_plan || PLAN_IDS.FREE;
            u.subscription_status = u.subscription_status || 'free';
          }
          return u;
        }
      }
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
   * Helper to check if user has active subscription or valid 7-day trial
   */
  hasProAccess(user) {
    if (!user) return false;

    const isOwner = user.role === 'owner' || user.isOwner || (user.email && (user.email.toLowerCase().includes('owner') || user.email.toLowerCase().includes('admin')));
    if (isOwner) return true;

    if (user.subscription_status === 'active' && user.current_plan !== PLAN_IDS.FREE) {
      return true;
    }

    if (user.subscription_status === 'trial' || user.trial_activated) {
      if (!user.trial_end) return true;
      return new Date() <= new Date(user.trial_end);
    }

    return false;
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
    const isProValid = this.hasProAccess(user);
    const effectivePlanId = isProValid ? PLAN_IDS.PRO : (user?.current_plan || PLAN_IDS.FREE);

    if (effectivePlanId !== PLAN_IDS.FREE) {
      if (!isProValid) {
        return { allowed: false, reason: '7-Day Free Trial or Pro subscription has expired' };
      }
    }

    const planConfig = SUBSCRIPTION_PLANS[effectivePlanId] || SUBSCRIPTION_PLANS.FREE;
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
    const isProValid = this.hasProAccess(user);
    const effectivePlanId = isProValid ? PLAN_IDS.PRO : (user?.current_plan || PLAN_IDS.FREE);
    const planConfig = SUBSCRIPTION_PLANS[effectivePlanId] || SUBSCRIPTION_PLANS.FREE;
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
