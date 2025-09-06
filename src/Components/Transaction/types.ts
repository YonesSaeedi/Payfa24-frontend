export interface Transaction {
  id: string;
  currencyName: string;
  currencySymbol: string;
  currencyIcon: React.ReactNode;
  amount: string;
  type: string;
  status: string;
  date: string;
  time: string;
  memo?: string;
  code?: string;
}
