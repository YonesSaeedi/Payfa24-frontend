import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "../../../assets/icons/Home/WalletCardIcon/VisibilityIcon";
import CurrencyToggle from "./CurrencyToggle";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import WalletAdd from "../../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletMines from "../../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import ReceiptText from "../../../assets/icons/Home/WalletCardIcon/ReceiptTextIcon";
import WithdrawModal from "../../Withdrawal/WithdrawModal";
import DepositModal from "../../Deposit/DepositModal";
import { apiRequest } from "../../../utils/apiClient";
import { formatPersianDigits } from "../../../utils/formatPersianDigits";
import IconEyeClosed from "../../../assets/icons/Login/IconEyeClosed";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ROUTES } from "../../../routes/routes";

interface WalletCardProps {
  balance?: number;
  currency?: string;
  showBuySell?: boolean;
}
interface Wallet {
  balance: number;
}
interface Wallets {
  toman: Wallet;
  crypto: Wallet;
}
interface WalletResponse {
  wallets: Wallets;
}

const WalletCard = ({ showBuySell = true, }: WalletCardProps) => {
  const [stateBlure, setStateBlure] = useState<boolean>(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"tether" | "toman">("toman");
  const [balance, setBalance] = useState<WalletResponse | null>(null);
  const navigate = useNavigate();
  // action buttons ===============================================================================================================================
  const actionButtons = [
    { label: "تاریخچه", onClick: () => navigate(ROUTES.TRANSACTION.CRYPTO_HISTORY), icon: <ReceiptText />, },
    { label: "برداشت", onClick: () => setShowWithdrawModal(true), icon: <WalletMines />, },
    { label: "واریز", onClick: () => setShowDepositModal(true), icon: <WalletAdd />, },
    ...(showBuySell
      ? [
        { label: "فروش", onClick: () => navigate(ROUTES.TRADE.SELL), icon: <SendIcon />, },
        { label: "خرید", onClick: () => navigate(ROUTES.TRADE.BUY), icon: <ReceivedIcon />, },
      ]
      : []),
  ];
  // handle currency change =====================================================================================================================
  const handleCurrencyChange = (value: "tether" | "toman") => { setSelectedCurrency(value); };
  // function get balance and run it once component mounted ======================================================================================
  async function getBalance() {
    try {
      const response = await apiRequest<WalletResponse>({ url: "/api/dashboard/web" });
      setBalance(response);
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'دریافت اطلاعات کیف پول با مشکل مواجه شد.')
    }
  }
  useEffect(() => { getBalance(); }, []);
  // specify displayed balance currency ==========================================================================================================
  const displayBalance =
    selectedCurrency === "tether"
      ? balance?.wallets.crypto?.balance
      : balance?.wallets.toman?.balance;

  return (
    <div>
      <div className="border border-gray21 rounded-xl p-4 lg:pt-6 lg:pb-4 lg:px-8 shadow lg:w-full h-full flex flex-col gap-[22px]">
        <div className="flex items-center justify-between mb-7">
          <CurrencyToggle onChange={handleCurrencyChange} />
          <div className="flex items-center gap-1.5 cursor-pointer transition-all duration-300 rounded-xl px-2 py-1" onClick={() => setStateBlure((prev) => !prev)}>
            <span className="w-[22px] h-[22px] text-gray-500 group-hover:text-gray-800">{stateBlure ? <VisibilityIcon /> : <IconEyeClosed />}</span>
            <span className="text-black1 text-xs font-medium lg:font-bold lg:text-lg">موجودی کیف پول شما</span>
          </div>
        </div>
        <div className="text-center mb-6">
          <div className={`text-base lg:text-2xl flex items-center justify-center gap-3 font-bold text-black1 ${!stateBlure ? "blur-md" : ""}`} dir="rtl">
            <span>{formatPersianDigits(displayBalance ?? "0")}</span>
            <span>{selectedCurrency === "tether" ? "تتر" : "تومان"}</span>
          </div>
        </div>
        <div className="flex gap-1.5 lg:gap-3 m-2 justify-center">
          {actionButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className="flex-1 flex flex-col items-center justify-center rounded-lg border bg-gray27 border-gray21 p-1.5 lg:p-4 text-xs lg:text-sm text-black1 hover:border-blue2 hover:shadow-sm transition min-w-0"
            >
              <div className="w-5 h-5 lg:w-6 lg:h-6 mb-1.5 text-blue1">{btn.icon}</div>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      {/* withdraw modal ================================= */}
      <WithdrawModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
      {/* deposit modal ================================= */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </div>
  );
};

export default WalletCard;
