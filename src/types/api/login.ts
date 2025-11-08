export interface LoginResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  id_user?: number;
  token2fa?: string;
  twofaType?: 'email' | 'sms' | 'google';
  status?: boolean;
  msg?: string;
}