export interface TypeGeneralInfo {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  isFont: boolean;
  isDisable: boolean;
  locale: {
    fa?: { name?: string };
    en?: { name?: string };
    fr?: { name?: string };
  };
}

export interface TypeCryptoHistory {
  id: number;
  type: string;
  amount: number;
  status: string;
  description?: string;
  DateTime: string;
  coin: { name: string; symbol: string };
  fee?: number;
  memoTag?: string;
  code?: string;
  amount_toman?: number;
  stock?: number;
  withdraw_fee?: number;
  network?: string;

}



export interface MergedCryptoHistory extends TypeCryptoHistory {
  color: string | null;
  isFont: boolean;
  icon: string | null;
  locale: TypeGeneralInfo["locale"] | null;
  name: string;
}


export interface TypeOrderHistory {
  id: number;
  amount: number;
  amount_coin: number;
  dateTime: string;
  fee: number;
  description?: string;
  internal: string;
  name: string;
  status?: string;
  symbol?: string;
  type?: string;
  icon?: string;
   wage?: number;
  data?: any;
}

export interface MergedOrderHistory {
  // ---------------- تراکنش ----------------
  id: number;
  amount: number;
  amount_coin: number;
  dateTime: string;
  fee: number;
  description?: string;
  internal: string;
  name: string;      // نام ارز یا تراکنش
  status?: string;
  symbol?: string;
  type?: string;
  wage?: number;
  data?: any;

  // ---------------- اطلاعات ارز ----------------
  color: string | null;
  isFont: boolean;
  icon: string | null;
  locale: TypeGeneralInfo["locale"] | null;
}


export interface TypeTomanTransaction {
    id: number;
    type: string;
    amount: number;
    status: string;
    description?: string;
    DateTime: string;
    symbol: string;
    name: string
}

export const typeOptions = [
  { id: 0, name: "واریز و برداشت", value: "" },
  { id: 1, name: "واریز", value: "deposit" },
  { id: 2, name: "برداشت", value: "withdraw" },
];

export const statusOptions = [
  { id: 0, name: "همه وضعیت ها", value: "" },
  { id: 1, name: "موفق", value: "success" },
  { id: 2, name: "درحال بررسی", value: "pending" },
  { id: 3, name: "ناموفق", value: "unsuccessful" },
  { id: 4, name: "رد شده", value: "reject" },
];

export const filterForOptions = [
  { id: 0, name: "همه تراکنش ها", value: "" },
  { id: 1, name: "سفارش", value: "orders" },
  { id: 2, name: "کیف پول", value: "wallets" },
];


export const typeOrderOptions = [
  { id: 0, name: "خرید و فروش", value: "" },
  { id: 1, name: "خرید", value: "buy" },
  { id: 2, name: "فروش", value: "sell" },
];

export const statusOrderOptions = [
  { id: 0, name: "همه وضعیت ها", value: "" },
  { id: 1, name: "موفق", value: "success" },
  { id: 2, name: "درحال بررسی", value: "pending" },
  { id: 3, name: "ناموفق", value: "unsuccessful" },
  { id: 4, name: "رد شده", value: "reject" },
];


export const typeTomanOptions = [
    { id: 0, name: "واریز و برداشت", value: "" },
    { id: 1, name: "واریز", value: "deposit" },
    { id: 2, name: "برداشت", value: "withdraw" },
];

export const statusTomanOptions = [
    { id: 0, name: "همه وضعیت ها", value: "" },
    { id: 1, name: "موفق", value: "success" },
    { id: 2, name: "درحال بررسی", value: "pending" },
    { id: 3, name: "ناموفق", value: "unsuccessful" },
    { id: 4, name: "رد شده", value: "reject" },
];

export const filterForTomanOptions = [
    { id: 0, name: "همه تراکنش ها", value: "" },
    { id: 1, name: "ترید", value: "trades" },
    { id: 2, name: "سفارش", value: "orders" },
    { id: 3, name: "کیف پول", value: "wallets" },
];
