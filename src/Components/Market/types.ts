// types.ts
export interface ICryptoItem {
  name: string;
  symbol: string;
  icon?: string;          // url
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  favorite?: boolean;
  volume?: number;
  isNew?: boolean;
  isFont?: boolean;
  color?: string;
}
