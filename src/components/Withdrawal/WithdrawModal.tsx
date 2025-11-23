import { Link } from "react-router-dom";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import IconClose from "../../assets/icons/Login/IconClose";
import IconCurrency from "../../assets/icons/Withdrawal/IconCurrency";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import { ROUTES } from "../../routes/routes";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={onClose}>
      <div
        className="bg-white8 rounded-2xl px-4 pb-8 pt-4 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-b-gray2 mx-2 mb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-[4px] left-[4px] text-gray-500 hover:text-blue2 w-6 h-6 "
          >
            <IconClose />
          </button>

          <h2 className="text-lg font-bold text-black1 text-right px-2 pb-4">برداشت</h2>
        </div>

        <Link
         to={ROUTES.WITHDRAWAL.FIAT}
          className="flex items-center justify-between rounded-xl p-2 mb-4 hover:bg-gray27 cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <span className="w-6 h-6 icon-wrapper mr-2 hover:text-blue2 "><IconArrowLeft /></span>
            <span className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer">
              برداشت در لحظه
            </span> 
          </div>

          <div className="flex flex-row-reverse">
            <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
              <span className="w-8 h-8 icon-wrapper text-blue2"><WalletMinesIcon /></span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-black1 text-base font-medium">برداشت تومان</span>
              <span className="text-sm text-gray-500 pt-2">برداشت تومانی به کارت بانکی</span>
            </div>
          </div>
        </Link>

        {/* برداشت ارزی */}
        <Link
        to={ROUTES.WITHDRAWAL.CRYPTO}
          className="flex items-center justify-between rounded-[8px] p-2 hover:bg-gray27 cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <span className="w-6 h-6 icon-wrapper mr-2"><IconArrowLeft /></span>
            <span className="hidden lg:block text-gray17 text-sm border px-2 py-2 rounded-lg bg-gray27 border-gray21 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer">
              برداشت در ۲۰ دقیقه
            </span>
          </div>

          <div className="flex flex-row-reverse">
            <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
              <span className="w-8 h-8 icon-wrapper text-blue2"><IconCurrency /></span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-black1 text-base font-medium">برداشت ارز</span>
              <span className="text-sm text-gray-500 pt-2">برداشت از کیف پول از طریق شبکه بلاکچین</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WithdrawModal;
