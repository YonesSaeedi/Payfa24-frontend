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
  application: ApplicationInfo
  cryptocurrency: CryptoItem[]
  depositMethods: DepositMethods
  [key: string]: unknown // allows extra keys without breaking type-check
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