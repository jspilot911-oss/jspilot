import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import PlanControlsBar from './components/PlanControlsBar.jsx';
import ExamCountdownCard from './components/ExamCountdownCard.jsx';
import DailyDashboard from './components/DailyDashboard.jsx';
import CalendarView from './components/CalendarView.jsx';
import ProgressTrackingView from './components/ProgressTrackingView.jsx';
import SmartSuggestionsBanner from './components/SmartSuggestionsBanner.jsx';
import QuickAddTaskModal from './components/QuickAddTaskModal.jsx';
import PlanWizardModal from './components/PlanWizardModal.jsx';
import NotificationsDrawer from './components/NotificationsDrawer.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

import AuthModal from './components/AuthModal.jsx';
import LoginPage from './components/LoginPage.jsx';
import FreeUpgradeBanner from './components/FreeUpgradeBanner.jsx';
import PricingPage from './components/PricingPage.jsx';
import UnlockSmartPlanningPage from './components/UnlockSmartPlanningPage.jsx';
import PremiumFeatureLockModal from './components/PremiumFeatureLockModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import PaymentSuccessPage from './components/PaymentSuccessPage.jsx';
import PaymentFailedPage from './components/PaymentFailedPage.jsx';
import SubscriptionManagementModal from './components/SubscriptionManagementModal.jsx';
import SmtpDatabaseLogsModal from './components/SmtpDatabaseLogsModal.jsx';
import UserProfileModal from './components/UserProfileModal.jsx';
import AppTutorialModal from './components/AppTutorialModal.jsx';
import StartFreeTrialModal from './components/StartFreeTrialModal.jsx';
import TaskPomodoroModal from './components/TaskPomodoroModal.jsx';
import RescheduleSummaryModal from './components/RescheduleSummaryModal.jsx';
import RescheduleDatePickerModal from './components/RescheduleDatePickerModal.jsx';
import MotivationalQuoteBanner from './components/MotivationalQuoteBanner.jsx';

import { StorageService, createInitialPlan } from './services/storageService.js';
import { SubscriptionService } from './services/subscriptionService.js';
import { SmtpService } from './services/smtpService.js';
import { PLAN_IDS } from './config/subscriptionPlans.js';

import { generateSchedule, formatDateKey } from './engine/schedulerEngine.js';
import { rescheduleMissedTasks, rescheduleTasksToCustomDate } from './engine/reschedulerEngine.js';
import { calculatePriority } from './engine/priorityEngine.js';

import {
  Calendar as CalendarIcon,
  CheckSquare,
  BarChart2,
  Zap,
  Lock,
  Plus
} from 'lucide-react';

export default function App() {
  // Theme State ('light' | 'dark' | 'theme-cyber' | 'theme-ocean' | 'theme-emerald' | 'theme-rose')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smart_planner_theme_v1') || 'light';
  });

  const handleSelectTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem('smart_planner_theme_v1', nextTheme);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    handleSelectTheme(nextTheme);
  };

  // Sync multi-color theme classes to document element
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'theme-cyber', 'theme-ocean', 'theme-emerald', 'theme-rose', 'theme-amber', 'theme-peach');
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Main Data States
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [activeTab, setActiveTab] = useState('daily');
  const [user, setUser] = useState(null);

  // Page View Controller ('dashboard', 'pricing', 'unlock_page', 'payment_success', 'payment_failed')
  const [currentView, setCurrentView] = useState('dashboard');

  // Subscription Modals & Checkout State
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState('PRO');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFeatureLockOpen, setIsFeatureLockOpen] = useState(false);
  const [lockedFeatureKey, setLockedFeatureKey] = useState('automatic_rescheduling');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [lastSubscriptionRecord, setLastSubscriptionRecord] = useState(null);
  const [paymentFailedReason, setPaymentFailedReason] = useState('');

  // General Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isStartTrialModalOpen, setIsStartTrialModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingPlanData, setEditingPlanData] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isConfirmDeletePlanOpen, setIsConfirmDeletePlanOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toastAlert, setToastAlert] = useState(null);

  // Global Background Task Pomodoro Clock State
  const [activePomodoroSlot, setActivePomodoroSlot] = useState(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  useEffect(() => {
    const handleReopen = () => setIsPomodoroOpen(true);
    window.addEventListener('reopen_pomodoro', handleReopen);
    return () => window.removeEventListener('reopen_pomodoro', handleReopen);
  }, []);

  const handleActivateFreeTrial = () => {
    if (!user) return;
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + 7);

    const updatedUser = {
      ...user,
      current_plan: PLAN_IDS.PRO,
      subscription_status: 'trial',
      trial_start: now.toISOString(),
      trial_end: trialEnd.toISOString(),
      subscription_start: user.subscription_start || now.toISOString(),
      trial_activated: true
    };

    setUser(updatedUser);
    SubscriptionService.saveUser(updatedUser);
    setIsStartTrialModalOpen(false);

    showToast('🚀 7-Day Free PRO Trial Activated! All Pro Features Unlocked for 7 Days.');
  };

  const checkAndTriggerFirstTimeTour = (userData) => {
    if (!userData || !userData.user_id) return;
    const tourKeyUser = `smart_planner_tour_seen_${userData.user_id}`;
    const tourKeyEmail = userData.email ? `smart_planner_tour_seen_${userData.email}` : null;

    const hasSeenUser = localStorage.getItem(tourKeyUser) === 'true';
    const hasSeenEmail = tourKeyEmail ? localStorage.getItem(tourKeyEmail) === 'true' : false;

    if (!hasSeenUser && !hasSeenEmail) {
      setTimeout(() => {
        setIsTutorialOpen(true);
      }, 500);
      localStorage.setItem(tourKeyUser, 'true');
      if (tourKeyEmail) localStorage.setItem(tourKeyEmail, 'true');
    }
  };

  const handleLoginSuccess = async (userData, mode) => {
    const isOwner = userData?.role === 'owner' || userData?.isOwner || (userData?.email && (userData.email.toLowerCase().includes('owner') || userData.email.toLowerCase().includes('admin')));
    const finalUserData = isOwner ? { ...userData, current_plan: 'PRO', role: 'owner', isOwner: true } : userData;

    setUser(finalUserData);
    SubscriptionService.saveUser(finalUserData);

    // Register user in Database & Dispatch SMTP Transmission Log
    await SmtpService.registerUserDatabase(finalUserData, mode);

    // Load clean workspace for this signed-in user (0 previous plans/tasks)
    const userPlans = StorageService.loadPlans(userData.user_id);
    const activeId = StorageService.getActivePlanId(userData.user_id);
    setPlans(userPlans);
    setActivePlanId(activeId);

    setCurrentView('dashboard');

    // Prompt user to activate/confirm 7-Day Free Trial if newly registered or hasn't confirmed trial yet
    if (mode === 'register' || (!isOwner && finalUserData?.subscription_status === 'trial')) {
      setTimeout(() => {
        setIsStartTrialModalOpen(true);
      }, 300);
    }

    showToast(mode === 'register'
      ? `✨ Account registered & logged in SMTP Database! Fresh workspace initialized.`
      : `✨ Welcome back, ${userData.name}! Clean workspace ready.`
    );

    // Automatically trigger interactive tour on first time login/registration
    checkAndTriggerFirstTimeTour(finalUserData);
  };

  const handleLogout = () => {
    SubscriptionService.logoutUser();
    setUser(null);
    setCurrentView('login');
    showToast('You have signed out successfully.');
  };

  // Initial Data Loading & Routing
  useEffect(() => {
    const loadedUser = SubscriptionService.getUser();
    setUser(loadedUser);

    const loadedPlans = StorageService.loadPlans(loadedUser?.user_id);
    const activeId = StorageService.getActivePlanId(loadedUser?.user_id);

    setPlans(loadedPlans);
    setActivePlanId(activeId);

    const hasLoginHash = window.location.hash === '#login' || window.location.search.includes('auth=login');
    if (!loadedUser || hasLoginHash) {
      setCurrentView('login');
    } else {
      checkAndTriggerFirstTimeTour(loadedUser);
    }
  }, []);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const showToast = (msg) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(null), 5000);
  };

  const gateFeature = (featureKey, callback) => {
    const access = SubscriptionService.canUseFeature(featureKey);
    if (!access.allowed) {
      setLockedFeatureKey(featureKey);
      setIsFeatureLockOpen(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  const handleSelectPlan = (planId) => {
    setActivePlanId(planId);
    StorageService.setActivePlanId(planId, user?.user_id);
  };

  const handleSavePlan = (planPayload) => {
    const isNew = !plans.some(p => p.id === planPayload.id);
    if (isNew) {
      const checkLimit = SubscriptionService.canCreatePlan(plans.length);
      if (!checkLimit.allowed) {
        setLockedFeatureKey('active_plans');
        setIsFeatureLockOpen(true);
        return;
      }
    }

    const generated = generateSchedule(planPayload);
    const fullPlan = { ...planPayload, ...generated };

    const index = plans.findIndex(p => p.id === fullPlan.id);
    let newPlans = [];
    if (index >= 0) {
      newPlans = [...plans];
      newPlans[index] = fullPlan;
    } else {
      newPlans = [fullPlan, ...plans];
    }

    setPlans(newPlans);
    setActivePlanId(fullPlan.id);
    StorageService.savePlans(newPlans, user?.user_id);
    StorageService.setActivePlanId(fullPlan.id, user?.user_id);
    showToast(`Plan ${index >= 0 ? 'updated' : 'created'} successfully! Schedule generated.`);
  };

  const handleToggleTaskCompleted = (dateKey, slotId) => {
    if (!activePlan || !activePlan.scheduleMap) return;

    const newScheduleMap = JSON.parse(JSON.stringify(activePlan.scheduleMap));
    const dayData = newScheduleMap[dateKey];
    if (dayData && dayData.slots) {
      const slot = dayData.slots.find(s => s.id === slotId);
      if (slot) {
        slot.completed = !slot.completed;
      }
    }

    const updatedPlan = { ...activePlan, scheduleMap: newScheduleMap };
    updateActivePlan(updatedPlan);
  };

  // Reschedule Summary & Date Picker Modal State
  const [isRescheduleSummaryOpen, setIsRescheduleSummaryOpen] = useState(false);
  const [isRescheduleDatePickerOpen, setIsRescheduleDatePickerOpen] = useState(false);
  const [activeRescheduledChanges, setActiveRescheduledChanges] = useState([]);

  const handleMarkTaskMissed = (dateKey, slotId) => {
    gateFeature('automatic_rescheduling', () => {
      if (!activePlan || !activePlan.scheduleMap) return;

      const newScheduleMap = JSON.parse(JSON.stringify(activePlan.scheduleMap));
      const dayData = newScheduleMap[dateKey];
      if (dayData && dayData.slots) {
        const slot = dayData.slots.find(s => s.id === slotId);
        if (slot) {
          slot.isMissed = true;
          slot.completed = false;
        }
      }

      const tempPlan = { ...activePlan, scheduleMap: newScheduleMap };
      const { plan: rescheduledPlan, notification, rescheduledChanges } = rescheduleMissedTasks(tempPlan, selectedDate);

      updateActivePlan(rescheduledPlan);
      setActiveRescheduledChanges(rescheduledChanges || []);
      setIsRescheduleSummaryOpen(true);

      if (notification) {
        setNotifications(prev => [notification, ...prev]);
        showToast('Your plan has been automatically adjusted because 1 high-priority task was missed.');
      }
    });
  };

  const handleTriggerReschedule = () => {
    gateFeature('automatic_rescheduling', () => {
      if (!activePlan) return;
      setIsRescheduleDatePickerOpen(true);
    });
  };

  const handleConfirmCustomReschedule = (rescheduleOptions) => {
    gateFeature('automatic_rescheduling', () => {
      if (!activePlan) return;
      const { plan: rescheduledPlan, notification, rescheduledChanges } = rescheduleTasksToCustomDate(activePlan, {
        ...rescheduleOptions,
        currentDateStr: selectedDate
      });
      updateActivePlan(rescheduledPlan);
      setActiveRescheduledChanges(rescheduledChanges || []);
      setIsRescheduleDatePickerOpen(false);
      setIsRescheduleSummaryOpen(true);

      if (notification) {
        setNotifications(prev => [notification, ...prev]);
        showToast(notification.message);
      }
    });
  };

  const handleRegeneratePlan = () => {
    if (!activePlan) return;
    const gen = generateSchedule(activePlan);
    const updatedPlan = { ...activePlan, ...gen };
    updateActivePlan(updatedPlan);
    showToast('Plan schedule regenerated with latest priority rules!');
  };

  const handleTogglePause = () => {
    if (!activePlan) return;
    const updatedPlan = { ...activePlan, isPaused: !activePlan.isPaused };
    updateActivePlan(updatedPlan);
    showToast(`Plan ${updatedPlan.isPaused ? 'paused' : 'resumed'}.`);
  };

  const handleConfirmReset = () => {
    if (!activePlan) return;

    // Reset progress on current plan's subjects and general tasks cleanly
    const resetSubjects = (activePlan.subjects || []).map(s => ({
      ...s,
      chapters: (s.chapters || []).map(c => ({
        ...c,
        completionPercentage: 0
      }))
    }));

    const resetGeneralTasks = (activePlan.generalTasks || []).map(t => ({
      ...t,
      completionPercentage: 0
    }));

    const resetRaw = {
      ...activePlan,
      subjects: resetSubjects,
      generalTasks: resetGeneralTasks,
      isPaused: false
    };

    const gen = generateSchedule(resetRaw);
    const fullResetPlan = { ...resetRaw, ...gen };

    updateActivePlan(fullResetPlan);
    setIsConfirmResetOpen(false);
    showToast('Plan schedule and progress have been reset.');
  };

  const handleConfirmDeletePlan = () => {
    if (!activePlan) return;
    const remainingPlans = plans.filter(p => p.id !== activePlan.id);
    const nextActiveId = remainingPlans.length > 0 ? remainingPlans[0].id : '';
    setPlans(remainingPlans);
    setActivePlanId(nextActiveId);
    StorageService.savePlans(remainingPlans, user?.user_id);
    StorageService.setActivePlanId(nextActiveId, user?.user_id);
    setIsConfirmDeletePlanOpen(false);
    showToast('Plan deleted successfully from your workspace.');
  };

  const handleDeleteTask = (dateKey, slotId) => {
    if (!activePlan || !activePlan.scheduleMap) return;

    const newScheduleMap = JSON.parse(JSON.stringify(activePlan.scheduleMap));
    const dayData = newScheduleMap[dateKey];
    if (dayData && dayData.slots) {
      dayData.slots = dayData.slots.filter(s => s.id !== slotId);
    }

    const updatedPlan = { ...activePlan, scheduleMap: newScheduleMap };
    updateActivePlan(updatedPlan);
    showToast('Task deleted successfully from schedule.');
  };

  const triggerNotificationAlert = (notifInput) => {
    let payload;
    if (typeof notifInput === 'string') {
      payload = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: 'Task Notification',
        message: notifInput,
        dueInfo: `${selectedDate}`,
        source: 'Default Webpage Notification',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      payload = {
        id: notifInput.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: notifInput.title || 'Task Notification',
        message: notifInput.message,
        dueInfo: notifInput.dueInfo || `${selectedDate}`,
        source: notifInput.source || 'Default Webpage Notification',
        timestamp: notifInput.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 1. Show Toast Alert
    showToast(`${payload.title}: ${payload.message}`);

    // 2. Add to Notifications Drawer
    setNotifications(prev => [payload, ...prev]);

    // 3. Dispatch Native Browser Desktop Notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(`📌 ${payload.title}`, {
          body: `${payload.message}\n📅 Due: ${payload.dueInfo}`,
          icon: `${import.meta.env.BASE_URL}logo.png`
        });
      } catch (e) {
        console.warn('Native notification error:', e);
      }
    }
  };

  // Request Native Web Browser Notification Permission on App Load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Default Webpage Background Automated Notification Engine
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activePlan || !activePlan.scheduleMap) return;

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const ampm = currentHours >= 12 ? 'PM' : 'AM';
      const formattedHours = (currentHours % 12 || 12).toString().padStart(2, '0');
      const formattedMinutes = currentMinutes.toString().padStart(2, '0');
      const currentTimeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

      const todayStr = formatDateKey(now);
      const dayData = activePlan.scheduleMap[todayStr];

      if (dayData && dayData.slots) {
        dayData.slots.forEach(slot => {
          if (slot.completed) return;

          const slotDueDate = slot.dueDate || todayStr;
          const dueTimeStr = slot.startTime || '09:00 AM';

          if (currentTimeStr === dueTimeStr && !slot.autoNotified) {
            slot.autoNotified = true;
            triggerNotificationAlert({
              title: 'Default Webpage Notification',
              message: `⏰ DEFAULT REMINDER: "${slot.title}" is due now!`,
              dueInfo: `${slotDueDate} at ${dueTimeStr}`,
              source: slot.customNotificationSet ? 'User Custom Alarm' : 'Default Webpage Notification'
            });
          }
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [activePlan]);

  const handleUpdateTaskTime = (dateKey, slotId, newStartTime, newEndTime, newDueDate, reminderOffset) => {
    if (!activePlan || !activePlan.scheduleMap) return;

    const newScheduleMap = JSON.parse(JSON.stringify(activePlan.scheduleMap));
    const dayData = newScheduleMap[dateKey];
    if (dayData && dayData.slots) {
      const slot = dayData.slots.find(s => s.id === slotId);
      if (slot) {
        slot.startTime = newStartTime;
        slot.endTime = newEndTime;
        slot.dueDate = newDueDate || dateKey;
        slot.reminderOffset = reminderOffset || '0';
        slot.customNotificationSet = true;
        slot.autoNotified = false;
      }
    }

    const updatedPlan = { ...activePlan, scheduleMap: newScheduleMap };
    updateActivePlan(updatedPlan);
  };

  const handleQuickAddTask = (taskPayload) => {
    if (!activePlan) return;

    const priorityObj = calculatePriority({
      deadline: taskPayload.deadline,
      importance: taskPayload.importance,
      difficulty: taskPayload.difficulty,
      estimatedHours: taskPayload.estimatedHours,
      completionPercentage: 0
    });

    const newTask = {
      id: `gt_quick_${Date.now()}`,
      title: taskPayload.title,
      category: taskPayload.category,
      type: 'general',
      phase: 'Injected Task',
      deadline: taskPayload.deadline,
      estimatedHours: taskPayload.estimatedHours,
      remainingHours: taskPayload.estimatedHours,
      difficulty: taskPayload.difficulty,
      importance: taskPayload.importance,
      completionPercentage: 0,
      priority: priorityObj
    };

    const updatedGeneralTasks = [...(activePlan.generalTasks || []), newTask];
    const updatedPlanRaw = { ...activePlan, generalTasks: updatedGeneralTasks };

    const gen = generateSchedule(updatedPlanRaw);
    const fullUpdatedPlan = { ...updatedPlanRaw, ...gen };

    updateActivePlan(fullUpdatedPlan);
    showToast(`Inserted "${taskPayload.title}" into schedule with ${priorityObj.badge} priority.`);
  };

  const handleSmartSuggestionAction = (actionType) => {
    if (actionType === 'reschedule_now') {
      handleTriggerReschedule();
    } else if (actionType === 'increase_hours') {
      const updatedPlan = {
        ...activePlan,
        availableHoursPerDay: Number(activePlan.availableHoursPerDay || 4) + 1
      };
      const gen = generateSchedule(updatedPlan);
      updateActivePlan({ ...updatedPlan, ...gen });
      showToast('Allocated +1 extra study hour to daily capacity!');
    } else if (actionType === 'preview') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(formatDateKey(tomorrow));
      setActiveTab('daily');
    } else if (actionType === 'view_progress') {
      setActiveTab('progress');
    }
  };

  const updateActivePlan = (updatedPlan) => {
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlans(newPlans);
    StorageService.saveSinglePlan(updatedPlan, user?.user_id);
  };

  const handleSelectPlanToBuy = (planId) => {
    if (planId === PLAN_IDS.FREE) {
      showToast('You are on the Free plan.');
      return;
    }
    setSelectedPlanToBuy(planId);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    const res = SubscriptionService.processPayment(paymentDetails);
    if (res.success) {
      setUser(res.user);
      setLastSubscriptionRecord(res.subscription);
      setIsCheckoutOpen(false);
      setCurrentView('payment_success');
      showToast('✨ Smart Planner Pro Activated Successfully!');
    }
  };

  const handlePaymentFailed = (err) => {
    setPaymentFailedReason(err.reason || 'Payment declined.');
    setIsCheckoutOpen(false);
    setCurrentView('payment_failed');
  };

  const handleCancelSubscription = () => {
    const updatedUser = SubscriptionService.cancelSubscription();
    setUser(updatedUser);
    showToast('Subscription canceled. Returned to Free feature limits.');
  };

  const handleOwnerUpdateUserPlan = (targetEmail, newPlan) => {
    SmtpService.updateUserPlan(targetEmail, newPlan);
    if (user && (user.email === targetEmail || user.user_id === targetEmail)) {
      const updatedUser = {
        ...user,
        current_plan: newPlan,
        subscription_status: 'active'
      };
      setUser(updatedUser);
      SubscriptionService.saveUser(updatedUser);
    }
    showToast(`👑 Owner Action: User plan updated to ${newPlan}!`);
  };

  const handleUpdateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    setUser(updatedUser);
    SubscriptionService.saveUser(updatedUser);
    SmtpService.registerUserDatabase(updatedUser, 'update_profile');
    showToast('✨ User profile details updated successfully!');
  };

  // View Page Switcher Routing
  if (currentView === 'login' || !user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  if (currentView === 'pricing') {
    return (
      <div className={theme}>
        <PricingPage
          user={user}
          onSelectPlanToBuy={handleSelectPlanToBuy}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  if (currentView === 'unlock_page') {
    return (
      <div className={theme}>
        <UnlockSmartPlanningPage
          onGoToPricing={() => setCurrentView('pricing')}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  if (currentView === 'payment_success') {
    return (
      <div className={theme}>
        <PaymentSuccessPage
          subscription={lastSubscriptionRecord}
          onReturnToDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  if (currentView === 'payment_failed') {
    return (
      <div className={theme}>
        <PaymentFailedPage
          errorReason={paymentFailedReason}
          onRetryPayment={() => handleSelectPlanToBuy('PRO')}
          onReturnToDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  // Default Workspace Dashboard View
  return (
    <div className={`${theme} min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col font-sans text-slate-900 dark:text-slate-100 pb-16 transition-colors`}>

      {/* Top Navigation Navbar */}
      <Navbar
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
        onOpenWizard={() => { setEditingPlanData(null); setIsWizardOpen(true); }}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        notifCount={notifications.length}
        onToggleNotifs={() => setIsNotifsOpen(!isNotifsOpen)}
        user={user}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSmtpLogs={() => setIsSmtpModalOpen(true)}
        onOpenPricing={() => setCurrentView('pricing')}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Dynamic Toast Notification Banner */}
      {toastAlert && (
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-4 py-3 text-center text-xs sm:text-sm font-black shadow-lg animate-fade-in flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-pink-300 fill-pink-300 animate-bounce" />
          <span>{toastAlert}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8 flex-1 w-full">

        {/* Pro Upgrade Banner with 7-Day Free Trial */}
        <FreeUpgradeBanner
          user={user}
          onExplorePro={() => setCurrentView('unlock_page')}
        />

        {/* Controls Toolbar */}
        <PlanControlsBar
          plan={activePlan}
          onOpenWizard={() => { setEditingPlanData(null); setIsWizardOpen(true); }}
          onEditPlan={() => { setEditingPlanData(activePlan); setIsWizardOpen(true); }}
          onRegenerate={handleRegeneratePlan}
          onReschedule={handleTriggerReschedule}
          onTogglePause={handleTogglePause}
          onResetPlan={() => setIsConfirmResetOpen(true)}
          onDeletePlan={() => setIsConfirmDeletePlanOpen(true)}
        />

        {/* Exam Target & Countdown Banner */}
        <ExamCountdownCard
          plan={activePlan}
          selectedDate={selectedDate}
        />

        {/* Rule-Based Smart Engine Suggestions */}
        <SmartSuggestionsBanner
          plan={activePlan}
          selectedDate={selectedDate}
          onApplyAction={handleSmartSuggestionAction}
        />

        {/* Main View Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 sm:gap-6 min-w-max">
            <button
              onClick={() => setActiveTab('daily')}
              className={`pb-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 transition-all ${activeTab === 'daily'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Daily Dashboard</span>
            </button>

            <button
              onClick={() => {
                gateFeature('calendar_view', () => setActiveTab('calendar'));
              }}
              className={`pb-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 transition-all ${activeTab === 'calendar'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar View</span>
              {user?.current_plan === PLAN_IDS.FREE && <Lock className="w-3 h-3 text-slate-400" />}
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`pb-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 transition-all ${activeTab === 'progress'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Progress Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Daily Dashboard View */}
        {activeTab === 'daily' && (
          <>
            <MotivationalQuoteBanner selectedDate={selectedDate} />
            <DailyDashboard
              plan={activePlan}
              selectedDate={selectedDate}
              onToggleTaskCompleted={handleToggleTaskCompleted}
              onMarkTaskMissed={handleMarkTaskMissed}
              onRescheduleSingleTask={handleTriggerReschedule}
              onOpenWizard={() => { setEditingPlanData(null); setIsWizardOpen(true); }}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskTime={handleUpdateTaskTime}
              onOpenPomodoro={(slot) => {
                setActivePomodoroSlot(slot);
                setIsPomodoroOpen(true);
              }}
              onTriggerNotificationPop={triggerNotificationAlert}
            />
          </>
        )}

        {/* Tab 2: Calendar View (Gated) */}
        {activeTab === 'calendar' && (
          <CalendarView
            plan={activePlan}
            selectedDate={selectedDate}
            onSelectDate={(dStr) => {
              setSelectedDate(dStr);
              setActiveTab('daily');
            }}
          />
        )}

        {/* Tab 3: Progress Tracking Analytics */}
        {activeTab === 'progress' && (
          <ProgressTrackingView
            plan={activePlan}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation Dock (Phone View) */}
      {currentView === 'dashboard' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-3 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'daily'
                ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                : 'text-slate-500 dark:text-slate-400 font-bold'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Tasks</span>
          </button>

          <button
            onClick={() => gateFeature('calendar_view', () => setActiveTab('calendar'))}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'calendar'
                ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                : 'text-slate-500 dark:text-slate-400 font-bold'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Calendar</span>
          </button>

          {/* Floating Action Button for Quick Add */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg transform -translate-y-3 border-2 border-white dark:border-slate-900 active:scale-95 transition-all"
            title="Add Quick Task"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'progress'
                ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                : 'text-slate-500 dark:text-slate-400 font-bold'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Progress</span>
          </button>

          <button
            onClick={() => setCurrentView('pricing')}
            className={`flex flex-col items-center justify-center transition-all ${
              currentView === 'pricing'
                ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                : 'text-slate-500 dark:text-slate-400 font-bold'
            }`}
          >
            <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-[10px] mt-0.5">Plans</span>
          </button>
        </nav>
      )}


      {/* Plan Wizard Modal */}
      <PlanWizardModal
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setEditingPlanData(null); }}
        onSavePlan={handleSavePlan}
        initialData={editingPlanData}
      />

      {/* Quick Add Task Modal */}
      <QuickAddTaskModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleQuickAddTask}
      />

      {/* System Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onClearNotifs={() => setNotifications([])}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        title="Reset Smart Plan"
        message="Are you sure you want to reset this plan schedule?"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsConfirmResetOpen(false)}
      />

      {/* Delete Plan Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmDeletePlanOpen}
        title="Delete Smart Plan"
        message="Are you sure you want to delete this entire plan? This action cannot be undone."
        onConfirm={handleConfirmDeletePlan}
        onCancel={() => setIsConfirmDeletePlanOpen(false)}
      />

      {/* Premium Feature Lock Modal */}
      <PremiumFeatureLockModal
        isOpen={isFeatureLockOpen}
        featureKey={lockedFeatureKey}
        onClose={() => setIsFeatureLockOpen(false)}
        onUpgradeClick={() => {
          setIsFeatureLockOpen(false);
          setCurrentView('pricing');
        }}
      />

      {/* Sandbox Checkout Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        selectedPlanId={selectedPlanToBuy}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
      />

      {/* User Subscription & Profile Management Modal */}
      <SubscriptionManagementModal
        isOpen={isSubscriptionModalOpen}
        user={user}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onUpgradeClick={() => {
          setIsSubscriptionModalOpen(false);
          setCurrentView('pricing');
        }}
        onCancelSubscription={handleCancelSubscription}
        onLogout={handleLogout}
      />

      {/* Dedicated User Profile & Theme Customizer Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        onOpenPricing={() => setCurrentView('pricing')}
        onLogout={handleLogout}
        onUpdateUserPlan={handleOwnerUpdateUserPlan}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Interactive App Feature Walkthrough Tutorial Modal */}
      <AppTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* 7-Day Free Trial Activation Modal */}
      <StartFreeTrialModal
        isOpen={isStartTrialModalOpen}
        onClose={() => setIsStartTrialModalOpen(false)}
        onActivateTrial={handleActivateFreeTrial}
      />

      {/* Auth Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SMTP Database & Email Transcripts Modal */}
      <SmtpDatabaseLogsModal
        isOpen={isSmtpModalOpen}
        user={user}
        onClose={() => setIsSmtpModalOpen(false)}
        onUpdateUserPlan={handleOwnerUpdateUserPlan}
      />

      {/* Global Task Dedicated Pomodoro Clock (Modal & Bottom-Right Corner Background Widget) */}
      <TaskPomodoroModal
        isOpen={isPomodoroOpen}
        onClose={(terminate = true) => {
          setIsPomodoroOpen(false);
          if (terminate) {
            setActivePomodoroSlot(null);
          }
        }}
        slot={activePomodoroSlot}
        onCompleteTask={(slotId) => {
          handleToggleTaskCompleted(selectedDate, slotId);
          setIsPomodoroOpen(false);
          setActivePomodoroSlot(null);
        }}
        onTriggerNotificationPop={(msg) => {
          showToast(msg);
          setNotifications(prev => [{
            id: `notif_${Date.now()}`,
            title: 'Pomodoro Alarm',
            message: msg,
            type: 'reminder',
            timestamp: new Date().toISOString()
          }, ...prev]);
        }}
      />

      {/* Reschedule Date & Time Picker Modal */}
      <RescheduleDatePickerModal
        isOpen={isRescheduleDatePickerOpen}
        onClose={() => setIsRescheduleDatePickerOpen(false)}
        plan={activePlan}
        selectedDate={selectedDate}
        onConfirmReschedule={handleConfirmCustomReschedule}
      />

      {/* Reschedule Changes & Rebalanced Dates/Times Summary Modal */}
      <RescheduleSummaryModal
        isOpen={isRescheduleSummaryOpen}
        onClose={() => setIsRescheduleSummaryOpen(false)}
        changes={activeRescheduledChanges}
        plan={activePlan}
      />

    </div>
  );
}
