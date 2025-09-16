import { SendIcon } from "lucide-react";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import IconClose from "../../assets/Icons/Login/IconClose";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";

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

      <div className="relative bg-white w-full max-w-sm rounded-xl p-4 shadow-lg z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{name}</h2>
          <button onClick={onClose} className="text-gray-500 w-6 h-6 icon-wrapper"><IconClose/></button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => console.log("خرید", symbol)}
            className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2 rounded-md"
          >
          <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
  <span className="w-5 h-5 flex items-center justify-center">
    <ReceivedIcon />
  </span>
</span>

            خرید
          </button>
          <button
            onClick={() => console.log("فروش", symbol)}
            className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2 rounded-md"
          >
            <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
  <span className="w-5 h-5 flex items-center justify-center">
    <SendIcon />
  </span>
</span>

            فروش
          </button>
          <button className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2 rounded-md">
          <span className="w-10 h-10 bg-blue7 rounded-[8px] flex items-center justify-center text-blue2">
  <span className="w-5 h-5 flex items-center justify-center">
    <WalletMinesIcon/>
  </span>
</span>

            برداشت
          </button>
        </div>
      </div>
    </div>
  );
};
