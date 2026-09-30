import React, { useState } from 'react';
import { Sparkles, Quote, RefreshCw, Flame, Heart } from 'lucide-react';
import { getDailyQuote, getRandomQuote } from '../config/motivationalQuotes.js';

export default function MotivationalQuoteBanner({ selectedDate }) {
  const [activeQuote, setActiveQuote] = useState(() => getDailyQuote(selectedDate));
  const [isLiked, setIsLiked] = useState(false);

  const handleNextThought = () => {
    setActiveQuote(getRandomQuote());
    setIsLiked(false);
  };

  return (
    <div className="p-4 sm:p-5 mb-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg border-2 border-purple-500/40 relative overflow-hidden transition-all animate-fade-in">
      {/* Background Ambient Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Section: Quote Text & Category Badge */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-pink-500/30 text-pink-200 border border-pink-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-300" />
              <span>DAILY MOTIVATION THOUGHT</span>
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Quote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 rotate-180" />
            <p className="text-sm sm:text-base font-black tracking-tight leading-snug text-purple-50">
              "{activeQuote.quote}"
            </p>
          </div>

          <p className="text-xs font-bold text-pink-300 pl-7">
            — {activeQuote.author}
          </p>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-2xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
              isLiked 
                ? 'bg-pink-600 border-pink-500 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title="Inspiring Thought"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-pink-300'}`} />
            <span className="hidden md:inline">{isLiked ? 'Inspired!' : 'Inspire'}</span>
          </button>

          <button
            onClick={handleNextThought}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black border border-purple-400/40 shadow-md flex items-center gap-1.5 transition-all"
            title="Load Another Motivational Thought"
          >
            <RefreshCw className="w-4 h-4 text-purple-200" />
            <span>New Thought 🎲</span>
          </button>
        </div>

      </div>
    </div>
  );
}
