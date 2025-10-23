import React from "react";
import { useNavigate } from "react-router-dom";
import IconClose from "../../assets/icons/Login/IconClose";
import { ROUTES } from "../../routes/routes";
import IconBank from "../../assets/icons/Deposit/IconBank";
import IconIDentifier from "../../assets/icons/Deposit/Deposit/IconIDentifier";
import IconConvertCard from "../../assets/icons/Deposit/IconConvertCard";
import IconReceipt from "../../assets/icons/Deposit/Deposit/IconReceipt";
import IconWallet from "../../assets/icons/Deposit/IconWallet";
import IconLink from "../../assets/icons/Deposit/IconLink";
import IconArrowLeft from "../../assets/icons/ProfileMenue/IconArrowLeft";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // 👉 هندلرها
  const handleDepositGateway = () => {
    onClose();
    navigate(ROUTES.DEPOSIT);
  };

  const handleDepositIdentifier = () => {
    onClose();
    navigate(ROUTES.DEPOSIT_IDENTIFIER);
  };

  const handleDepositCard = () => {
    onClose();
    navigate(ROUTES.DEPOSIT_CARD);
  };

  const handleDepositBankReceipt = () => {
    onClose();
    navigate(ROUTES.DEPOSIT_RECEIPT);
  };

  const handleDepositWallet = () => {
    onClose();
    navigate(ROUTES.DEPOSIT_WALLET);
  };

  const handleDepositTxid = () => {
    onClose();
    navigate(ROUTES.DEPOSIT_TXID);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white8 rounded-2xl px-4 pb-8 pt-4 shadow-lg relative w-[550px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-b-gray2 mx-2 mb-4">
          <button
            onClick={onClose}
            className="absolute top-4 left-5 text-gray-500 hover:text-blue2 w-6 h-6"
          >
            <IconClose />
          </button>

          <h2 className="text-lg font-bold text-black1 text-right px-2 pb-4">
            واریز
          </h2>
        </div>

        {/* واریز تومان */}
        <div className="flex flex-col gap-4">
          {/* درگاه پرداخت */}
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
            <div className="flex items-center">
              <span className="w-6 h-6 icon-wrapper mr-2">
                <IconArrowLeft />
              </span>
              <button
                onClick={handleDepositGateway}
                className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
              >
                پرداخت در لحظه
              </button>
            </div>

            <div className="flex flex-row-reverse">
              <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                <span className="icon-wrapper w-7 h-7 text-blue2">
                      <IconBank />
                </span>
              
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold text-black1">واریز با درگاه پرداخت</span>
                <span className="text-sm text-gray-500 pt-2">
                  واریز حداکثر تا ۲۵ میلیون تومان
                </span>
              </div>
            </div>
          </div>

          {/* واریز با شناسه */}
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
            <div className="flex items-center">
              <span className="w-6 h-6 icon-wrapper mr-2">
                <IconArrowLeft/>
              </span>
              <button
                onClick={handleDepositIdentifier}
                className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
              >
                پرداخت در ۲۰ دقیقه
              </button>
            </div>

            <div className="flex flex-row-reverse">
              <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                  <span className="icon-wrapper w-7 h-7 text-blue2">
                     <IconIDentifier />
                  </span>
             
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold text-black1">واریز با شناسه</span>
                <span className="text-sm text-gray-500 pt-2">
                  واریز وجه به صورت نامحدود
                </span>
              </div>
            </div>
          </div>

          {/* کارت به کارت */}
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
            <div className="flex items-center">
              <span className="w-6 h-6 icon-wrapper mr-2">
                <IconArrowLeft />
              </span>
              <button
                onClick={handleDepositCard}
                className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
              >
                پرداخت در ۲۰ دقیقه
              </button>
            </div>

            <div className="flex flex-row-reverse">
              <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                 <span className="icon-wrapper w-7 h-7 text-blue2">
                      <IconConvertCard />
                  </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold text-black1">واریز کارت به کارت</span>
                <span className="text-sm text-gray-500 pt-2">
                  واریز تا سقف ۲۵ میلیون تومان
                </span>
              </div>
            </div>
          </div>

          {/* فیش بانکی */}
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
            <div className="flex items-center">
              <span className="w-6 h-6 icon-wrapper mr-2">
                <IconArrowLeft />
              </span>
              <button
                onClick={handleDepositBankReceipt}
                className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
              >
                پرداخت در ۲۰ دقیقه
              </button>
            </div>

            <div className="flex flex-row-reverse">
              <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                <span className="icon-wrapper w-7 h-7 text-blue2">
                     <IconReceipt />
                  </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold text-black1">فیش بانکی</span>
                <span className="text-sm text-gray-500 pt-2">
                  واریز وجه به صورت نامحدود
                </span>
              </div>
            </div>
          </div>

          {/* واریز رمزارز */}
          <div className="border-t border-gray2 pt-4 mt-2">
            {/* والت اختصاصی */}
            <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
              <div className="flex items-center">
                <span className="w-6 h-6 icon-wrapper mr-2">
                  <IconArrowLeft />
                </span>
                <button
                  onClick={handleDepositWallet}
                  className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
                >
                  واریز خودکار و سریع
                </button>
              </div>

              <div className="flex flex-row-reverse">
                <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                
                <span className="icon-wrapper w-7 h-7 text-blue2">
                     <IconWallet />
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-semibold text-black1">واریز با والت اختصاصی</span>
                  <span className="text-sm text-gray-500 pt-2">
                    سریع‌ترین روش واریز ارز
                  </span>
                </div>
              </div>
            </div>

            {/* TxID */}
            <div className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition">
              <div className="flex items-center">
                <span className="w-6 h-6 icon-wrapper mr-2">
                  <IconArrowLeft />
                </span>
                <button
                  onClick={handleDepositTxid}
                  className="hidden lg:block text-gray17 border border-gray21 rounded-[8px] px-2 py-2 text-sm bg-gray27 mr-10 hover:border-blue2 hover:text-blue2 cursor-pointer"
                >
                  پرداخت در ۲۰ دقیقه
                </button>
              </div>

              <div className="flex flex-row-reverse">
                <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                   <span className="icon-wrapper w-7 h-7 text-blue2">
                   <IconLink />
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-semibold text-black1">واریز با TxID</span>
                  <span className="text-sm text-gray-500 pt-2">
                    برای واریز از سایر کیف پول‌ها
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DepositModal;
