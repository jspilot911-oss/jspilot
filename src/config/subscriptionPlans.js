/**
 * Subscription Plans & Feature Limits Configuration
 * Configurable limits system for Free, Pro, and Yearly tiers.
 */

export const PLAN_IDS = {
  FREE: 'FREE',
  PRO: 'PRO',
  YEARLY: 'YEARLY'
};

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'FREE',
    name: 'FREE',
    price: 0,
    priceDisplay: '₹0',
    billingCycle: 'forever',
    description: 'Perfect for trying basic task management and daily to-do lists.',
    badge: null,
    buttonText: 'Start Free',
    buttonClass: 'btn-secondary',
    limits: {
      active_plans: 1,
      max_schedule_days: 7,
      automatic_scheduling: false,
      automatic_rescheduling: false,
      exam_syllabus_planner: false,
      advanced_priority_engine: false,
      calendar_view: false,
      advanced_analytics: false,
      smart_suggestions: false,
      plan_health_analysis: false,
      multiple_exams: false,
      unlimited_tasks: false
    }
  },

  PRO: {
    id: 'PRO',
    name: 'PRO',
    price: 49,
    priceDisplay: '₹49',
    billingCycle: 'month',
    description: 'Complete intelligence engine for exams, courses, and complex projects.',
    badge: 'MONTHLY PLAN',
    badgeClass: 'bg-purple-600 text-white',
    buttonText: 'Start Pro',
    buttonClass: 'btn-primary',
    limits: {
      active_plans: Infinity,
      max_schedule_days: Infinity,
      automatic_scheduling: true,
      automatic_rescheduling: true,
      exam_syllabus_planner: true,
      advanced_priority_engine: true,
      calendar_view: true,
      advanced_analytics: true,
      smart_suggestions: true,
      plan_health_analysis: true,
      multiple_exams: true,
      unlimited_tasks: true
    }
  },

  YEARLY: {
    id: 'YEARLY',
    name: 'YEARLY',
    price: 499,
    priceDisplay: '₹499',
    billingCycle: 'year',
    description: 'Best value for year-round exam preparation, studies, and professional goals.',
    badge: 'ANNUAL PLAN',
    badgeClass: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    buttonText: 'Get Yearly',
    buttonClass: 'btn-primary',
    limits: {
      active_plans: Infinity,
      max_schedule_days: Infinity,
      automatic_scheduling: true,
      automatic_rescheduling: true,
      exam_syllabus_planner: true,
      advanced_priority_engine: true,
      calendar_view: true,
      advanced_analytics: true,
      smart_suggestions: true,
      plan_health_analysis: true,
      multiple_exams: true,
      unlimited_tasks: true
    }
  }
};

export const COMPARISON_FEATURES = [
  { key: 'daily_planner', label: 'Daily Planner Dashboard', free: true, pro: true, yearly: true },
  { key: 'todo_list', label: 'Basic To-Do Checklist', free: true, pro: true, yearly: true },
  { key: 'basic_priority', label: 'Basic Priority Tags', free: true, pro: true, yearly: true },
  { key: 'active_plans', label: 'Active Plans Limit', free: '1 Plan', pro: 'Unlimited', yearly: 'Unlimited' },
  { key: 'exam_planner', label: 'Exam + Syllabus Planner', free: false, pro: true, yearly: true },
  { key: 'auto_priority', label: 'Automatic Intelligent Priority Engine', free: false, pro: true, yearly: true },
  { key: 'auto_scheduling', label: 'Automatic Schedule Generation', free: false, pro: true, yearly: true },
  { key: 'auto_rescheduling', label: 'Automatic Rescheduling & Recovery', free: false, pro: true, yearly: true },
  { key: 'revision_planner', label: '5-Phase Revision Planner', free: false, pro: true, yearly: true },
  { key: 'calendar_view', label: 'Interactive Monthly & Weekly Calendar', free: false, pro: true, yearly: true },
  { key: 'study_hours', label: 'Study-Hour Tracking & Logging', free: false, pro: true, yearly: true },
  { key: 'advanced_analytics', label: 'Advanced Progress Analytics', free: false, pro: true, yearly: true },
  { key: 'multiple_exams', label: 'Multiple Exams & Projects', free: false, pro: true, yearly: true },
  { key: 'smart_suggestions', label: 'Rule-Based Smart Suggestions', free: false, pro: true, yearly: true },
  { key: 'plan_health', label: 'Plan Health Analysis', free: false, pro: true, yearly: true },
  { key: 'deadline_alerts', label: 'Deadline & Countdown Alerts', free: false, pro: true, yearly: true }
];
