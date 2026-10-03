import React from 'react';
import { X, Lock, Sparkles, ArrowRight, RotateCcw, Calendar, BarChart2, BookOpen } from 'lucide-react';

export default function PremiumFeatureLockModal({
  isOpen,
  featureKey = 'automatic_rescheduling',
  onClose,
  onUpgradeClick,
  onActivateTrial
}) {
  if (!isOpen) return null;

  // Feature specific custom previews
  const previews = {
    automatic_rescheduling: {
      title: '🔒 Automatic Rescheduling',
      subtitle: 'Your plan can automatically adjust when you miss a task.',
      previewComponent: (
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-xs space-y-3 border border-slate-700">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between text-slate-400 font-bold">
            <span>Monday</span>
            <span className="text-red-400">1 Task Missed</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span>✓ Mathematics (Unit 2)</span>
              <span>Done</span>
            </div>
            <div className="flex items-center justify-between text-red-400">
              <span>✕ Physics (Optics)</span>
              <span>Missed</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-purple-300 font-bold">
            <span>Tuesday Smart Rebalance</span>
            <span className="text-[10px] bg-purple-900/80 px-2 py-0.5 rounded text-purple-200">AUTO-MOVED</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center justify-between text-purple-300 font-semibold">
              <span>→ Physics (Optics)</span>
              <span className="text-xs">Carried Forward</span>
            </div>
            <div className="flex items-center justify-between opacity-80">
              <span>✓ Chemistry (Organic)</span>
              <span>Scheduled</span>
            </div>
          </div>
        </div>
      )
    },

    calendar_view: {
      title: '🔒 Interactive Calendar View',
      subtitle: 'Unlock monthly and weekly agenda calendars with visual task indicators.',
      previewComponent: (
        <div className="bg-purple-900 text-white p-4 rounded-2xl text-xs space-y-2">
          <div className="font-bold text-purple-200 flex justify-between">
            <span>October Calendar Grid</span>
            <span>PRO Feature</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-purple-300 pt-1">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px]">
            <div className="p-1 rounded bg-white/10 text-center">12 🔴</div>
            <div className="p-1 rounded bg-white/10 text-center">13 🟠</div>
            <div className="p-1 rounded bg-pink-500/40 text-center font-bold text-white">14 🎯 EXAM</div>
            <div className="p-1 rounded bg-white/10 text-center">15 🟢</div>
            <div className="p-1 rounded bg-white/10 text-center">16 🟡</div>
            <div className="p-1 rounded bg-white/10 text-center">17 🟢</div>
            <div className="p-1 rounded bg-white/10 text-center">18 🔵</div>
          </div>
        </div>
      )
    },

    exam_syllabus_planner: {
      title: '🔒 5-Phase Exam & Syllabus Planner',
      subtitle: 'Convert any exam syllabus into strategic Learning, Practice, Revision & Mock phases.',
      previewComponent: (
        <div className="bg-indigo-950 text-white p-4 rounded-2xl text-xs space-y-2 border border-indigo-800">
          <div className="font-bold text-indigo-300">Phase 1 to Phase 5 Pipeline</div>
          <div className="space-y-1 text-[11px]">
            <div className="p-1.5 rounded bg-indigo-900/60 border border-indigo-700">1. Core Syllabus Learning (55% time)</div>
            <div className="p-1.5 rounded bg-indigo-900/60 border border-indigo-700">2. Past Papers & Practice (15% time)</div>
            <div className="p-1.5 rounded bg-indigo-900/60 border border-indigo-700">3. Active Spaced Revision (15% time)</div>
            <div className="p-1.5 rounded bg-pink-900/60 border border-pink-700 font-bold">4. Simulated Mock Tests (10% time)</div>
          </div>
        </div>
      )
    },

    default: {
      title: '🔒 Premium Feature Locked',
      subtitle: 'This feature is available with Smart Planner Pro.',
      previewComponent: (
        <div className="bg-purple-50 p-4 rounded-2xl text-xs text-purple-900 space-y-2 border border-purple-100">
          <p className="font-bold">Upgrade to Smart Planner Pro to unlock:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Unlimited active plans</li>
            <li>Automatic priority calculation engine</li>
            <li>Automatic rescheduling & recovery</li>
            <li>Advanced analytics & deadline alerts</li>
          </ul>
        </div>
      )
    }
  };

  const featureInfo = previews[featureKey] || previews.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative space-y-5">
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>

        {/* Lock Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">{featureInfo.title}</h3>
            <p className="text-xs text-slate-500">{featureInfo.subtitle}</p>
          </div>
        </div>

        {/* Interactive Feature Preview */}
        {featureInfo.previewComponent}

        {/* Value Pitch */}
        <p className="text-xs font-semibold text-slate-700 text-center">
          Let Smart Planner handle your scheduling and missed tasks automatically.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          {onActivateTrial && (
            <button
              onClick={() => {
                onClose();
                onActivateTrial();
              }}
              className="w-full btn btn-primary text-xs font-black py-3 shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>🚀 Activate 7-Day Free Trial ($0.00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onUpgradeClick();
            }}
            className="w-full btn btn-secondary text-xs font-extrabold py-2.5 flex items-center justify-center gap-2"
          >
            <span>View All Pro Plans & Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button onClick={onClose} className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 py-1">
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}
