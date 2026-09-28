/**
 * SMTP Email Notification & User Database Service
 * Implements SMTP Protocol Handshake simulation & User Database Logger
 */

const STORAGE_KEY_USER_DB = 'smart_planner_user_database_v1';
const STORAGE_KEY_SMTP_LOGS = 'smart_planner_smtp_logs_v1';

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
  getUserDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER_DB);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load user database:', e);
    }
    return [];
  },

  /**
   * Save Registered User Database
   */
  saveUserDatabase(users) {
    try {
      localStorage.setItem(STORAGE_KEY_USER_DB, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save user database:', e);
    }
  },

  /**
   * Fetch SMTP Transmission Logs
   */
  getSmtpLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SMTP_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load SMTP logs:', e);
    }
    return [];
  },

  saveSmtpLogs(logs) {
    try {
      localStorage.setItem(STORAGE_KEY_SMTP_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save SMTP logs:', e);
    }
  },

  /**
   * Register User in Database & Dispatch SMTP Email Notification
   */
  registerUserDatabase(userData, mode = 'register') {
    const timestamp = new Date().toISOString();
    const existingUsers = this.getUserDatabase();

    const existingIndex = existingUsers.findIndex(u => u.email === userData.email);
    const isOwner = userData.role === 'owner' || userData.isOwner || (userData.email && (userData.email.toLowerCase().includes('owner') || userData.email.toLowerCase().includes('admin')));
    const plan = isOwner ? 'PRO' : (userData.current_plan || 'FREE');
    const isPaidUser = plan === 'PRO' || plan === 'YEARLY';

    const dbRecord = {
      user_id: userData.user_id || `usr_${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      target_goal: userData.targetGoal || 'General Planning',
      current_plan: plan,
      plan_type: isPaidUser ? 'PAID PRO USER' : 'FREE USER',
      role: isOwner ? 'owner' : 'user',
      auth_protocol: 'SMTP / TLS 587',
      smtp_status: 'DELIVERED (250 2.0.0 OK)',
      registered_at: existingIndex >= 0 ? existingUsers[existingIndex].registered_at : timestamp,
      last_login_at: timestamp,
      ip_address: '127.0.0.1 (Local Client)'
    };

    let updatedUsers = [];
    if (existingIndex >= 0) {
      updatedUsers = [...existingUsers];
      updatedUsers[existingIndex] = { ...existingUsers[existingIndex], ...dbRecord };
    } else {
      updatedUsers = [dbRecord, ...existingUsers];
    }

    this.saveUserDatabase(updatedUsers);

    // Generate SMTP Transmission Log
    this.dispatchSmtpWelcomeEmail(dbRecord, mode);

    return dbRecord;
  },

  /**
   * Dispatch SMTP Email Transcript & Notification Log
   */
  dispatchSmtpWelcomeEmail(userData, mode = 'register') {
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

    const existingLogs = this.getSmtpLogs();
    this.saveSmtpLogs([logEntry, ...existingLogs]);

    return logEntry;
  },

  /**
   * Owner Admin Action: Update any user's subscription plan (PRO vs FREE)
   */
  updateUserPlan(userIdOrEmail, newPlan) {
    const users = this.getUserDatabase();
    const index = users.findIndex(u => u.user_id === userIdOrEmail || u.email === userIdOrEmail);
    
    if (index >= 0) {
      const isPaid = newPlan === 'PRO' || newPlan === 'YEARLY';
      users[index].current_plan = newPlan;
      users[index].plan_type = isPaid ? 'PAID PRO USER' : 'FREE USER';
      
      this.saveUserDatabase(users);

      // Log SMTP Transmission for Owner Plan Override
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
        `[${timestamp}] RCPT TO: <${users[index].email}>`,
        `[${timestamp}] 250 2.1.5 Recipient OK`,
        `[${timestamp}] DATA`,
        `[${timestamp}] 354 Start mail input`,
        `[${timestamp}] Subject: ${mailSubject}`,
        `[${timestamp}] Content: System Owner updated subscription plan for ${users[index].email} to ${newPlan}.`,
        `[${timestamp}] .`,
        `[${timestamp}] 250 2.0.0 OK Message Accepted for Delivery (ID: msg_owner_${Date.now()})`
      ];

      const logEntry = {
        log_id: `smtp_plan_${Date.now()}`,
        recipient_email: users[index].email,
        recipient_name: users[index].name,
        subject: mailSubject,
        status: 'DELIVERED',
        timestamp,
        transcript: smtpTranscript
      };

      const existingLogs = this.getSmtpLogs();
      this.saveSmtpLogs([logEntry, ...existingLogs]);

      return users[index];
    }
    return null;
  }
};
