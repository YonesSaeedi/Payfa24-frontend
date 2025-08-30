
import VisibilityIcon from "../../../assets/icons/Home/WalletCardIcon/VisibilityIcon";
import CurrencyToggle from "./CurrencyToggle";
import ChartIcon from "../../../assets/icons/Home/WalletCardIcon/chartIcon";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import WalletAdd from "../../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletMines from "../../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import ReceiptText from "../../../assets/icons/Home/WalletCardIcon/ReceiptTextIcon";
import { useState } from "react";

interface WalletCardProps {
  balance: number;
  currency?: string;
  changeAmount: number;
  change: number;
  onHistory?: () => void;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onSell?: () => void;
  onBuy?: () => void;
}

const WalletCard = ({
  balance,
  currency = "تومان",
  changeAmount,
  change,
  onHistory,
  onWithdraw,
  onDeposit,
  onSell,
  onBuy,
}: WalletCardProps) => {
  const isPositive = change >= 0;

  const actionButtons = [
    { label: "تاریخچه", onClick: onHistory, icon: <span className="text-blue1"><ReceiptText /></span> },
    { label: "برداشت", onClick: onWithdraw, icon: <span className="text-blue1"><WalletMines /></span> },
    { label: "واریز", onClick: onDeposit, icon: <span className="text-blue1"><WalletAdd /></span> },
    { label: "فروش", onClick: onSell, icon: <span className="text-blue1"> <SendIcon /></span> },
    { label: "خرید", onClick: onBuy, icon: <span className="text-blue1"><ReceivedIcon /></span> },
  ];

  const handleCurrencyChange = (value: "tether" | "toman") => {
    console.log("Selected currency:", value);
  };

  const [stateBlure, setStateBlure] = useState(true)

  return (
    <div className="c border border-gray21 rounded-xl p-6 shadow lg:w-[630px]">

      <div className="flex items-center justify-between mb-7">
        <CurrencyToggle onChange={handleCurrencyChange} />
        <div
          className="flex items-center gap-2 cursor-pointer 
             transition-all duration-300 
            
             rounded-xl px-2 py-1"
          onClick={() => setStateBlure(stateBlure => !stateBlure)}
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
        <p className={`text-3xl font-bold text-black1 ${!stateBlure ? "blur-sm" : ""}`} dir="rtl">
          <div className="flex"></div>
          {balance.toLocaleString()} {currency}
        </p>

        <div

          className={`mt-2 flex items-center justify-between text-sm ${
            isPositive ? "text-chart" : "text-red-500"
          }`}

        >
          <span className="flex items-center gap-1 pt-10 text-green4">
            {isPositive ? <span className="w-5 h-5"><ChartIcon /></span> : "↓"}{" "}
            {Math.abs(change).toFixed(1)}%
          </span>

          <span className="text-gray3 flex pt-10" dir="rtl">
            <p className="text-black1 pl-2">  {changeAmount.toLocaleString()} {currency}</p>
            تغییر در ۲۴ ساعت گذشته

          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-5 gap-4">
        {actionButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className="flex flex-col items-center justify-center rounded-lg border bg-gray27 border-gray21 p-[14px] text-sm text-black1 hover:bg-gray-50 hover:shadow-sm transition"
          >
            <div className="w-6 h-6 mb-[6px] ">{btn.icon}</div>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WalletCard;
