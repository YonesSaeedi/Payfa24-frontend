import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VisibilityIcon from "../../../assets/icons/Home/WalletCardIcon/VisibilityIcon";
import CurrencyToggle from "./CurrencyToggle";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import WalletAdd from "../../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletMines from "../../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import ReceiptText from "../../../assets/icons/Home/WalletCardIcon/ReceiptTextIcon";
import WithdrawModal from "../../Withdrawal/WithdrawModal";
import DepositModal from "../../Deposit/DepositModal";
import IconEyeClosed from "../../../assets/icons/Login/IconEyeClosed";
import { ROUTES } from "../../../routes/routes";
import TetherIcon from "../../../assets/icons/Home/WalletCardIcon/TetherIcon";
import TomanIcon from "../../../assets/icons/Home/WalletCardIcon/TomanIcon";
import TransactionMainModal from "../../History/TransactionMainModal";
import { formatPersianNumber } from "../../../utils/formatPersianNumber";

interface WalletCardProps {
  showBuySell?: boolean;
  walletData?: Wallets;
  isLoading: boolean;
}
interface Wallet {
  balance?: number;
}
interface Wallets {
  toman?: Wallet;
  crypto?: Wallet;
}

const WalletCard = ({ showBuySell = true, walletData, isLoading }: WalletCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  // const [stateBlure, setStateBlure] = useState<boolean>(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"tether" | "toman">("toman");
  const [balance, setBalance] = useState<Wallets | null>(null);
  // action buttons ===============================================================================================================================
  const actionButtons = [
    { label: "تاریخچه",   onClick: () => setShowTransactionModal(true), icon: <ReceiptText /> },
    { label: "برداشت", onClick: () => setShowWithdrawModal(true), icon: <WalletMines /> },
    { label: "واریز", onClick: () => setShowDepositModal(true), icon: <WalletAdd /> },
    ...(showBuySell
      ? [
          { label: "فروش", route: ROUTES.TRADE.SELL, icon: <SendIcon /> },
          { label: "خرید", route: ROUTES.TRADE.BUY, icon: <ReceivedIcon /> },
        ]
      : []),
  ];
  // handle currency change =====================================================================================================================
  // const handleCurrencyChange = (value: "tether" | "toman") => {
  //   setSelectedCurrency(value);
  // };
  // function get balance and run it once component mounted ======================================================================================
  // async function getBalance() {
  //   try {
  //     const response = await apiRequest<WalletResponse>({ url: "/dashboard/web" });
  //     setBalance(response);
  //   } catch (err) {
  //     toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'دریافت اطلاعات کیف پول با مشکل مواجه شد.')
  //   }
  // }
  // useEffect(() => { getBalance(); }, []);
  useEffect(() => {
    setBalance(walletData ?? null);
  }, [walletData]);
  // specify displayed balance currency ==========================================================================================================
  const displayBalance = selectedCurrency === "tether" ? balance?.crypto?.balance : balance?.toman?.balance;

  const shownBalance = showBalance ? formatPersianNumber(displayBalance ?? 0) : formatPersianNumber(1234567);

  const handleToggleBalance = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowBalance((prev) => !prev);
      setIsAnimating(false);
    }, 150);
  };

  return (
   
 <div className="border border-gray21 rounded-xl p-4 lg:pt-6 lg:pb-6 lg:px-10 shadow lg:w-full flex flex-col gap-14 lg:gap-[32px] select-none lg:min-h-[371px]">
        <div className="flex items-center justify-between mb-7">
          <CurrencyToggle
  defaultValue="toman"
  showIcons={true}
  options={[
    { label: "تتر", value: "tether", icon: <TetherIcon /> },
    { label: "تومان", value: "toman", icon: <TomanIcon /> }
  ]}
  onChange={(v) => setSelectedCurrency(v as "tether" | "toman")}
/>

          <div className="flex items-center gap-1.5 cursor-pointer transition-all duration-300 rounded-xl px-2 py-1" onClick={handleToggleBalance}>
            <span className="w-[22px] h-[22px] text-gray-500 group-hover:bg-blue2">{showBalance ? <VisibilityIcon /> : <IconEyeClosed />}</span>
            <span className="text-black1 text-xs font-medium lg:font-bold lg:text-lg hover:text-blue2">موجودی کیف پول شما</span>
          </div>
        </div>

      <div className="flex justify-center items-center flex-1">
  <div className="text-base lg:text-2xl flex items-center justify-center gap-3 font-bold text-black1 transition-all duration-300" dir="rtl" style={{ userSelect: "none" }}>
    {isLoading ? (
      <span className="skeleton-bg h-5 lg:h-7 lg:w-36 w-20 rounded min-h-[20px]"></span>
    ) : (
      <span className={`transition-all duration-300 ${!showBalance || isAnimating ? "blur text-gray-500" : ""}`}>
        {shownBalance}
      </span>
    )}
    <span>{selectedCurrency === "tether" ? "تتر" : "تومان"}</span>
  </div>
</div>


        {/* دکمه‌ها */}
        <div className="flex gap-1.5 lg:gap-3 justify-center mt-auto">
    {actionButtons.map((btn, idx) =>
      btn.route ? (
        <Link
          key={idx}
          to={btn.route}
          className="flex-1 flex flex-col items-center justify-center rounded-lg border bg-gray27 border-gray21 p-1.5 lg:p-4 text-xs lg:text-sm text-black1 hover:border-blue2 hover:shadow-sm transition min-w-0"
        >
          <div className="w-5 h-5 lg:w-6 lg:h-6 mb-1.5 text-blue1">{btn.icon}</div>
          {btn.label}
        </Link>
      ) : (
        <button
          key={idx}
          onClick={btn.onClick}
          className="flex-1 flex flex-col items-center justify-center rounded-lg border bg-gray27 border-gray21 p-1.5 lg:p-4 text-xs lg:text-sm text-black1 hover:border-blue2 hover:shadow-sm transition min-w-0"
        >
          <div className="w-5 h-5 lg:w-6 lg:h-6 mb-1.5 text-blue1">{btn.icon}</div>
          {btn.label}
        </button>
      )
    )}
         </div>
  

      {/* مودال‌ها */}
      <WithdrawModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
        <TransactionMainModal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)}/>

    </div>
  );
};

export default WalletCard;
