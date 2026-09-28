import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Target, 
  Clock, 
  Zap, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Bell, 
  ShieldCheck,
  Plus,
  Palette,
  Compass,
  CheckSquare
} from 'lucide-react';

export default function AppTutorialModal({
  isOpen,
  onClose
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const modalRef = useRef(null);

  const tutorialSteps = [
    {
      target: '[data-tour="brand-logo"]',
      title: 'Welcome to JSPilot Pro Engine! 🚀',
      subtitle: 'Automated AI Planner for Exam & Task Success',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            JSPilot automatically structures your exam syllabus, schedules daily habit tasks, calculates mathematical priorities, and reschedules missed study blocks.
          </p>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 font-bold space-y-1">
            <p>✨ <strong>What makes JSPilot smart?</strong></p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>0 pre-filled dummy subjects for new accounts</li>
              <li>7-Day Free Trial PRO access for all new users</li>
              <li>Custom Multi-Color Themes & Alarm Notifications</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="plan-selector"]',
      title: 'Current Plan Selector 📚',
      subtitle: 'Switch Between Target Exams & Task Plans',
      icon: BookOpen,
      color: 'bg-indigo-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            This dropdown shows your active plan (e.g. <strong>Target Exam Prep</strong> or <strong>General Habits</strong>). Click it at any time to switch active plans or view your plan list.
          </p>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 font-bold">
            💡 You can manage multiple exam schedules and switch between them instantly.
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="create-plan-btn"]',
      title: 'Create Smart Plan Wizard 🪄',
      subtitle: 'Build Targeted Exam Schedules in Seconds',
      icon: Sparkles,
      color: 'bg-purple-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Click <strong>"Create Smart Plan"</strong> to launch the Plan Wizard. Enter your target exam date, study subjects, chapter difficulties, and daily study capacity hours.
          </p>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 font-bold">
            🎯 JSPilot will mathematically calculate study workload allocations to ensure full coverage before exam day.
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="add-task-btn"]',
      title: 'Quick Add Single Tasks ⚡',
      subtitle: 'Inject Custom Tasks & Single Study Blocks',
      icon: Plus,
      color: 'bg-blue-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Need to add a quick habit, assignment, or mock test? Click <strong>"Add Task"</strong> to inject individual study blocks into your schedule.
          </p>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 font-bold">
            ⚡ Injected tasks are automatically calculated into your daily agenda with urgency ratings.
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="plan-controls"]',
      title: 'Plan Management Controls 🛠️',
      subtitle: 'Edit, Pause, or Reset Schedules',
      icon: Zap,
      color: 'bg-pink-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Your plan toolbar lets you manage your active schedule:
          </p>
          <ul className="list-disc list-inside space-y-1 font-bold text-slate-800 dark:text-slate-200">
            <li><strong>Edit Plan:</strong> Change available study hours or add syllabus chapters.</li>
            <li><strong>Pause Plan:</strong> Temporarily freeze timers without losing progress.</li>
            <li><strong>Reset Plan:</strong> Wipe progress and start over from Day 1.</li>
          </ul>
        </div>
      )
    },
    {
      target: '[data-tour="reschedule-btn"]',
      title: 'Automatic Carry-Forward & Rescheduling ⚡',
      subtitle: 'Never Stress Over Missed Study Blocks',
      icon: Zap,
      color: 'bg-pink-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            If you miss a study block or click <strong>"Mark Missed"</strong>, JSPilot's Rescheduler recalculates remaining capacity and redistributes topics cleanly without overloading future days.
          </p>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 text-pink-950 dark:text-pink-200 font-bold">
            ✨ Click <strong>"Reschedule"</strong> anytime to auto-adjust your schedule!
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="exam-countdown"]',
      title: 'Exam Countdown & Phase Pipeline 🔥',
      subtitle: 'Track Exam Days & Strategic Prep Phases',
      icon: Target,
      color: 'bg-amber-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            For target exam plans, this card highlights days remaining to your target exam date and tracks progress across 5 strategic preparation phases (Learning ➔ Practice ➔ Revision ➔ Mock Tests ➔ Final Touch).
          </p>
        </div>
      )
    },
    {
      target: '[data-tour="smart-suggestions"]',
      title: 'Smart AI Suggestions & Insights ✨',
      subtitle: 'Automated Recommendations & Workload Alerts',
      icon: Sparkles,
      color: 'bg-emerald-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            JSPilot continuously analyzes your daily completion rates and suggests optimizations like allocating extra study hours or taking a quick break.
          </p>
        </div>
      )
    },
    {
      target: '[data-tour="priority-engine"]',
      title: 'Intelligent Priority Engine 🎯',
      subtitle: '4-Level Mathematical Priority Weighting',
      icon: Target,
      color: 'bg-red-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Every task is dynamically calculated into 4 priority levels based on deadline proximity, chapter difficulty, and importance:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-black">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300">🔴 Critical</div>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300">🟠 High</div>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300">🟡 Medium</div>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">🟢 Low</div>
          </div>
        </div>
      )
    },
    {
      target: '[data-tour="task-list"]',
      title: 'Daily Task Agenda & Time Alerts ⏰',
      subtitle: 'Custom Time Editing & Notification Alarms',
      icon: Clock,
      color: 'bg-purple-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Your agenda lists today's time-blocked study slots (e.g. <code>09:00 AM – 10:30 AM</code>):
          </p>
          <ul className="list-disc list-inside space-y-1 font-bold text-slate-800 dark:text-slate-200">
            <li>Click <strong>"Customize Time"</strong> to modify start/end times.</li>
            <li>Click <strong>🔔 Bell icon</strong> to trigger notification alarm pops.</li>
            <li>Click <strong>Checkbox</strong> to mark tasks completed with celebration confetti!</li>
          </ul>
        </div>
      )
    },
    {
      target: '[data-tour="profile-theme-btn"]',
      title: 'Multi-Color Themes & User Profile 🎨',
      subtitle: 'Personalize UI Themes & Account Settings',
      icon: Palette,
      color: 'bg-pink-600 text-white',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Customize your JSPilot workspace theme with preset colors: <strong>Light, Dark, Cyberpunk, Ocean Blue, Emerald Green, and Rose Gold</strong>.
          </p>
        </div>
      )
    }
  ];

  const updateTargetRect = () => {
    if (!isOpen) return;
    const step = tutorialSteps[currentStep];
    if (step && step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
        return;
      }
    }
    setTargetRect(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    // Small delay to allow layout animations/DOM mounts to stabilize
    const timer = setTimeout(() => {
      updateTargetRect();
    }, 150);

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, { capture: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, { capture: true });
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate card position near target rect if available
  let tooltipStyle = {};
  let isCentered = true;

  if (targetRect) {
    isCentered = false;
    const padding = 10;
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    let top = targetRect.bottom + padding;
    if (spaceBelow < 280 && spaceAbove > 280) {
      top = Math.max(16, targetRect.top - 380);
    }

    let left = Math.max(16, Math.min(window.innerWidth - 460, targetRect.left));

    tooltipStyle = {
      position: 'fixed',
      top: `${Math.min(window.innerHeight - 400, Math.max(16, top))}px`,
      left: `${left}px`,
      maxWidth: '440px',
      zIndex: 60
    };
  }

  return (
    <div className="fixed inset-0 z-50 animate-fade-in pointer-events-auto">
      
      {/* Dynamic Dark Backdrop Overlay with Cut-Out Spotlight Hole */}
      {targetRect ? (
        <>
          {/* Box Shadow Cutout Mask on Target Element */}
          <div
            className="fixed transition-all duration-300 ease-out pointer-events-none rounded-2xl"
            style={{
              top: `${targetRect.top - 6}px`,
              left: `${targetRect.left - 6}px`,
              width: `${targetRect.width + 12}px`,
              height: `${targetRect.height + 12}px`,
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.78)',
              border: '2px solid #a855f7',
              zIndex: 51
            }}
          >
            {/* Animated Pinpoint Target Indicator Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 shrink-0 whitespace-nowrap animate-bounce">
              <Compass className="w-3 h-3 text-pink-200" />
              <span>🎯 EXACT FEATURE LOCATION</span>
            </div>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50" />
      )}

      {/* Guided Card Tooltip Modal */}
      <div 
        ref={modalRef}
        style={!isCentered ? tooltipStyle : { zIndex: 60 }}
        className={isCentered ? "fixed inset-0 z-50 flex items-center justify-center p-4" : ""}
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-300 dark:border-purple-700 shadow-2xl w-full max-w-md sm:max-w-lg p-6 relative text-slate-900 dark:text-white space-y-5 animate-fade-in backdrop-blur-md">
          
          {/* Step Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Tour Step {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Icon & Title */}
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${step.color} flex items-center justify-center shrink-0 shadow-md`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {step.title}
              </h3>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[120px]">
            {step.content}
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {tutorialSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-purple-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`btn btn-secondary text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 ${
                currentStep === 0 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleNext}
              className="btn btn-primary text-xs font-black py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1.5 shadow-md"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? 'Finish Tour' : 'Next Feature'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
