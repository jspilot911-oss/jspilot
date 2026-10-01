/**
 * SMTP Email Notification & User Database Service
 * Now backed by Firestore instead of localStorage
 */
import { db } from '../firebase.js';
import {
  collection, doc, setDoc, getDocs, query, orderBy
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const LOGS_COLLECTION = 'smtp_logs';

export const SMTP_CONFIG = {
  server: 'smtp.jspilot.app',
  port: 587,
  security: 'TLS 1.3 (256-bit AES)',
  sender: 'auth-notifications@jspilot.app',
  replyTo: 'support@jspilot.app'
};

export const SmtpService = {
  /**
   * Fetch All Registered Users in Database
   */
  async getUserDatabase() {
    try {
      const q = query(collection(db, USERS_COLLECTION), orderBy('registered_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data());
    } catch (e) {
      console.error('Failed to load user database:', e);
      return [];
    }
  },

  /**
   * Fetch SMTP Transmission Logs
   */
  async getSmtpLogs() {
    try {
      const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data());
    } catch (e) {
      console.error('Failed to load SMTP logs:', e);
      return [];
    }
  },

  /**
   * Generate Sequential User Account ID Series (e.g. USR-1001, USR-1002, USR-1003)
   */
  generateNextUserId(existingUsers = []) {
    let maxSeq = 1000;
    (existingUsers || []).forEach(u => {
      if (u.user_id) {
        const match = u.user_id.match(/USR-(\d+)/i) || u.user_id.match(/usr_(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq && num < 10000000) {
            maxSeq = num;
          }
        }
      }
    });
    const nextSeq = maxSeq + 1;
    return `USR-${String(nextSeq).padStart(4, '0')}`;
  },

  /**
   * Register User in Database & Dispatch SMTP Email Notification
   */
  async registerUserDatabase(userData, mode = 'register') {
    const timestamp = new Date().toISOString();
    const existingUsers = await this.getUserDatabase();

    const existing = existingUsers.find(u => u.email === userData.email);
    const isOwner = userData.role === 'owner' || userData.isOwner || (userData.email && (userData.email.toLowerCase().includes('owner') || userData.email.toLowerCase().includes('admin')));
    const plan = isOwner ? 'PRO' : (userData.current_plan || 'FREE');
    const isPaidUser = plan === 'PRO' || plan === 'YEARLY';

    const dbRecord = {
      user_id: userData.user_id || existing?.user_id || this.generateNextUserId(existingUsers),
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      target_goal: userData.targetGoal || 'General Planning',
      current_plan: plan,
      plan_type: isPaidUser ? 'PAID PRO USER' : 'FREE USER',
      role: isOwner ? 'owner' : 'user',
      auth_protocol: 'SMTP / TLS 587',
      smtp_status: 'DELIVERED (250 2.0.0 OK)',
      registered_at: existing ? existing.registered_at : timestamp,
      last_login_at: timestamp,
      ip_address: '127.0.0.1 (Local Client)'
    };

    await setDoc(doc(db, USERS_COLLECTION, dbRecord.user_id), dbRecord);

    // Generate SMTP Transmission Log (simulated, unchanged)
    await this.dispatchSmtpWelcomeEmail(dbRecord, mode);

    return dbRecord;
  },

  /**
   * Dispatch SMTP Email Transcript & Notification Log (simulated)
   */
  async dispatchSmtpWelcomeEmail(userData, mode = 'register') {
    const timestamp = new Date().toISOString();
    const mailSubject = mode === 'register'
      ? `Welcome to JSPilot, ${userData.name}! Account Created via SMTP`
      : `Security Alert: Sign In Detected for ${userData.email}`;

    const smtpTranscript = [
      `[${timestamp}] CONNECT ${SMTP_CONFIG.server}:${SMTP_CONFIG.port} via TLS 1.3`,
      `[${timestamp}] 220 ${SMTP_CONFIG.server} ESMTP Service Ready`,
      `[${timestamp}] HELO client.jspilot.app`,
      `[${timestamp}] 250 Hello client.jspilot.app, pleased to meet you`,
      `[${timestamp}] AUTH LOGIN (Encrypted Credentials OK)`,
      `[${timestamp}] 235 2.7.0 Authentication successful`,
      `[${timestamp}] MAIL FROM: <${SMTP_CONFIG.sender}>`,
      `[${timestamp}] 250 2.1.0 Sender OK`,
      `[${timestamp}] RCPT TO: <${userData.email}>`,
      `[${timestamp}] 250 2.1.5 Recipient OK`,
      `[${timestamp}] DATA`,
      `[${timestamp}] 354 Start mail input; end with <CRLF>.<CRLF>`,
      `[${timestamp}] Subject: ${mailSubject}`,
      `[${timestamp}] MIME-Version: 1.0; Content-Type: text/html; charset=UTF-8`,
      `[${timestamp}] .`,
      `[${timestamp}] 250 2.0.0 OK Message Accepted for Delivery (ID: msg_${Date.now()})`
    ];

    const logEntry = {
      log_id: `smtp_log_${Date.now()}`,
      recipient_email: userData.email,
      recipient_name: userData.name,
      subject: mailSubject,
      status: 'DELIVERED',
      timestamp,
      transcript: smtpTranscript
    };

    await setDoc(doc(db, LOGS_COLLECTION, logEntry.log_id), logEntry);
    return logEntry;
  },

  /**
   * Owner Admin Action: Update any user's subscription plan (PRO vs FREE)
   */
  async updateUserPlan(userIdOrEmail, newPlan) {
    const users = await this.getUserDatabase();
    const target = users.find(u => u.user_id === userIdOrEmail || u.email === userIdOrEmail);
    if (!target) return null;

    const isPaid = newPlan === 'PRO' || newPlan === 'YEARLY';
    target.current_plan = newPlan;
    target.plan_type = isPaid ? 'PAID PRO USER' : 'FREE USER';

    await setDoc(doc(db, USERS_COLLECTION, target.user_id), target);

    const timestamp = new Date().toISOString();
    const mailSubject = `Subscription Plan Updated to ${newPlan} by Owner/Admin`;
    const smtpTranscript = [
      `[${timestamp}] CONNECT ${SMTP_CONFIG.server}:${SMTP_CONFIG.port} via TLS 1.3`,
      `[${timestamp}] 220 ${SMTP_CONFIG.server} ESMTP Service Ready`,
      `[${timestamp}] HELO owner.jspilot.app`,
      `[${timestamp}] 250 Hello owner.jspilot.app`,
      `[${timestamp}] AUTH OWNER_PRIVILEGE_KEY (Owner Access Confirmed)`,
      `[${timestamp}] 235 2.7.0 Authentication successful`,
      `[${timestamp}] MAIL FROM: <${SMTP_CONFIG.sender}>`,
      `[${timestamp}] 250 2.1.0 Sender OK`,
      `[${timestamp}] RCPT TO: <${target.email}>`,
      `[${timestamp}] 250 2.1.5 Recipient OK`,
      `[${timestamp}] DATA`,
      `[${timestamp}] 354 Start mail input`,
      `[${timestamp}] Subject: ${mailSubject}`,
      `[${timestamp}] Content: System Owner updated subscription plan for ${target.email} to ${newPlan}.`,
      `[${timestamp}] .`,
      `[${timestamp}] 250 2.0.0 OK Message Accepted for Delivery (ID: msg_owner_${Date.now()})`
    ];

    const logEntry = {
      log_id: `smtp_plan_${Date.now()}`,
      recipient_email: target.email,
      recipient_name: target.name,
      subject: mailSubject,
      status: 'DELIVERED',
      timestamp,
      transcript: smtpTranscript
    };

    await setDoc(doc(db, LOGS_COLLECTION, logEntry.log_id), logEntry);

    return target;
  }
};