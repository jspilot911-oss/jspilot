import React from 'react';
import { X, Bell, Zap, Info, CheckCircle2, Clock } from 'lucide-react';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications = [],
  onClearNotifs
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between text-slate-900 dark:text-slate-100">
        
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Alerts & Logs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic rescheduling notifications</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">No recent alerts</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                      Smart Rescheduler
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        {notifications.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onClearNotifs}
              className="w-full btn btn-secondary text-xs font-semibold"
            >
              Clear All Notifications
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
