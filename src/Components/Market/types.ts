export interface ICryptoItem {
  symbol: string;
  name: string;
  locale?: {
    fa?: string;
    en?: string;
  };
  sort?: number;
  icon: React.ReactNode;
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  volume: number;
  isNew: boolean;
  favorite: boolean;
}
export interface IGeneralCryptoItem {
  symbol: string;
  isFont?: boolean;
  color?: string;
  icon?: string;
  sort?: number; // <-- این برای تعیین isNew است
  locale?: {
    fa?: { name: string };
    en?: { name: string };
  };
  name?: string;
}

export interface IGeneralData {
  cryptocurrency: IGeneralCryptoItem[];
}
export interface NewCryptoItem {
  buy_status?: number;
  color: string;
  deposit: number;
  fee?: string;
  icon: string;
  id: number;
  isDisable: boolean;
  isFont: boolean;
  locale?: {
    fa?: { name: string };
    en?: { name: string };
    fr?: { name: string };
  };
  name: string;
  percent: number;
  priceBuy: string;
  priceChangePercent: string;
  priceSell: string;
  quoteVolume: string;
  sell_status?: number;
  symbol: string;
  withdraw: number;
  priceUSDT?: number;
  change24h?: number;
}
