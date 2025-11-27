export interface DigitalBuy {
  status: boolean,
  msg: string // "successfully."
  otp: boolean,
  msgOtp: string // "پیامک برای موبایل شما ارسال شد."
  order_id: number // 1351510,
  method: string // "sms"
  id_order: number // 1351793
}