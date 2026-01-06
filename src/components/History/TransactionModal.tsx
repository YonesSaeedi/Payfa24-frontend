
export interface CryptoDetail {
  id: string;
  source: "crypto";
  date?: string;
  amount?: string;
  amountCoin?: string;
  symbol: string;
  description?: string;
  status?: string;
  type?: string;
  fee?: number;
  amountToman?: string;
  stock?: string;
  withdrawFee?: number | null;
  network?: string | null;
  faName?: string;
  color?: string | null;
  isFont?: boolean;
  icon?: string | null;
  image?: string;
}


import TransactionModalOrder from "./TransactionModalOrder";
import TransactionModalCrypto from "./TransactionModalCrypto";
import TransactionModalFiat from "./TransactionModalFiat";

// TransactionModal.tsx

export interface TransactionDetail {
  id: string; // همیشه string
  source: "order" | "crypto" | "fiat";
  [key: string]: any;
}

interface OrderTx {
  id: string;
  source: "order";
  // سایر فیلدهای order
}

interface CryptoTx {
  id: string;
  source: "crypto";
  // سایر فیلدهای crypto
}

interface FiatTx {
  id: string;
  source: "fiat";
  // سایر فیلدهای fiat
}

type Tx = OrderTx | CryptoTx | FiatTx;

interface TransactionModalProps {
  tx: Tx | null;
  onClose: () => void;
  coinData?: any;
}


const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onClose, coinData }) => {
  if (!tx) return null;

  switch (tx.source) {
    case "order":
      return <TransactionModalOrder tx={tx} onClose={onClose} coinData={coinData}/>;

    case "crypto":
      return <TransactionModalCrypto tx={tx} onClose={onClose} coinData={coinData} />;

    case "fiat":
      return <TransactionModalFiat tx={tx} onClose={onClose} />;

    default:
      return null;
  }
};

export default TransactionModal;

