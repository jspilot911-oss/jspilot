import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, ClockAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { generateSmartSuggestions } from '../engine/smartSuggestionsEngine.js';

export default function SmartSuggestionsBanner({
  plan,
  selectedDate,
  onApplyAction
}) {
  const suggestions = generateSmartSuggestions(plan, selectedDate);

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div data-tour="smart-suggestions" className="space-y-3 mb-6">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span>Smart Suggestions & Insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((sug) => {
          return (
            <div
              key={sug.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                sug.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : sug.type === 'warning'
                    ? 'bg-pink-50 border-pink-200 text-pink-950'
                    : sug.type === 'reschedule'
                      ? 'bg-purple-50 border-purple-200 text-purple-950'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl text-white shrink-0 shadow-xs ${
                  sug.type === 'success' ? 'bg-emerald-600' :
                  sug.type === 'warning' ? 'bg-pink-600' :
                  sug.type === 'reschedule' ? 'bg-purple-700' : 'bg-indigo-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold tracking-tight text-slate-900">{sug.title}</h4>
                  <p className="text-xs mt-1 font-medium leading-relaxed text-slate-700">{sug.description}</p>
                </div>
              </div>

              {sug.actionLabel && (
                <button
                  onClick={() => onApplyAction(sug.actionType)}
                  className={`self-end inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    sug.type === 'success' ? 'bg-emerald-700 text-white hover:bg-emerald-800' :
                    sug.type === 'warning' ? 'bg-pink-700 text-white hover:bg-pink-800' :
                    sug.type === 'reschedule' ? 'bg-purple-700 text-white hover:bg-purple-800' : 'bg-indigo-700 text-white hover:bg-indigo-800'
                  }`}
                >
                  <span>{sug.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
