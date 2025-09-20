import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import IconBank from "../../assets/Icons/Deposit/IconBank";
import IconConvertCard from "../../assets/Icons/Deposit/IconConvertCard";
import IconMoneyTime from "../../assets/Icons/Deposit/IconMoneyTime";
import IconWallet from "../../assets/Icons/Deposit/IconWallet";
import IconLink from "../../assets/Icons/Deposit/IconLink";
import IconArrowRight from "../../assets/Icons/Deposit/IconArrowRight";

import DepositForm from "../../Components/Deposit/DepositForm";
import CardToCardTransfer from "../../Components/Deposit/CardToCardTransfer";
import WalletDeposit from "../../Components/Deposit/WalletDeposit";
import DepositWithTxID from "../../Components/Deposit/DepositWithTxID";
export default function DepositPage() {
  const [step, setStep] = useState<number>(1); 
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

  const handleStart = () => {
    setStarted(true);
  };

  const depositFormMessages = [
    " سقف خرید و فروش از این بخش 5 میلیون تومان است",
    " کارمزد پی‌فا 24 برای معاملات آسان همیشه 0 است",
  ];
  const cardTransferMessages = [
    "کارت به کارت فقط از مبداهای بالا امکان پذیر است",
  ];

 let currentAlertMessages = [];
if (selectedOption === "closeDeal") {
  currentAlertMessages = depositFormMessages;
} else if (selectedOption === "goodTrip") {
  currentAlertMessages = cardTransferMessages;
}
  // می‌توانید برای گزینه‌های دیگر هم شرط اضافه کنید
  // else if (selectedOption === "goto") {
  //   currentAlertMessages = [...];
  // }

  // گزینه‌های ثابت بخش راست
  const rightOptions = [
    {
      id: "closeDeal",
      Icon: <IconBank />,
      Title: "واریز با درگاه پرداخت",
      description: "واریز حداکثر تا 25 ملیون تومان",
      button: "پرداخت در لحظه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "goodTrip",
      Icon: <IconConvertCard />,
      Title: "واریز با فیش کارت به کارت  ",
      description: "واریز تا سقف 10 ملیون تومان",
      button: "پرداخت در 20 دقیقه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "goto",
      Icon: <IconMoneyTime />,
      Title: "واریز خودکار",
      description: "واریز مداوم با دسترسی تا 25 ملیون تومان",
      button: "پرداخت در لحظه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "trade",
      Icon: <IconWallet />,
      Title: "واریز با ولت اختصاصی",
      description: "بدون نیاز به TxID , واریز خودکار و سریع",
      button: "",
      IconMore: <IconArrowRight />,
    },
    {
      // id: "trade",
      Icon: <IconLink />,
      Title: "واریز با TxID",
      description: "برای واریز از صرافی با کیف پول دیگر",
      button: "",
      IconMore: <IconArrowRight />,
    },
  ];

  const renderStep = () => {
    switch (selectedOption) {
      case "closeDeal":
        return <DepositForm />;
      case "goodTrip":
        return <CardToCardTransfer />;
      case "goto":
        return <></>;
      case "trade":
        return <WalletDeposit />;
      default:
        return <DepositWithTxID />;
    }
  };

  return (
    <>
      <HeaderLayout>
        <DepositLayout
          step={step}
          started={started}
          onStart={handleStart}
          alertMessages={currentAlertMessages}
        >
          {/* بخش راست - ثابت */}
          <div
            className="w-full overflow-y-auto h-full lg:block hidden"
            dir="rtl"
          >
            <span className="text-base text-black0  mb-4">واریز تومان</span>
            {rightOptions.slice(0, 3).map((option) => (
              <div
                key={option.id}
                className="p-2 cursor-pointer "
                onClick={() => setSelectedOption(option.id)}
              >
                <div className={`flex items-center rounded-lg gap-2 justify-between border p-3 transition-all duration-200
                    ${
                      selectedOption === option.id
                        ? "border-blue2"
                        : "border-gray50"
                    }
                  `}>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="bg-blue14 p-3 rounded-lg bg">
                        <span className="icon-wrapper w-7 h-7 text-blue2">
                          {option.Icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-black0">
                          {option.Title}
                        </h2>
                        <p className="text-sm text-gray5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="border text-gray5 border-gray26 p-2 rounded-lg">
                      {option.button}
                    </button>
                    <span className="icon-wrapper w-5 h-5 text-gray5">
                      {option.IconMore}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <p className="mt-8 mb-4 text-black0 font-medium">واریز ارز</p>

            {rightOptions.slice(3, 5).map((option) => (
              <div
                key={option.id}
                className="p-2 cursor-pointer"
                onClick={() => setSelectedOption(option.id)}
              >
                    <div
                  className={`flex items-center rounded-lg gap-2 justify-between border p-3 transition-all duration-200
                    ${
                      selectedOption === option.id
                        ? "border-blue2"
                        : "border-gray50"
                    }
                  `}
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="bg-blue14 p-3 rounded-lg bg">
                        <span className="icon-wrapper w-7 h-7 text-blue2">
                          {option.Icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-black0">
                          {option.Title}
                        </h2>
                        <p className="text-sm text-gray5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="icon-wrapper w-5 h-5 text-gray5">
                      {option.IconMore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* بخش چپ - متغیر */}
          <div className="w-full">{renderStep()}</div>
        </DepositLayout>
      </HeaderLayout>
    </>
  );
}
