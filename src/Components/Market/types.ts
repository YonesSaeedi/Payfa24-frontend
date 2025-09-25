export interface ICryptoItem {
  name: string;
  symbol: string;
  icon?: string;
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  favorite?: boolean;
  volume?: number;
  isNew?: boolean;
  isFont?: boolean;
  color?: string;
  locale?: {
    fa?: { name: string };
    en?: { name: string };
  };
  renderIcon?: React.ReactNode; // 🟢 اضافه شد
}
