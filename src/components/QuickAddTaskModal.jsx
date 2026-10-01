import React, { useState } from 'react';
import { X, Plus, Clock, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { formatDateKey } from '../engine/schedulerEngine.js';

export default function QuickAddTaskModal({
  isOpen,
  onClose,
  onAddTask
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Studies');
  const [deadline, setDeadline] = useState(formatDateKey(new Date()));
  const [durationHours, setDurationHours] = useState(1.5);
  const [importance, setImportance] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      deadline,
      estimatedHours: Number(durationHours),
      importance: Number(importance),
      difficulty
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 relative text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Add Task</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inject task into planner schedule</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Task Name */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Java Unit 2 exercises"
              className="form-control"
            />
          </div>

          {/* Category & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                <option value="Studies">Studies</option>
                <option value="Exam Preparation">Exam Preparation</option>
                <option value="Project">Project</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Duration & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Est. Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-control"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard / Complex</option>
              </select>
            </div>
          </div>

          {/* Importance Slider (1-5) */}
          <div className="form-group">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Importance Weight</span>
              <span className="font-extrabold text-purple-700">{importance} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs font-bold">
              <Plus className="w-4 h-4" />
              Add Task & Recalculate
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
