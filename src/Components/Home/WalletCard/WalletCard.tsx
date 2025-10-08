import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "../../../assets/icons/Home/WalletCardIcon/VisibilityIcon";
import CurrencyToggle from "./CurrencyToggle";
import ChartIcon from "../../../assets/icons/Home/WalletCardIcon/chartIcon";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import WalletAdd from "../../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletMines from "../../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import ReceiptText from "../../../assets/icons/Home/WalletCardIcon/ReceiptTextIcon";
import WithdrawModal from "../../Withdrawal/WithdrawModal";

interface WalletCardProps {
  balance: number;
  currency?: string;
  changeAmount: number;
  change: number;
  showBuySell?: boolean;
}

const WalletCard = ({
  balance,
  currency = "تومان",
  changeAmount,
  change,
  showBuySell = true,
}: WalletCardProps) => {
  const [stateBlure, setStateBlure] = useState<boolean>(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const isPositive = change >= 0;
  

  const actionButtons = [
    {
      label: "تاریخچه",
      onClick: () => navigate("/history/crypto"),
      icon: <span className="text-blue1">
           <ReceiptText />
         </span>,
    },
    {
      label: "برداشت",
      onClick: () => setShowWithdrawModal(true),
      icon:   <span className="text-blue1">
         <WalletMines />
        </span>,
    },
    {
      label: "واریز",
      onClick: () => navigate("/kyc-basic"),
      icon:  <span className="text-blue1">
          <WalletAdd />
         </span>,
    },
    ...(showBuySell
      ? [
          {
            label: "فروش",
            onClick: () => navigate("/trade/sell"),
            icon:  <span className="text-blue1">
                 <SendIcon />
              </span>,
          },
          {
            label: "خرید",
            onClick: () => navigate("/trade/buy"),
            icon: <span className="text-blue1">
                 <ReceivedIcon />
             </span>,
          },
        ]
      : []),
  ];

  const handleCurrencyChange = (value: "tether" | "toman") => {
    console.log("Selected currency:", value);
  };

  return (
    <div>
      <div className="border border-gray21 rounded-xl p-6 shadow lg:w-[630px]">
      
        <div className="flex items-center justify-between mb-7">
          <CurrencyToggle onChange={handleCurrencyChange} />
          <div
            className="flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-xl px-2 py-1"
            onClick={() => setStateBlure((prev) => !prev)}
          >
            <span className="w-[22px] h-[22px] text-gray-500 group-hover:text-gray-800">
              <VisibilityIcon />
            </span>
            <span className="font-sans text-black1 text-base font-semibold">
              موجودی کیف پول شما
            </span>
          </div>
        </div>

       
        <div className="text-center mb-6">
          <p
            className={`text-3xl font-bold text-black1 ${
              !stateBlure ? "blur-md" : ""
            }`}
            dir="rtl"
          >
            {balance.toLocaleString()} {currency}
          </p>

          <div
            className={`mt-2 flex items-center justify-between text-sm ${
              isPositive ? "text-chart" : "text-red-500"
            }`}
          >
            <span className="flex items-center gap-1 pt-10 text-green4">
              {isPositive ? (
                <span className="w-5 h-5">
                  <ChartIcon />
                </span>
              ) : (
                "↓"
              )}
              {Math.abs(change).toFixed(1)}%
            </span>

            <span className="text-gray3 flex pt-10" dir="rtl">
              <p className="text-black1 pl-2">
                {changeAmount.toLocaleString()} {currency}
              </p>
              تغییر در۲۴ ساعت گذشته
            </span>
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


      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </div>
  );
};

export default WalletCard;