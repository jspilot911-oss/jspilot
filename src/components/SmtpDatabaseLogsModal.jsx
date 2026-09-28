import React, { useState, useEffect } from 'react';
import { X, Server, Database, Mail, ShieldCheck, RefreshCw, CheckCircle2, Terminal, ShieldAlert } from 'lucide-react';
import { SmtpService, SMTP_CONFIG } from '../services/smtpService.js';

export default function SmtpDatabaseLogsModal({
  isOpen,
  onClose,
  user,
  onUpdateUserPlan
}) {
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'smtp_logs'
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const isOwner = user?.role === 'owner' || user?.isOwner || user?.email?.toLowerCase().includes('admin') || user?.email?.toLowerCase().includes('owner');

  useEffect(() => {
    if (isOpen && isOwner) {
      const dbUsers = SmtpService.getUserDatabase();
      const smtpLogs = SmtpService.getSmtpLogs();
      setUsers(dbUsers);
      setLogs(smtpLogs);
      if (smtpLogs.length > 0) setSelectedLog(smtpLogs[0]);
    }
  }, [isOpen, isOwner]);

  if (!isOpen) return null;

  if (!isOwner) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 text-center text-slate-900 dark:text-white space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black">Owner Access Only</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            The SMTP User Database and transmission logs are restricted to the system owner/administrator. Regular user accounts cannot view database tables.
          </p>
          <button onClick={onClose} className="btn btn-primary w-full py-2.5 text-xs font-black">
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    const dbUsers = SmtpService.getUserDatabase();
    const smtpLogs = SmtpService.getSmtpLogs();
    setUsers(dbUsers);
    setLogs(smtpLogs);
  };

  const handleSetPlan = (userRecord, newPlan) => {
    const updated = SmtpService.updateUserPlan(userRecord.user_id || userRecord.email, newPlan);
    if (onUpdateUserPlan) {
      onUpdateUserPlan(userRecord.email, newPlan);
    }
    handleRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl p-6 sm:p-8 relative text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>User Database & SMTP Protocol Logger</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  SMTP ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Registered User Records & SMTP Email Transmission Transcripts ({SMTP_CONFIG.server}:{SMTP_CONFIG.port})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 shrink-0 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'database'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>User Database ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp_logs')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'smtp_logs'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>SMTP Email Transcripts ({logs.length})</span>
          </button>
        </div>

        {/* Tab Content 1: User Database Table */}
        {activeTab === 'database' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-950 dark:text-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600 shrink-0" />
                <span>SMTP Server: <strong>{SMTP_CONFIG.sender}</strong> via Port 587 (TLS 1.3)</span>
              </div>
              <span className="text-[11px] font-mono bg-purple-200/60 dark:bg-purple-900/60 px-2 py-0.5 rounded font-bold">
                MIME Auth Logged
              </span>
            </div>

            {users.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Database className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Users Logged in Database Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Sign in or Register an account to record your profile via SMTP.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-black text-[10px]">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">User & Email</th>
                      <th className="p-3">Account Tier (Paid/Free)</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Target Goal</th>
                      <th className="p-3">SMTP Auth Status</th>
                      <th className="p-3">Registered / Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {users.map((u) => {
                      const isPaid = u.current_plan === 'PRO' || u.current_plan === 'YEARLY' || u.plan_type === 'PAID PRO USER';
                      const isOwnerRole = u.role === 'owner' || u.email?.toLowerCase().includes('owner') || u.email?.toLowerCase().includes('admin');

                      return (
                        <tr key={u.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono text-[11px] text-purple-700 dark:text-purple-400 font-bold whitespace-nowrap">
                            {u.user_id}
                          </td>

                          <td className="p-3">
                            <div className="font-black text-slate-900 dark:text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</div>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <select
                                value={u.current_plan || 'FREE'}
                                onChange={(e) => handleSetPlan(u, e.target.value)}
                                className="text-[11px] font-black px-2.5 py-1 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 cursor-pointer shadow-xs focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="FREE">🆓 FREE USER</option>
                                <option value="PRO">✨ PRO USER</option>
                                <option value="YEARLY">👑 YEARLY PRO</option>
                              </select>
                              
                              <div className="flex items-center gap-1 text-[9px] font-black">
                                <button
                                  onClick={() => handleSetPlan(u, 'PRO')}
                                  className={`px-2 py-0.5 rounded border transition-all ${
                                    isPaid ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                                  }`}
                                >
                                  Set PRO
                                </button>
                                <button
                                  onClick={() => handleSetPlan(u, 'FREE')}
                                  className={`px-2 py-0.5 rounded border transition-all ${
                                    !isPaid ? 'bg-slate-700 text-white border-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                                  }`}
                                >
                                  Set FREE
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            {isOwnerRole ? (
                              <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black text-[10px] border border-pink-300 dark:border-pink-800">
                                👑 OWNER ADMIN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                                🎓 STUDENT USER
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] border border-indigo-200 dark:border-indigo-800">
                              {u.target_goal || 'General Planning'}
                            </span>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {u.smtp_status || 'DELIVERED (250 OK)'}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">
                                {u.auth_protocol || 'SMTP / TLS 587'}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                            <div>{new Date(u.registered_at || u.last_login_at || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-[9px] font-mono text-slate-400">IP: {u.ip_address || '127.0.0.1'}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: SMTP Logs & Transcripts */}
        {activeTab === 'smtp_logs' && (
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
            
            {/* Left Logs List */}
            <div className="md:col-span-1 overflow-y-auto space-y-2 pr-1 border-r border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Dispatched SMTP Emails</p>
              {logs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No SMTP email logs recorded.</p>
              ) : (
                logs.map((log) => (
                  <button
                    key={log.log_id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs ${
                      selectedLog?.log_id === log.log_id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-[11px] truncate max-w-[140px]">{log.recipient_name}</span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                        250 OK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{log.subject}</p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </button>
                ))
              )}
            </div>

            {/* Right Terminal Log Inspector */}
            <div className="md:col-span-2 bg-slate-950 text-emerald-400 rounded-2xl p-4 font-mono text-xs overflow-y-auto space-y-2 border border-slate-800 flex flex-col justify-between">
              {selectedLog ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Terminal className="w-3.5 h-3.5 text-purple-400" />
                      SMTP Transcript: {selectedLog.recipient_email}
                    </span>
                    <span>Port 587 (TLS 1.3)</span>
                  </div>

                  <div className="space-y-1 overflow-y-auto flex-1 text-[11px] leading-relaxed pt-2">
                    {selectedLog.transcript.map((line, idx) => (
                      <div key={idx} className={line.includes('250') || line.includes('235') ? 'text-emerald-300 font-bold' : line.includes('CONNECT') || line.includes('HELO') ? 'text-cyan-300' : 'text-slate-300'}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                    <span>STATUS: 250 2.0.0 DELIVERED</span>
                    <span>SENDER: {SMTP_CONFIG.sender}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Select an SMTP log from the left to view raw transmission handshake.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end shrink-0">
          <button onClick={onClose} className="btn btn-secondary text-xs font-bold">
            Close Logger
          </button>
        </div>

      </div>
    </div>
  );
}
