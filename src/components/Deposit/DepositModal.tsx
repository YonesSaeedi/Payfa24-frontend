import React from "react";
import { useNavigate } from "react-router-dom";
import IconClose from "../../assets/icons/Login/IconClose";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import IconBank from "../../assets/icons/Deposit/IconBank";
import IconIDentifier from "../../assets/icons/Deposit/Deposit/IconIDentifier";
import IconConvertCard from "../../assets/icons/Deposit/IconConvertCard";
import IconReceipt from "../../assets/icons/Deposit/Deposit/IconReceipt";
import IconWallet from "../../assets/icons/Deposit/IconWallet";
import IconLink from "../../assets/icons/Deposit/IconLink";

type DepositMethods = {
  gateway: { isDisable: boolean; isHidden: boolean };
  gatewayId: { isDisable: boolean; isHidden: boolean };
  card: { isDisable: boolean; isHidden: boolean };
  receipt: { isDisable: boolean; isHidden: boolean };
};

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositMethods: DepositMethods | null | undefined;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, depositMethods }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goToDeposit = (type: string) => {
    onClose();
    navigate(`/deposit?type=${type}`);
  };

  const methods = [
    { type: "gateway", key: "gateway" as const, title: "واریز با درگاه پرداخت", description: "واریز حداکثر تا ۲۵ میلیون تومان", buttonText: "پرداخت در لحظه" },
    { type: "identifier", key: "gatewayId" as const, title: "واریز با شناسه", description: "واریز وجه به صورت نامحدود", buttonText: "پرداخت در ۲۰ دقیقه" },
    { type: "card", key: "card" as const, title: "واریز کارت به کارت", description: "واریز تا سقف ۲۰۰ میلیون تومان", buttonText: "پرداخت در ۱۰ دقیقه" },
    { type: "receipt", key: "receipt" as const, title: "فیش بانکی", description: "واریز وجه به صورت نامحدود", buttonText: "پرداخت در ۲۰ دقیقه" },
    { type: "wallet", key: null, title: "واریز با ولت اختصاصی", description: "سریع‌ترین روش واریز ارز", buttonText: "واریز خودکار و سریع" },
    { type: "txid", key: null, title: " TXID واریز با", description: "برای واریز از سایر کیف پول‌ها", buttonText: "واریز دستی" },
  ];

  const fiatMethods = methods.slice(0, 4);
  const cryptoMethods = methods.slice(4, 6);

  const renderMethod = (method: (typeof methods)[0], isCrypto: boolean = false) => {
    if (!depositMethods || isCrypto) {
      return (
        <div key={method.type} className="flex items-center justify-between rounded-xl p-2 hover:bg-gray27 transition cursor-pointer" onClick={() => goToDeposit(method.type)}>
          <div className="flex items-center gap-3">
            <span className="lg:w-5 lg:h-5 w-[18px] h-[18px] icon-wrapper">
              <IconArrowLeft />
            </span>

            {/* فقط برای روش‌های تومانی دکمه نشون بده */}
            {method.key !== null && (
              <button className="hidden lg:block text-sm border border-gray21 rounded-lg px-3 py-1.5 mr-8 bg-gray27 text-gray5 hover:border-blue2 hover:text-blue2 transition-all">
                {method.buttonText}
              </button>
            )}
          </div>

          <div className="flex flex-row-reverse items-center gap-3">
            <div className="lg:w-[52px] lg:h-[52px] w-10 h-10 rounded-[8px] flex items-center justify-center bg-blue14">
              <span className="icon-wrapper lg:w-7 lg:h-7 w-[22px] h-[22px] text-blue2">
                {method.type === "gateway" && <IconBank />}
                {method.type === "identifier" && <IconIDentifier />}
                {method.type === "card" && <IconConvertCard />}
                {method.type === "receipt" && <IconReceipt />}
                {method.type === "wallet" && <IconWallet />}
                {method.type === "txid" && <IconLink />}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-medium text-black1 lg:text-base text-xs">{method.title}</span>
              <span className="lg:text-xs text-[10px] text-gray5 pt-1">{method.description}</span>
            </div>
          </div>
        </div>
      );
    }

    const status = depositMethods[method.key!];
    const isHidden = status?.isHidden === true;
    const isDisabled = status?.isDisable === true;

    if (isHidden) return null;

    return (
      <div
        key={method.type}
        className={`flex items-center justify-between rounded-xl p-2 transition-all duration-200 ${
          isDisabled ? "opacity-60 pointer-events-none" : "hover:bg-gray27 cursor-pointer"
        }`}
        onClick={() => !isDisabled && goToDeposit(method.type)}
      >
        <div className="flex items-center gap-3">
          <span className="lg:w-5 lg:h-5 w-[18px] h-[18px] icon-wrapper">
            <IconArrowLeft />
          </span>

          {/* فقط برای ارز های تومانی دکمه نشون بده */}
          {method.key !== null && (
            <button
              className={`hidden lg:block text-sm border rounded-lg px-3 py-1.5 mr-8 transition-all ${
                isDisabled ? "border-gray21 text-gray5 bg-gray-100" : "border-gray21 bg-gray27 text-gray5 hover:border-blue2 hover:text-blue2"
              }`}
            >
              {isDisabled ? "به زودی" : method.buttonText}
            </button>
          )}
        </div>

        <div className="flex flex-row-reverse items-center gap-3">
          <div
            className={`lg:w-[52px] lg:h-[52px] w-10 h-10 rounded-[8px] flex items-center justify-center transition-all ${
              isDisabled ? "bg-gray21 border border-gray5 opacity-45" : "bg-blue14"
            }`}
          >
            <span className={`icon-wrapper lg:w-7 lg:h-7 w-[22px] h-[22px] ${isDisabled ? "text-gray5" : "text-blue2"}`}>
              {method.type === "gateway" && <IconBank />}
              {method.type === "identifier" && <IconIDentifier />}
              {method.type === "card" && <IconConvertCard />}
              {method.type === "receipt" && <IconReceipt />}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className={`font-medium lg:text-base text-xs ${isDisabled ? "text-gray5" : "text-black0"}`}>{method.title}</span>
            <span className="lg:text-xs text-[10px] text-gray5 pt-1 font-normal">{method.description}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white8 rounded-2xl px-4 pb-8 mx-4 lg:mx-1 pt-4 shadow-lg relative w-[550px] pointer-events-auto">
        <div className="border-b border-b-gray2 mx-2 mb-4">
          <button onClick={onClose} className="absolute top-4 left-5 text-gray5 hover:text-blue2 w-6 h-6">
            <IconClose />
          </button>
          <h2 className="lg:text-lg text-sm font-medium text-black1 text-right px-2 pb-4">واریز</h2>
        </div>

        <div className="flex flex-col gap-6">
          {/* واریز تومانی */}
          <div>
            <p className="lg:text-sm text-xs font-medium text-black0 mb-3 px-2 text-right">واریز تومانی</p>
            <div className="flex flex-col gap-4">{fiatMethods.map((m) => renderMethod(m, false))}</div>
          </div>

          {/* واریز رمز ارز */}
          <div>
            <p className="lg:text-sm text-xs font-medium text-black0 mb-3 px-2 text-right">واریز رمز ارز</p>
            <div className="flex flex-col gap-4">{cryptoMethods.map((m) => renderMethod(m, true))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
