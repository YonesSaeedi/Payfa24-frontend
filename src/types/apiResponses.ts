import { CryptoItem } from "./crypto"

// application =========================================================================================
export interface ChangeItemMessage {
  fa: string | null
  en: string | null
}
export interface ApplicationStore {
  change_item_message: ChangeItemMessage
  link: string
  message: string | null
  os: string
  reqiuard: string
  status: string
  version_code: string | number
}
export type ApplicationInfo = Record<string, ApplicationStore>
// deposit methods =========================================================================================
export interface DepositMethodInfo {
  isDisable: boolean
  isHidden: boolean
}
export type DepositMethods = Record<string, DepositMethodInfo>
// general info =========================================================================================
export interface GeneralInfo {
  application: ApplicationInfo;
  cryptocurrency: CryptoItem[];
  depositMethods: DepositMethods;
  [key: string]: unknown; // بقیه کلیدهای احتمالی
}



// ===============================================================================================================================================================================

// balance internal
export interface BalanceInternal {
  country?: string
  deposit_status?: number
  id?: number
  min_deposit?: number
  min_withdraw: number
  name?: string
  percent?: number
  symbol?: string
  transfer_status?: number
  withdraw_status?: number
  [key: string]: unknown
}
// get fiat balance
export interface FiatBalance {
  balance?: number
  balance_available?: number
  internal?: BalanceInternal
  [key: string]: unknown
}

// ===============================================================================================================================================================================

// order/get-info/{symbol} .price
export interface TradePrices {
  buy: number
  sell: number
}
export interface TradeSymbolResponse {
  balance: number
  price: TradePrices
}
// order/get-info/{symbol}

// ===============================================================================================================================================================================

export interface CryptoBuy {
  amount: number // 21544
  amount_coin: number // 0.7
  fee: number // 30945
  id_order: number // 1351270
  msg?: string // "قیمت هر واحد از TRX برای شما 30945.00000000 تومان معادل 0.7TRX و در مجموع 21,545 تومان محاسبه میشود! آیا مورد تایید میباشد؟"
  status: boolean // true
  verifyPrice: boolean // false
  [key: string]: unknown
}
export interface CryptoBuyConfirm {
  balance?: number
  price?: TradePrices
}
export interface CryptoBuySuccess {
  status: boolean,
  msg: string // "done successfully",
  id_order: number // 1234
}

// ===============================================================================================================================================================================

export interface KycGetInfo {
  level_kyc: null | 'basic' | 'advanced';
  kyc: {
    basic?: {
      name?: string | null;
      family?: string | null;
      mobile?: string | null;
      email?: string | null;
      father?: string | null;
      national_code?: string | null;
      date_birth?: string | null;
      cardbank?: number;
    };
    advanced?: {
      status: "pending" | "confirm" | "reject";
      reason_reject: string | null;
    };
  };
  [key: string]: unknown
}



// ===============================================================================================================================================================================

export interface OrderGetInfoCoin {
  id?: number
  symbol: string
  price?: TradePrices
}
export interface OrderGetInfoDigitalCurrency {
  name?: string
  symbol: string
}
export interface OrderGetInfo {
  coins?: OrderGetInfoCoin[]
  digitalCurrency?: OrderGetInfoDigitalCurrency[]
}

