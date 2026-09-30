import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskPomodoroModal({
  isOpen,
  onClose,
  slot,
  onCompleteTask,
  onTriggerNotificationPop
}) {
  // Timer Mode: 'focus' (25m) | 'short_break' (5m) | 'long_break' (15m)
  const [mode, setMode] = useState('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Track modal expanded view vs bottom-right corner widget view
  const [isMinimized, setIsMinimized] = useState(false);

  const timerRef = useRef(null);

  // Initialize or reset timer when slot changes
  useEffect(() => {
    if (slot) {
      let mins = 25;
      if (mode === 'short_break') mins = 5;
      if (mode === 'long_break') mins = 15;
      setDurationMinutes(mins);
      setTimeLeft(mins * 60);
      setIsRunning(false);
      setIsMinimized(false);
    }
  }, [slot?.id]);

  // Main background countdown timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  if (!slot) return null;

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.error('Audio play failed:', e);
      }
    }

    if (mode === 'focus') {
      const nextSessions = completedSessions + 1;
      setCompletedSessions(nextSessions);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onTriggerNotificationPop) {
        onTriggerNotificationPop(`🍅 POMODORO FINISHED! Great focus on "${slot.title}". Take a break!`);
      }

      // Automatically offer break
      if (nextSessions % 4 === 0) {
        setMode('long_break');
        setDurationMinutes(15);
        setTimeLeft(15 * 60);
      } else {
        setMode('short_break');
        setDurationMinutes(5);
        setTimeLeft(5 * 60);
      }
    } else {
      if (onTriggerNotificationPop) {
        onTriggerNotificationPop(`☕ Break finished! Ready to resume focus on "${slot.title}"?`);
      }
      setMode('focus');
      setDurationMinutes(25);
      setTimeLeft(25 * 60);
    }
  };

  const toggleStartPause = (e) => {
    if (e) e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  const handleSelectMode = (newMode, minutes) => {
    setIsRunning(false);
    setMode(newMode);
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  // Format MM:SS display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Progress Percentage calculation
  const totalSeconds = durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100) : 0;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  const handleCloseAll = (e) => {
    if (e) e.stopPropagation();
    setIsRunning(false);
    setIsMinimized(false);
    if (onClose) onClose(true);
  };

  // Render Option 1: Bottom-Right Corner Floating Mini Pomodoro Widget (Runs in background)
  if (isMinimized && slot) {
    return (
      <div 
        onClick={() => {
          setIsMinimized(false);
          window.dispatchEvent(new CustomEvent('reopen_pomodoro'));
        }}
        className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-50 bg-slate-950/95 text-white backdrop-blur-md rounded-2xl border-2 border-purple-500 shadow-2xl p-3 px-4 flex items-center gap-3.5 cursor-pointer hover:border-pink-400 transition-all group animate-fade-in"
        title="Click to expand Pomodoro Timer"
      >
        {/* Pulsing Flame Icon */}
        <div className="relative flex items-center justify-center">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            mode === 'focus' ? 'bg-pink-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <Flame className={`w-5 h-5 ${isRunning ? 'animate-bounce' : ''}`} />
          </div>
          {isRunning && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-400 animate-ping" />
          )}
        </div>

        {/* Live Timer Countdown & Task Name */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-black tracking-tight text-purple-300">
              {formattedTime}
            </span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-md ${
              mode === 'focus' ? 'bg-purple-900 text-purple-200' : 'bg-emerald-900 text-emerald-200'
            }`}>
              {isRunning ? (mode === 'focus' ? 'FOCUS' : 'REST') : 'PAUSED'}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-300 truncate max-w-[140px] sm:max-w-[180px]">
            {slot.title}
          </span>
        </div>

        {/* Mini Quick Actions */}
        <div className="flex items-center gap-1.5 ml-1">
          {/* Quick Play/Pause */}
          <button
            onClick={toggleStartPause}
            className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white transition-colors"
            title={isRunning ? 'Pause Timer' : 'Start Focus'}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
              window.dispatchEvent(new CustomEvent('reopen_pomodoro'));
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Expand Full Pomodoro Clock"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Terminate & Close Timer */}
          <button
            onClick={handleCloseAll}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
            title="Close Pomodoro Timer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!isOpen || !slot) return null;

  // Render Option 2: Full Centered Pomodoro Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-300 dark:border-purple-800 shadow-2xl w-full max-w-md p-6 relative text-slate-900 dark:text-white space-y-5 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-colors ${
          mode === 'focus' ? 'bg-pink-500/20' : mode === 'short_break' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
        }`} />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center shadow-xs">
              <Flame className="w-4.5 h-4.5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Task Pomodoro Clock</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Focus Timer & Break Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Chime Sound Mute/Unmute */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={soundEnabled ? 'Mute Chime Sound' : 'Enable Chime Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Minimize to Corner Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/60"
              title="Minimize to Right Corner (Clock keeps running in background)"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close / Terminate Pomodoro */}
            <button
              onClick={handleCloseAll}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Close Pomodoro Timer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Task Details Badge */}
        <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 relative z-10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.2 rounded-md">
                {slot.subjectName || 'General'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Est: {slot.durationHours || 1.5} hrs</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
              {slot.title}
            </h4>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-extrabold text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-950/80 px-2.5 py-1 rounded-xl border border-pink-200 dark:border-pink-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-pink-600" />
              <span>{completedSessions} Pomodoros</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl relative z-10 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => handleSelectMode('focus', 25)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'focus'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>25m Focus</span>
          </button>

          <button
            onClick={() => handleSelectMode('short_break', 5)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>5m Break</span>
          </button>

          <button
            onClick={() => handleSelectMode('long_break', 15)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'long_break'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>15m Rest</span>
          </button>
        </div>

        {/* Circular Countdown Display */}
        <div className="flex flex-col items-center justify-center py-2 relative z-10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className={`transition-all duration-1000 ease-linear ${
                  mode === 'focus' ? 'stroke-purple-600 dark:stroke-purple-400' :
                  mode === 'short_break' ? 'stroke-emerald-500' : 'stroke-blue-500'
                }`}
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Time Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white font-mono">
                {formattedTime}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${
                mode === 'focus' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                mode === 'short_break' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              }`}>
                {isRunning ? (mode === 'focus' ? 'Focusing...' : 'Resting...') : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 relative z-10">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            title="Reset Countdown"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleStartPause}
            className={`py-3.5 px-8 rounded-2xl font-black text-sm text-white shadow-xl flex items-center gap-2 transition-all transform active:scale-95 ${
              isRunning 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleTimerComplete}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Task Complete & Minimize Hints */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 relative z-10">
          <button
            onClick={() => {
              if (onCompleteTask) onCompleteTask(slot.id);
              if (onClose) onClose();
            }}
            className="w-full btn bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 py-2.5 text-xs font-black flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mark Task Completed & Finish</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 font-bold">
            💡 <strong>Tip:</strong> Click <Minimize2 className="w-3 h-3 inline text-purple-500" /> to run the clock in the bottom-right corner while using the app!
          </p>
        </div>

      </div>
    </div>
  );
}
