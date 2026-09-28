import React from 'react';
import { 
  Brain, 
  Target, 
  RotateCcw, 
  BarChart3, 
  GraduationCap, 
  FolderKanban, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export default function UnlockSmartPlanningPage({
  onGoToPricing,
  onBackToDashboard
}) {
  const benefitCards = [
    {
      icon: Brain,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      title: '🧠 Smart Planning',
      desc: 'Automatically create a personalized plan from your goals, deadlines, and available study hours per day.'
    },
    {
      icon: Target,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: '🎯 Priority Engine',
      desc: 'Automatically identify which tasks need attention first using real mathematical urgency weights.'
    },
    {
      icon: RotateCcw,
      color: 'bg-pink-50 text-pink-600 border-pink-100',
      title: '🔄 Automatic Rescheduling',
      desc: 'Missed a task? The planner automatically recalculates your upcoming schedule without overloading daily hours.'
    },
    {
      icon: BarChart3,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: '📊 Progress Intelligence',
      desc: 'Understand whether you are on track or falling behind with subject mastery and study hour logs.'
    },
    {
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      title: '📚 Exam Planning',
      desc: 'Convert your syllabus and exam date into a complete 5-phase preparation timetable (Learning, Practice, Revision, Mocks).'
    },
    {
      icon: FolderKanban,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      title: '📅 Multiple Plans',
      desc: 'Manage CA, UPSC, JEE, University exams, coding projects, and personal to-do lists together in one dashboard.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 animate-fade-in">
      
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={onBackToDashboard}
          className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Freemium Smart Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Unlock JSPilot
        </h1>

        <p className="text-base sm:text-xl font-bold text-purple-700">
          Tell JSPilot what you need to finish. It builds the plan for you.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          The engine calculates priorities, generates daily study blocks, and automatically rebalances your schedule when life happens.
        </p>
      </div>

      {/* 6 Benefit Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {benefitCards.map((b, idx) => {
          const IconComp = b.icon;
          return (
            <div
              key={idx}
              className="card p-6 bg-white border border-slate-200 shadow-sm rounded-3xl hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${b.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{b.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Bottom Banner */}
      <div className="max-w-3xl mx-auto card p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl shadow-xl text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Ready to automate your preparation?</h2>
        <p className="text-xs text-purple-200">
          Join thousands of students and professionals managing their goals with JSPilot Pro.
        </p>
        <button
          onClick={onGoToPricing}
          className="btn btn-primary bg-white text-purple-900 hover:bg-purple-50 text-xs sm:text-sm font-extrabold px-8 py-3 shadow-lg inline-flex items-center gap-2"
        >
          <span>Explore Pricing & Plans</span>
          <ArrowRight className="w-4 h-4 text-purple-700" />
        </button>
      </div>

    </div>
  );
}
