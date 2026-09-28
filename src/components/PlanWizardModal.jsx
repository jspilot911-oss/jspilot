import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GraduationCap, 
  CheckSquare, 
  FolderKanban, 
  User, 
  ListCheck, 
  Sliders,
  HelpCircle,
  Info
} from 'lucide-react';
import { formatDateKey } from '../engine/schedulerEngine.js';

export default function PlanWizardModal({
  isOpen,
  onClose,
  onSavePlan,
  initialData = null
}) {
  const [type, setType] = useState(initialData?.type || 'exam');
  const [title, setTitle] = useState(initialData?.title || '');
  const [examCategory, setExamCategory] = useState(initialData?.examCategory || '');
  const [customExamName, setCustomExamName] = useState(initialData?.customExamName || '');
  const [examLevel, setExamLevel] = useState(initialData?.examLevel || '');
  
  const defaultTargetDate = () => {
    return formatDateKey(new Date());
  };

  const [targetDate, setTargetDate] = useState(initialData?.targetDate || defaultTargetDate());
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState(initialData?.availableHoursPerDay || 4);
  const [preferredTimings, setPreferredTimings] = useState(initialData?.preferredTimings || 'morning_evening');
  const [weeklyDays, setWeeklyDays] = useState(initialData?.weeklyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [includePractice, setIncludePractice] = useState(initialData?.includePractice ?? true);
  const [includeMockTests, setIncludeMockTests] = useState(initialData?.includeMockTests ?? true);

  // Exam Subjects & Syllabus State
  const [subjects, setSubjects] = useState(initialData?.subjects || []);

  // General Tasks State
  const [generalTasks, setGeneralTasks] = useState(initialData?.generalTasks || []);

  if (!isOpen) return null;

  // Handle Weekly Day Toggle
  const toggleDay = (dayStr) => {
    if (weeklyDays.includes(dayStr)) {
      if (weeklyDays.length > 1) setWeeklyDays(weeklyDays.filter(d => d !== dayStr));
    } else {
      setWeeklyDays([...weeklyDays, dayStr]);
    }
  };

  // Subject Controls
  const addSubject = () => {
    const newSubj = {
      id: `subj_${Date.now()}`,
      name: 'New Subject',
      importance: 3,
      chapters: [
        { id: `chap_${Date.now()}`, name: 'Unit 1: Overview', difficulty: 'medium', estimatedHours: 2, completionPercentage: 0 }
      ]
    };
    setSubjects([...subjects, newSubj]);
  };

  const deleteSubject = (subjId) => {
    setSubjects(subjects.filter(s => s.id !== subjId));
  };

  const updateSubjectName = (subjId, name) => {
    setSubjects(subjects.map(s => s.id === subjId ? { ...s, name } : s));
  };

  const addChapter = (subjId) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjId) {
        return {
          ...s,
          chapters: [
            ...s.chapters,
            { id: `chap_${Date.now()}`, name: `Unit ${s.chapters.length + 1}`, difficulty: 'medium', estimatedHours: 2, completionPercentage: 0 }
          ]
        };
      }
      return s;
    }));
  };

  const updateChapter = (subjId, chapId, field, value) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjId) {
        return {
          ...s,
          chapters: s.chapters.map(c => c.id === chapId ? { ...c, [field]: value } : c)
        };
      }
      return s;
    }));
  };

  const deleteChapter = (subjId, chapId) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjId) {
        return { ...s, chapters: s.chapters.filter(c => c.id !== chapId) };
      }
      return s;
    }));
  };

  // Move Subject Up/Down for reordering (Requirement 1)
  const moveSubject = (index, direction) => {
    const newSubjects = [...subjects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSubjects.length) return;
    const temp = newSubjects[index];
    newSubjects[index] = newSubjects[targetIndex];
    newSubjects[targetIndex] = temp;
    setSubjects(newSubjects);
  };

  // General Task Controls
  const addGeneralTask = () => {
    setGeneralTasks([
      ...generalTasks,
      { id: `gt_${Date.now()}`, title: 'New Task', category: 'General', deadline: targetDate, estimatedHours: 1.5, importance: 3, difficulty: 'medium', completionPercentage: 0 }
    ]);
  };

  const updateGeneralTask = (id, field, value) => {
    setGeneralTasks(generalTasks.map(gt => gt.id === id ? { ...gt, [field]: value } : gt));
  };

  const deleteGeneralTask = (id) => {
    setGeneralTasks(generalTasks.filter(gt => gt.id !== id));
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const resolvedExamName = examCategory === 'Other'
      ? (customExamName.trim() || 'Custom Exam')
      : (examLevel.trim() ? `${examCategory} ${examLevel.trim()}` : examCategory);

    const planTitle = title.trim() || (type === 'exam' ? `${resolvedExamName} Plan` : 'My JSPilot Plan');

    const planPayload = {
      id: initialData?.id || `plan_${Date.now()}`,
      title: planTitle,
      type,
      examCategory,
      customExamName,
      examLevel,
      examName: type === 'exam' ? resolvedExamName : title,
      targetDate,
      availableHoursPerDay: Number(availableHoursPerDay),
      preferredTimings,
      weeklyDays,
      includePractice,
      includeMockTests,
      subjects: (type === 'exam' || type === 'study') ? subjects : [],
      generalTasks: (type !== 'exam' && type !== 'study') ? generalTasks : []
    };

    onSavePlan(planPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-auto p-6 sm:p-8 relative max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {initialData ? 'Edit Smart Plan' : 'Create Smart Plan'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters for automatic planner generation</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6">
          
          {/* Step 1: Select Planning Type (Requirement 1) */}
          <div>
            <label className="form-label mb-2">1. Select Planning Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'exam', label: 'Exam Preparation', icon: GraduationCap, desc: 'CA, UPSC, NEET, JEE, College' },
                { id: 'study', label: 'Study Plan', icon: BookOpen, desc: 'Course syllabus & books' },
                { id: 'project', label: 'Project Planner', icon: FolderKanban, desc: 'Deliverables & sprints' },
                { id: 'personal', label: 'Personal Tasks', icon: User, desc: 'Habits & goals' },
                { id: 'todo', label: 'General To-Do', icon: ListCheck, desc: 'Tasks & deadlines' },
                { id: 'custom', label: 'Custom Planner', icon: Sliders, desc: 'Tailored schedule' }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-400/20'
                        : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-purple-700' : 'text-slate-400'}`} />
                    <div className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {type === 'exam' ? (
              <div className="space-y-3 col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-group mb-0">
                    <label className="form-label text-slate-800 dark:text-slate-200">Exam Category</label>
                    <select
                      required
                      value={examCategory}
                      onChange={(e) => setExamCategory(e.target.value)}
                      className="form-control"
                    >
                      <option value="" disabled>-- Select Exam Category --</option>
                      <option value="CA">CA (Chartered Accountancy)</option>
                      <option value="CS">CS (Company Secretary)</option>
                      <option value="CMA">CMA (Cost & Management Accountant)</option>
                      <option value="SSC">SSC (Staff Selection Commission)</option>
                      <option value="UPSC">UPSC (Civil Services)</option>
                      <option value="JEE">JEE (Engineering Entrance)</option>
                      <option value="NEET">NEET (Medical Entrance)</option>
                      <option value="Other">Other (Type Custom Exam)</option>
                    </select>
                  </div>

                  {examCategory === 'Other' ? (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-800 dark:text-slate-200">Custom Exam Name</label>
                      <input
                        type="text"
                        required
                        value={customExamName}
                        onChange={(e) => setCustomExamName(e.target.value)}
                        placeholder="e.g. Banking PO, State PSC, GATE"
                        className="form-control"
                      />
                    </div>
                  ) : (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-800 dark:text-slate-200">Exam Level / Stage</label>
                      <input
                        type="text"
                        value={examLevel}
                        onChange={(e) => setExamLevel(e.target.value)}
                        placeholder="e.g. Intermediate, Final, Prelims, Mains, Tier 1, 12th"
                        className="form-control"
                      />
                    </div>
                  )}
                </div>

                {examCategory === 'Other' && (
                  <div className="form-group mb-0">
                    <label className="form-label text-slate-800 dark:text-slate-200">Exam Level / Stage</label>
                    <input
                      type="text"
                      value={examLevel}
                      onChange={(e) => setExamLevel(e.target.value)}
                      placeholder="e.g. Intermediate, Final, Prelims, Mains, Tier 1, 12th"
                      className="form-control"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Plan Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Web Development Launch"
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Target / Exam Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Time & Capacity Constraints */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Study Capacity & Timings Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Available Hours / Day</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="14"
                  required
                  value={availableHoursPerDay}
                  onChange={(e) => setAvailableHoursPerDay(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Study Timings</label>
                <select
                  value={preferredTimings}
                  onChange={(e) => setPreferredTimings(e.target.value)}
                  className="form-control"
                >
                  <option value="morning">Morning Focus (8 AM – 1 PM)</option>
                  <option value="afternoon">Afternoon Focus (1 PM – 6 PM)</option>
                  <option value="evening">Evening / Night Focus (6 PM – 11 PM)</option>
                  <option value="morning_evening">Split (Morning & Evening Slots)</option>
                </select>
              </div>
            </div>

            {/* Weekly Days Checkboxes */}
            <div>
              <label className="form-label mb-1.5">Weekly Available Days</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isChecked = weeklyDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isChecked
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Practice & Mock Test Options for Exam Planner */}
            {type === 'exam' && (
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-purple-100/60">
                <label className="flex items-center gap-2 text-xs font-semibold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePractice}
                    onChange={(e) => setIncludePractice(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span>Include Question Practice Phase</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMockTests}
                    onChange={(e) => setIncludeMockTests(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span>Schedule Full Mock Tests</span>
                </label>
              </div>
            )}
          </div>

          {/* Step 3: Syllabus & Subjects Builder (for Exam / Study) */}
          {(type === 'exam' || type === 'study') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subjects & Syllabus Chapters
                </h3>
                <button
                  type="button"
                  onClick={addSubject}
                  className="btn btn-secondary text-xs font-bold text-purple-600 dark:text-purple-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Subject
                </button>
              </div>

              {/* Hints & Guidance Banner */}
              <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 text-xs font-medium flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-purple-950 dark:text-purple-100 text-xs">💡 Quick Guide: What should you type here?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                    <div>
                      <span className="font-bold text-purple-700 dark:text-purple-300">1. Chapter / Topic Name:</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">e.g. <em>Unit 1: Financial Statements</em> or <em>Ch 4: Integration</em></p>
                    </div>
                    <div>
                      <span className="font-bold text-purple-700 dark:text-purple-300">2. Difficulty Level:</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400"><em>Easy, Medium, or Hard</em> (Harder topics scheduled with higher priority)</p>
                    </div>
                    <div>
                      <span className="font-bold text-purple-700 dark:text-purple-300">3. Est. Study Hours:</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Estimated total hours needed (e.g. <em>2.5, 4, 6 hours</em>)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {subjects.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/80 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No subjects added yet.</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Click below to add a subject and syllabus chapters when ready!</p>
                    <button
                      type="button"
                      onClick={addSubject}
                      className="btn btn-secondary text-xs font-bold text-purple-600 dark:text-purple-400 inline-flex items-center gap-1.5 mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Subject</span>
                    </button>
                  </div>
                ) : (
                  subjects.map((subj, subjIdx) => (
                    <div key={subj.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-xs space-y-3">
                      
                      {/* Subject Header with Reordering controls */}
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Subject Title
                        </label>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={subj.name}
                              onChange={(e) => updateSubjectName(subj.id, e.target.value)}
                              className="form-control font-bold text-sm"
                              placeholder="e.g. Advanced Accounting / Organic Chemistry"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveSubject(subjIdx, 'up')}
                              disabled={subjIdx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                              title="Move Subject Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSubject(subjIdx, 'down')}
                              disabled={subjIdx === subjects.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                              title="Move Subject Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSubject(subj.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Chapters List */}
                      <div className="space-y-2">
                        {/* Explicit Column Header Labels with Hints */}
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pt-1">
                          <div className="col-span-5 flex items-center gap-1">
                            <span>Chapter / Topic Title</span>
                          </div>
                          <div className="col-span-3">Difficulty Level</div>
                          <div className="col-span-3">Est. Study Hours</div>
                          <div className="col-span-1 text-right">Delete</div>
                        </div>

                        {subj.chapters.map((chap) => (
                          <div key={chap.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={chap.name}
                                onChange={(e) => updateChapter(subj.id, chap.id, 'name', e.target.value)}
                                className="form-control text-xs font-semibold"
                                placeholder="e.g. Unit 1: Financial Statements"
                              />
                            </div>

                            <div className="col-span-3">
                              <select
                                value={chap.difficulty}
                                onChange={(e) => updateChapter(subj.id, chap.id, 'difficulty', e.target.value)}
                                className="form-control text-xs"
                              >
                                <option value="easy">Easy (Fast revision)</option>
                                <option value="medium">Medium (Standard)</option>
                                <option value="hard">Hard (High priority)</option>
                              </select>
                            </div>

                            <div className="col-span-3">
                              <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                value={chap.estimatedHours}
                                onChange={(e) => updateChapter(subj.id, chap.id, 'estimatedHours', Number(e.target.value))}
                                className="form-control text-xs"
                                placeholder="e.g. 4.5 hrs"
                              />
                            </div>

                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => deleteChapter(subj.id, chap.id)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Delete Chapter"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addChapter(subj.id)}
                          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 flex items-center gap-1 pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Chapter / Unit
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* General Tasks Builder (for Non-Exam) */}
          {type !== 'exam' && type !== 'study' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Tasks List
                </h3>
                <button
                  type="button"
                  onClick={addGeneralTask}
                  className="btn btn-secondary text-xs font-bold text-purple-600 dark:text-purple-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </button>
              </div>

              {/* Hints & Guidance Banner */}
              <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 text-xs font-medium flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-purple-950 dark:text-purple-100 text-xs">💡 Quick Guide: Tasks & Work Items</p>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    Add project deliverables or habits. Specify <strong>Task Title</strong> (e.g. <em>Complete Web Report</em>), <strong>Difficulty</strong> (<em>Easy/Medium/Hard</em>), and <strong>Est. Hours</strong> (e.g. <em>2.5 hrs</em>).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {generalTasks.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/80 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No tasks added yet.</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Click below to add a work item or task.</p>
                    <button
                      type="button"
                      onClick={addGeneralTask}
                      className="btn btn-secondary text-xs font-bold text-purple-600 dark:text-purple-400 inline-flex items-center gap-1.5 mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pt-1">
                      <div className="col-span-5">Task Title / Action</div>
                      <div className="col-span-3">Difficulty</div>
                      <div className="col-span-3">Est. Hours</div>
                      <div className="col-span-1 text-right">Delete</div>
                    </div>

                    {generalTasks.map((gt) => (
                      <div key={gt.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={gt.title}
                            onChange={(e) => updateGeneralTask(gt.id, 'title', e.target.value)}
                            className="form-control text-xs font-bold"
                            placeholder="e.g. Complete Lab Report"
                          />
                        </div>
                        <div className="col-span-3">
                          <select
                            value={gt.difficulty}
                            onChange={(e) => updateGeneralTask(gt.id, 'difficulty', e.target.value)}
                            className="form-control text-xs"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            value={gt.estimatedHours}
                            onChange={(e) => updateGeneralTask(gt.id, 'estimatedHours', Number(e.target.value))}
                            className="form-control text-xs"
                            placeholder="e.g. 2.5 hrs"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => deleteGeneralTask(gt.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          </div>

          {/* Form Footer Buttons */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs font-bold px-6 py-2.5 shadow-md">
              <Sparkles className="w-4 h-4" />
              Generate Smart Plan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
