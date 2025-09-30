// types/cryptoWithdraw.ts
export interface Network {
  id: number;
  name: string;
  symbol: string;
  tag: string | null;
  addressRegex: string;
  memoRegex: string;
}

export interface CoinNetworkInfo {
  id: number;
  withdraw_min: string;
}

export interface Coin {
  id: number;
  symbol: string;
  balance: string;
  balance_available: string;
  network: CoinNetworkInfo[];
   name?: string;
}

export interface LevelUsed {
  daily_withdrawal_crypto: number;
}

export interface CryptoWithdrawResponse {
  networks: Network[];
  coins: Coin[];
  level_used: LevelUsed;
  level_info: Record<string, any>;
}
