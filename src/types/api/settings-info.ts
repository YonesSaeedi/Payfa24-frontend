export interface SettingsInfo {
  settings?: {
    notifications?: {
      TradesSms?: boolean,
      TradesEmail?: boolean,
      TradesNotif?: boolean,
      LoginSms?: boolean,
      LoginEmail?: boolean
    }
  },
  twofa?: {
    status: boolean,
    type: "sms" | "email" | "google" | "telegram"
  },
  [key: string]: unknown // allowing other optional key value pairs
}