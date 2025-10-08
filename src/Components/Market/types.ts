export interface ICryptoItem {
  symbol: string;
  name: string;
  locale?: {
    fa?: string;
    en?: string;
  };
  icon: JSX.Element;

  priceUSDT: number;     // از priceBuy یا هر چیزی که می‌خوای
  buyPrice: number;
  sellPrice: number;
  change24h: number;     // از priceChangePercent
  volume: number;        // از quoteVolume

  isNew?: boolean;
  favorite?: boolean;
}