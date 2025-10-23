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
import DepositModal from "../../Deposit/DepositModal"; // ✅ اضافه شد
import { apiRequest } from "../../../utils/apiClient";
import { formatPersianDigits } from "../../../utils/formatPersianDigits";
import IconEyeClosed from "../../../assets/icons/Login/IconEyeClosed";

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

const WalletCard = ({
  currency = "تومان",
  showBuySell = true,
}: WalletCardProps) => {
  const [stateBlure, setStateBlure] = useState<boolean>(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false); // ✅ اضافه شد
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<"tether" | "toman">(
    "toman"
  );


  const actionButtons = [
    {
      label: "تاریخچه",
      onClick: () => navigate("/history/crypto"),
      icon: (
        <span className="text-blue1">
          <ReceiptText />
        </span>
      ),
    },
    {
      label: "برداشت",
      onClick: () => setShowWithdrawModal(true),
      icon: (
        <span className="text-blue1">
          <WalletMines />
        </span>
      ),
    },
    {
      label: "واریز",
      onClick: () => setShowDepositModal(true), // ✅ تغییر داده شد
      icon: (
        <span className="text-blue1">
          <WalletAdd />
        </span>
      ),
    },
    ...(showBuySell
      ? [
          {
            label: "فروش",
            onClick: () => navigate("/trade/sell"),
            icon: (
              <span className="text-blue1">
                <SendIcon />
              </span>
            ),
          },
          {
            label: "خرید",
            onClick: () => navigate("/trade/buy"),
            icon: (
              <span className="text-blue1">
                <ReceivedIcon />
              </span>
            ),
          },
        ]
      : []),
  ];

  const handleCurrencyChange = (value: "tether" | "toman") => {
    setSelectedCurrency(value);
  };

  const [balance, setBalance] = useState<WalletResponse | null>(null);

  async function getBalance() {
    try {
      const response = await apiRequest<WalletResponse>({
        url: "/api//dashboard/web",
        method: "GET",
      });
      setBalance(response);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  useEffect(() => {
    getBalance();
  }, []);

  const displayBalance =
    selectedCurrency === "tether"
      ? balance?.wallets.crypto?.balance
      : balance?.wallets.toman?.balance;

  return (
    <div>
      <div className="border border-gray21 rounded-xl p-6 shadow lg:w-full">
        <div className="flex items-center justify-between mb-7">
          <CurrencyToggle onChange={handleCurrencyChange} />
          <div
            className="flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-xl px-2 py-1"
            onClick={() => setStateBlure((prev) => !prev)}
          >
            <span className="w-[22px] h-[22px] text-gray-500 group-hover:text-gray-800">
              {stateBlure ? <VisibilityIcon /> : <IconEyeClosed />}
            </span>
            <span className=" text-black1 font-bold text-[18px]">
              موجودی کیف پول شما
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div
            className={`text-3xl flex items-center justify-center gap-3 font-bold text-black1 ${
              !stateBlure ? "blur-md" : ""
            }`}
            dir="rtl"
          >
            <span>{formatPersianDigits(displayBalance ?? "0")}</span>
            <span>{selectedCurrency === "tether" ? "تتر" : "تومان"}</span>
          </div>
        </div>

        <div className="flex gap-4 m-2">
          {actionButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className="flex-1 flex flex-col items-center justify-center rounded-lg border bg-gray27 border-gray21 p-3 text-sm text-black1 hover:border-blue2 hover:shadow-sm transition"
            >
              <div className="w-6 h-6 mb-1.5">{btn.icon}</div>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* مودال برداشت */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />

      {/* ✅ مودال واریز */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
};

export default WalletCard;
