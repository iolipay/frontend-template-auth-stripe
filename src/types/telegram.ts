// Telegram Integration Types

export interface TelegramStatus {
  is_connected: boolean;
  telegram_username?: string;
  connected_at?: string;
  notifications_enabled: boolean;
}

export interface TelegramConnectionResponse {
  connection_token: string;
  deep_link: string;
  bot_username: string;
  expires_at: string;
  instructions: string;
}

export interface TelegramSettings {
  notifications_enabled: boolean;
  reminder_time: string; // HH:MM format
  daily_transaction_reminder: boolean;
  weekly_summary: boolean;
  monthly_report: boolean;
  subscription_alerts: boolean;
}

export interface TelegramSettingsUpdate {
  notifications_enabled?: boolean;
  reminder_time?: string;
  daily_transaction_reminder?: boolean;
  weekly_summary?: boolean;
  monthly_report?: boolean;
  subscription_alerts?: boolean;
}

export interface TelegramBotInfo {
  id: number;
  username: string;
  first_name: string;
}
