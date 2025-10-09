import { TradePrices } from "./apiResponses"

export interface LocaleName {
  en?: { name: string }
  fa?: { name: string }
  fr?: { name: string }
}
export interface CryptoItem {
  // general info
  buy_status?: number
  color?: string
  deposit?: number
  icon?: string
  id?: number
  isDisable?: boolean
  isFont?: boolean
  locale?: LocaleName
  name?: string
  percent?: number
  sell_status?: number
  symbol: string
  withdraw?: number
  // price, change percent, volume
  quoteVolume?: string
  priceSell?: string
  priceChangePercent?: string
  priceBuy?: string
  // digital currencies
  type?: string
}
export type CryptoDataMap = Record<string, CryptoItem>

// ==============================================================================================================================

export interface OrderInfoCryptoItem {
  // general info
  buy_status?: number
  color?: string
  deposit?: number
  icon?: string
  id?: number
  isDisable?: boolean
  isFont?: boolean
  locale?: LocaleName
  name?: string
  percent?: number
  sell_status?: number
  symbol: string
  withdraw?: number
  // price from order info
  price?: TradePrices
}
export type OrderInfoCryptoDataMap = Record<string, OrderInfoCryptoItem>

// ==============================================================================================================================

export interface DigitalCurrency {
  cryptoNameFa?: string //"پرفکت مانی",
  name?: string // "PerfectMoney",
  symbol: string // "PM",
  colorCode?: string // "F44336",
  icon?: string // "perfectmoney.svg",
  type?: string // "digitalCurrency",
  locale?: LocaleName // {en: { name: "PerfectMoney" },fa: { name: "پرفکت مانی" }},
  price?: TradePrices
}
