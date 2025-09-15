import React from "react";
import { useNavigate } from "react-router-dom"; 
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import IconClose from "../../assets/Icons/Login/IconClose";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  const handleInstantWithdraw = () => {
    onClose();
    navigate("/withdrawal"); 
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl  p-4 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-black w-6 h-6"
        >
          <IconClose />
        </button>

        <h2 className="text-lg font-bold mb-6 text-right">برداشت</h2>

        {/* برداشت تومانی */}
        <div className="flex items-center justify-between rounded-xl p-4 mb-4 cursor-pointer hover:bg-gray-50">
          <button
            onClick={handleInstantWithdraw}
            className="text-blue-500 border border-gray21 rounded-lg px-4 py-2 font-medium"
          >
            برداشت در لحظه
          </button>

          <div className="flex flex-row-reverse">
            <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded flex items-center justify-center">
              <span className="w-6 h-6 icon-wrapper text-blue2">
                <WalletMinesIcon />
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-semibold">برداشت تومان</span>
              <span className="text-sm text-gray-500">
                برداشت تومانی به کارت بانکی
              </span>
            </div>
          </div>
        </div>

        {/* برداشت ارز */}
        <div className="flex items-center justify-between rounded-xl p-4 cursor-pointer hover:bg-gray-50">
          <span className="text-blue-500 font-medium border px-4 py-2 rounded-lg">
            برداشت در ۲۰ دقیقه
          </span>

          <div className="flex flex-row-reverse">
            <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded flex items-center justify-center">
              <span className="w-6 h-6 icon-wrapper text-blue2">
                <WalletMinesIcon />
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-semibold">برداشت ارز</span>
              <span className="text-sm text-gray-500">
                برداشت از کیف پول از طریق شبکه بلاکچین
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
