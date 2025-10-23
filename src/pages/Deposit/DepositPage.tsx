import { useEffect, useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import IconBank from "../../assets/icons/Deposit/IconBank";
import IconConvertCard from "../../assets/icons/Deposit/IconConvertCard";
import IconWallet from "../../assets/icons/Deposit/IconWallet";
import IconLink from "../../assets/icons/Deposit/IconLink";

import DepositForm from "../../components/Deposit/DepositForm";
import CardToCardTransfer from "../../components/Deposit/CardToCardTransfer";
import DepositWithTxID from "../../components/Deposit/DepositWithTxID";

import { apiRequest } from "../../utils/apiClient";
import DepositDedicatedWallet from "../../components/Deposit/DepositDedicatedWallet";

import DepositwithIdentifier from "../../components/Deposit/DepositWithIdentifier";
import DepositBankReceipt from "../../components/Deposit/DepositBankReceipt";
import IconIDentifier from "../../assets/icons/Deposit/Deposit/IconIDentifier";
import IconReceipt from "../../assets/icons/Deposit/Deposit/IconReceipt";
import IconArrowRight from "../../assets/Icons/Deposit/IconArrowRight";

interface DepositPageProps {
  selected?: "gateway" | "identifier" | "card" | "receipt" | "wallet" | "txid";
}

export default function DepositPage({
  selected = "gateway",
}: DepositPageProps) {
  const [step, _setStep] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);
  const [_fiatData, setFiatData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    switch (selected) {
      case "identifier":
        return "Identifier";
      case "card":
        return "CardToCard";
      case "receipt":
        return "Bank Receipt:";
      case "wallet":
        return "DedicatedWallet";
      case "txid":
        return "DepositWithTxID";
      default:
        return "closeDeal"; // gateway
    }
  });

  const handleStart = () => {
    setStarted(true);
  };

  const depositFormMessages = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید، چراکه درصورت بروز هرگونه مشکل احتمالی، مسئولیت قضایی ناشی از این امر به عهده کاربر است و ارز هشت مسئولیتی در این زمینه ندارد.",
    "جهت واریز وجه، حتما باید از کارت‌های بانکی به نام خودتان که در بخش کاربری ثبت و تایید شده است، استفاده نمایید.",
  ];
  const DepositWithIdentifier = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید، چراکه درصورت بروز هرگونه مشکل احتمالی، مسئولیت قضایی ناشی از این امر به عهده کاربر است و ارز هشت مسئولیتی در این زمینه ندارد.",
    "کارمزد واریز با شناسه: %0.05 مبلغ واریزی میباشد.برای مثال اگر مبلغ واریزی، صد میلیون تومان باشد، کارمزد 0.05 درصد آن معادل 50 هزار تومان خواهد بود",
  ];

  let currentAlertMessages: string[] = [];

  if (selectedOption === "closeDeal") {
    currentAlertMessages = depositFormMessages;
  } else if (selectedOption === "Identifier") {
    currentAlertMessages = DepositWithIdentifier;
  } else if (selectedOption === "goodTrip") {
    // currentAlertMessages = cardTransferMessages;
  }

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
      id: "Identifier",
      Icon: <IconIDentifier />,
      Title: "واریز با شناسه",
      description: "واریز وجه به صورت نامحدود",
      button: " پرداخت در 20 دقیقه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "CardToCard",
      Icon: <IconConvertCard />,
      Title: "واریز  کارت به کارت  ",
      description: "واریز تا سقف 10 ملیون تومان",
      button: "پرداخت در 20 دقیقه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "Bank Receipt:",
      Icon: <IconReceipt />,
      Title: "فیش بانکی ",
      description: "واریز وجه به صورت نامحدود",
      button: " پرداخت در 20 دقیقه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "DedicatedWallet",
      Icon: <IconWallet />,
      Title: "واریز با ولت اختصاصی",
      description: "بدون نیاز به TxID , واریز خودکار و سریع",
      button: "",
      IconMore: <IconArrowRight />,
    },
    {
      id: "DepositWithTxID",
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
      case "Identifier":
        return <DepositwithIdentifier />;
      case "CardToCard":
        return <CardToCardTransfer />;
      case "Bank Receipt:":
        return (
          <DepositBankReceipt
            onNext={() => {}}
            onFileChange={() => {}}
            initialPreviewUrl=""
          />
        );
      case "DedicatedWallet":
        return <DepositDedicatedWallet />;
      case "DepositWithTxID":
        return <DepositWithTxID />;
      default:
        return <DepositForm />;
    }
  };

  useEffect(() => {
    const fetchFiatData = async () => {
      try {
        const response = await apiRequest({
          url: "/api/wallets/fiat",
          method: "GET",
          params: { withdraw: null },
        });
        setFiatData(response);
      } catch (err: any) {
        console.error("Error fetching fiat data:", err.response?.data || err);
      } finally {
        // setLoading(false);
      }
    };

    fetchFiatData();
  }, []);
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
            <span className="text-base text-black0 mb-4">واریز تومان</span>
            {rightOptions.slice(0, 4).map((option) => (
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

            {rightOptions.slice(4, 6).map((option) => (
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
          <div className="w-full ">{renderStep()}</div>
        </DepositLayout>
      </HeaderLayout>
    </>
  );
}
