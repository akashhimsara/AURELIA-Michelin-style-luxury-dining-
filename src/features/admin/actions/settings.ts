"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface HotelSettingsConfig {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface BrandingSettingsConfig {
  accentColor: string;
  darkMode: boolean;
  fontFamily: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface EmailTemplateConfig {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface SmsTemplateConfig {
  id: string;
  name: string;
  body: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  role: string;
  action: string;
  moduleName: string;
  ipAddress: string;
  status: "success" | "warning" | "denied";
}

export interface SystemSettingsData {
  hotel: HotelSettingsConfig;
  branding: BrandingSettingsConfig;
  emailTemplates: EmailTemplateConfig[];
  smsTemplates: SmsTemplateConfig[];
  notifications: {
    emailOnNewBooking: boolean;
    emailOnDiningBooking: boolean;
    alertOnVipCheckIn: boolean;
    alertOnCancellation: boolean;
    dailyDigestEmail: boolean;
  };
  permissionMatrix: Record<string, string[]>;
  auditLogs: AuditLogEntry[];
  backup: {
    lastBackupDate: string;
    autoBackupFrequency: "daily" | "weekly" | "monthly";
    totalBackupsCount: number;
  };
  security: {
    sessionTimeoutMins: number;
    enforce2FA: boolean;
    maxLoginAttempts: number;
    ipWhitelist: string;
  };
}

// In-Memory Persistent Settings Store for Dev Runtime
let SETTINGS_STORE: SystemSettingsData = {
  hotel: {
    name: "AURELIA London",
    tagline: "Sanctuaries of Rest & Michelin Fine Dining",
    address: "14 Mayfair Square, London W1J 8AJ, United Kingdom",
    phone: "+44 20 7946 0912",
    email: "concierge@aurelia.com",
    currency: "GBP (£)",
    timezone: "Europe/London",
    checkInTime: "15:00",
    checkOutTime: "11:00",
  },
  branding: {
    accentColor: "#f59e0b",
    darkMode: true,
    fontFamily: "Cinzel & Inter",
    logoUrl: "/hero-bg.png",
    faviconUrl: "/hero-bg.png",
  },
  emailTemplates: [
    {
      id: "tpl-1",
      name: "Reservation Confirmation",
      subject: "Your Sanctuary Reservation Confirmation at AURELIA Mayfair",
      body: "Dear {{guest_name}},\n\nWe are delighted to confirm your upcoming stay at AURELIA London in the {{suite_name}} from {{check_in_date}} to {{check_out_date}}.\n\nYour total arrangement is £{{total_amount}}. Should you require private butler or airport transfer arrangements, please contact concierge@aurelia.com.\n\nWarmest regards,\nAURELIA Concierge Team",
    },
    {
      id: "tpl-2",
      name: "Pre-Arrival Concierge Welcome",
      subject: "Preparing for Your Stay at AURELIA London",
      body: "Dear {{guest_name}},\n\nOur concierge team is preparing for your arrival on {{check_in_date}}. Please let us know your pillow preferences and any culinary dietary requirements prior to arrival.\n\nYours sincerely,\nHead Butler, AURELIA Mayfair",
    },
    {
      id: "tpl-3",
      name: "Official VAT Invoice & Receipt",
      subject: "Official UK VAT Receipt for Your AURELIA Stay",
      body: "Dear {{guest_name}},\n\nPlease find attached your official UK VAT Invoice (Ref: {{invoice_ref}}) for your stay on {{check_in_date}}.\n\nTotal Paid: £{{total_amount}} (Inc 20% VAT).\n\nThank you for choosing AURELIA London.",
    },
  ],
  smsTemplates: [
    {
      id: "sms-1",
      name: "Check-in Alert",
      body: "AURELIA Alert: Dear {{guest_name}}, your {{suite_name}} is clean & ready for check-in at 15:00 today. Concierge: +44 20 7946 0912",
    },
    {
      id: "sms-2",
      name: "Dining Table Ready",
      body: "AURELIA Dining: Table #{{table_num}} is now prepared for your dinner seating tonight at {{time}}. We look forward to welcoming you.",
    },
  ],
  notifications: {
    emailOnNewBooking: true,
    emailOnDiningBooking: true,
    alertOnVipCheckIn: true,
    alertOnCancellation: true,
    dailyDigestEmail: false,
  },
  permissionMatrix: {
    dashboard: ["super_admin", "hotel_manager", "reception", "restaurant_manager", "spa_manager", "wedding_manager", "finance", "housekeeping", "marketing"],
    reservations: ["super_admin", "hotel_manager", "reception"],
    guests: ["super_admin", "hotel_manager", "reception"],
    rooms: ["super_admin", "hotel_manager", "reception", "housekeeping"],
    restaurant: ["super_admin", "hotel_manager", "restaurant_manager"],
    spa: ["super_admin", "hotel_manager", "spa_manager"],
    wedding: ["super_admin", "hotel_manager", "wedding_manager"],
    finance: ["super_admin", "hotel_manager", "finance"],
    housekeeping: ["super_admin", "hotel_manager", "housekeeping"],
    marketing: ["super_admin", "hotel_manager", "marketing"],
    reports: ["super_admin", "hotel_manager", "finance", "marketing"],
    settings: ["super_admin", "hotel_manager"],
    "system-logs": ["super_admin"],
  },
  auditLogs: [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Updated System Branding & Accent Theme Color",
      moduleName: "Settings",
      ipAddress: "192.168.1.45",
      status: "success",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      adminEmail: "manager@aurelia.com",
      role: "Hotel Manager",
      action: "Processed Guest Refund #AUR-8291 (£450.00)",
      moduleName: "Finance",
      ipAddress: "192.168.1.88",
      status: "success",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      adminEmail: "reception@aurelia.com",
      role: "Reception",
      action: "Attempted Unauthorized Access to Finance Ledger",
      moduleName: "Finance",
      ipAddress: "192.168.1.102",
      status: "denied",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Promoted Guest 'Lord Sterling' to VIP Elite Tier",
      moduleName: "Guests",
      ipAddress: "192.168.1.45",
      status: "success",
    },
  ],
  backup: {
    lastBackupDate: new Date().toISOString(),
    autoBackupFrequency: "daily",
    totalBackupsCount: 14,
  },
  security: {
    sessionTimeoutMins: 30,
    enforce2FA: true,
    maxLoginAttempts: 5,
    ipWhitelist: "192.168.1.*, 10.0.0.*",
  },
};

function revalidateSettings() {
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
}

// ─── Fetch Settings Data ──────────────────────────────────────────────────────

export async function getSystemSettingsData(): Promise<SystemSettingsData> {
  return SETTINGS_STORE;
}

// ─── Update Hotel Settings ────────────────────────────────────────────────────

export async function updateHotelSettings(data: HotelSettingsConfig) {
  try {
    SETTINGS_STORE.hotel = data;
    SETTINGS_STORE.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Updated Hotel Operations & Contact Info",
      moduleName: "Settings",
      ipAddress: "127.0.0.1",
      status: "success",
    });
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update hotel settings." };
  }
}

// ─── Update Branding Settings ─────────────────────────────────────────────────

export async function updateBrandingSettings(data: BrandingSettingsConfig) {
  try {
    SETTINGS_STORE.branding = data;
    SETTINGS_STORE.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Updated Branding Theme & Accent Colors",
      moduleName: "Settings",
      ipAddress: "127.0.0.1",
      status: "success",
    });
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update branding settings." };
  }
}

// ─── Update Email Template ────────────────────────────────────────────────────

export async function updateEmailTemplate(id: string, subject: string, body: string) {
  try {
    const tpl = SETTINGS_STORE.emailTemplates.find((t) => t.id === id);
    if (tpl) {
      tpl.subject = subject;
      tpl.body = body;
    }
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update email template." };
  }
}

// ─── Update SMS Template ──────────────────────────────────────────────────────

export async function updateSmsTemplate(id: string, body: string) {
  try {
    const tpl = SETTINGS_STORE.smsTemplates.find((t) => t.id === id);
    if (tpl) {
      tpl.body = body;
    }
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update SMS template." };
  }
}

// ─── Update Notifications ─────────────────────────────────────────────────────

export async function updateNotificationSettings(data: SystemSettingsData["notifications"]) {
  try {
    SETTINGS_STORE.notifications = data;
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update notifications." };
  }
}

// ─── Update Role Permissions Matrix ──────────────────────────────────────────

export async function updateRolePermissions(moduleName: string, roles: string[]) {
  try {
    SETTINGS_STORE.permissionMatrix[moduleName] = roles;
    SETTINGS_STORE.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: `Updated RBAC Role Permissions for module '${moduleName}'`,
      moduleName: "Settings",
      ipAddress: "127.0.0.1",
      status: "success",
    });
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update permissions matrix." };
  }
}

// ─── Create System Backup ─────────────────────────────────────────────────────

export async function createSystemBackup() {
  try {
    SETTINGS_STORE.backup.lastBackupDate = new Date().toISOString();
    SETTINGS_STORE.backup.totalBackupsCount += 1;
    SETTINGS_STORE.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Triggered Manual Database Backup & JSON Dump Snapshot",
      moduleName: "Settings",
      ipAddress: "127.0.0.1",
      status: "success",
    });
    revalidateSettings();

    // Export database dump snapshot JSON string
    const dump = JSON.stringify(SETTINGS_STORE, null, 2);
    return { success: true, dump };
  } catch (error) {
    return { success: false, message: "Failed to create backup." };
  }
}

// ─── Update Security Settings ─────────────────────────────────────────────────

export async function updateSecuritySettings(data: SystemSettingsData["security"]) {
  try {
    SETTINGS_STORE.security = data;
    SETTINGS_STORE.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: "admin@aurelia.com",
      role: "Super Admin",
      action: "Updated System Security Controls & 2FA Enforcement",
      moduleName: "Settings",
      ipAddress: "127.0.0.1",
      status: "success",
    });
    revalidateSettings();
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update security settings." };
  }
}
