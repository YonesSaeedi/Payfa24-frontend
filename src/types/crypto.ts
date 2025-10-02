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
}

export type CryptoDataMap = Record<string, CryptoItem>

