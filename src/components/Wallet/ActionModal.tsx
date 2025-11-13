import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import IconClose from "../../assets/icons/Login/IconClose";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import { ROUTES } from "../../routes/routes";
import { Link } from "react-router-dom";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";

type ActionModalProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  symbol: string;
};

export const ActionModal: React.FC<ActionModalProps> = ({ open, onClose, name, symbol }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

      <div className="relative bg-white8 w-full max-w-sm rounded-xl p-6 shadow-lg z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className=" text-[14px] font-medium ">{name}</h2>
          <button onClick={onClose} className="text-gray12 w-6 h-6 icon-wrapper hover:text-red6">
            <IconClose />
          </button>
        </div>
        <div className="flex flex-col gap-4 hover:text-blue2">
  <Link
  to={`${ROUTES.TRADE.BUY}?coin=${symbol}`}
 className="w-full  text-sm text-black1 flex items-center justify-between gap-2 rounded-md transition-colors"
>
  <div className="flex items-center gap-2  hover:text-blue2 text-[14px] font-medium ">
    <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
      <span className="w-5 h-5 flex items-center justify-center">
        <ReceivedIcon />
      </span>
    </span>
    خرید
  </div>
  <span className="w-5 h-5 flex items-center justify-center text-gray12">
    <IconArrowLeft/>
  </span>
</Link>
          <Link
            to={`${ROUTES.TRADE.SELL}?coin=${symbol}`}
          className="w-full text-sm text-black1  flex items-center justify-between gap-2 rounded-md transition-colors"

          >
            <div className="flex items-center gap-2 hover:text-blue2  text-[14px] font-medium ">
              <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
                <span className="w-5 h-5 flex items-center justify-center">
             <SendIcon />
                </span>
              </span>
              فروش
            </div>
            <span className="w-5 h-5 flex items-center justify-center text-gray12">
          <IconArrowLeft/>
            </span>
          </Link>

          {/* واریز */}
          <Link
            to={`${ROUTES.DEPOSIT}?coin=${symbol}`}
           className="w-full text-sm text-black1 flex items-center justify-between gap-2 rounded-md transition-colors"

          >
            <div className="flex items-center gap-2 hover:text-blue2  text-[14px] font-medium ">
              <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <WalletAddIcon />
                </span>
              </span>
              واریز
            </div>
            <span className="w-5 h-5 flex items-center justify-center text-gray12">
             <IconArrowLeft/>
            </span>
          </Link>

          <Link
            to={`/withdraw/crypto?coin=${symbol}`}
            className=" text-sm text-black1  flex items-center justify-between gap-2 rounded-md text-[14px] font-medium"
          >
            <div className="flex items-center gap-2 hover:text-blue2">
              <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <WalletMinesIcon />
                </span>
              </span>
              برداشت
            </div>
            <span className="w-5 h-5 flex items-center justify-center text-gray12 hover:text-blue2">
               <IconArrowLeft/>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
