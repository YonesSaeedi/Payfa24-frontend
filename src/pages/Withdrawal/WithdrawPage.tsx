import React, { useEffect, useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconWarning from "../../assets/icons/trade/IconWarning";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import WithdrawForm from "../../components/Withdrawal/WithdrawForm";
import CryptoWithdrawForm from "../../components/Withdrawal/CryptoWithdrawForm";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import IconCurrency from "../../assets/icons/Withdrawal/IconCurrency";
import {  useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { useLocation } from "react-router-dom";

const WithdrawPage: React.FC = () => {
  const [, setShowBox] = useState(false);
  const [withdrawType, setWithdrawType] = useState<"fiat" | "crypto">("fiat");
  const navigate = useNavigate();

  // 🔹 state برای هشدارها
  const [alertList, setAlertList] = useState<string[]>([
    "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.",
    "سقف مجاز هر برداشت ۱۰۰ میلیون تومان است.",
    "سقف مجاز هر برداشت برای هر شماره شبا ۲۰۰ میلیون می‌باشد.",
  ]);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("crypto")) {
      setWithdrawType("crypto");
    } else {
      setWithdrawType("fiat");
    }
  }, [location.pathname]);

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12 pt-6">
            <BreadcrumbNavigation />

            <div className="bg-white1 rounded-[16px] lg:shadow-[0_0_12px_0_#00000029] p-6 flex flex-col flex-col-reverse lg:flex-row pt-8 mb-9">
              {/* فرم اصلی */}
              <div className="flex-1 lg:p-8 pt-8 ">
                {withdrawType === "fiat" ? (
                  <div>
                    <WithdrawForm />
                     <div
                  dir="rtl"
                  className="bg-orange5 rounded-xl p-4 text-sm text-left w-full mt-6"
                >
                  <h3 className="text-orange1 flex items-left gap-1 mb-2">
                    <span dir="rtl" className="w-5 h-5 text-orange1">
                      <IconWarning />
                    </span>
                    توجه داشته باشید
                  </h3>

                  <ul className="list-disc list-inside text-black1 space-y-1 p-1">
                    {alertList.map((alert, index) => (
                      <li key={index} className="text-right">
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
                  </div>
                
                ) : (
                  <div >
                     <CryptoWithdrawForm />
                       {/* هشدارها */}
                <div
                  dir="rtl"
                  className="bg-orange5 rounded-xl p-4 text-sm text-left w-full mt-6"
                >
                  <h3 className="text-orange1 flex items-left gap-1 mb-2">
                    <span dir="rtl" className="w-5 h-5 text-orange1">
                      <IconWarning />
                    </span>
                    توجه داشته باشید
                  </h3>

                  <ul className="list-disc list-inside text-black1 space-y-1 p-1">
                    {alertList.map((alert, index) => (
                      <li key={index} className="text-right">
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
                  </div>
                )}
              </div>

              {/* بخش سمت راست */}
              <div className="lg:flex-1 flex flex-col gap-6  p-8 ">
       
                {/* انتخاب نوع برداشت */}
             {/* انتخاب نوع برداشت */}
<div className="hidden lg:flex flex-col gap-10">
  {/* پرداخت در لحظه */}
  <div>
    <span className="flex justify-end mb-4 text-black1">برداشت تومان</span>

    <div
      className={`flex items-center justify-between rounded-xl p-4 mb-1 cursor-pointer border transition-all duration-300 ${
        withdrawType === "fiat"
          ? "border-blue-500 light:bg-blue-50 shadow-md"
          : "border-gray21 hover:border-blue2"
      }`}
      onClick={() => {
        setWithdrawType("fiat");
        setShowBox(false);
        navigate(ROUTES.WITHDRAWAL_FIAT);
        setAlertList([
          "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.",
          "سقف مجاز هر برداشت ۱۰۰ میلیون تومان است.",
          "سقف مجاز هر برداشت برای هر شماره شبا ۲۰۰ میلیون می‌باشد.",
        ]);
      }}
    >
      <div className="flex items-center justify-center">
        <span className="w-6 h-6 icon-wrapper mr-2">
          <IconArrowLeft />
        </span>

        <button
          className={`text-sm border rounded-[8px] px-2 py-1.5 transition-all duration-300 ${
            withdrawType === "fiat"
              ? "bg-blue-400 text-white border-blue-500 shadow"
              : "text-gray5 border-gray21 bg-gray27 hover:border-blue2 hover:text-blue2"
          }`}
        >
          پرداخت در لحظه
        </button>
      </div>

      <div className="flex flex-row-reverse">
        <div
          className="w-[52px] h-[52px] ml-2 rounded-[8px] flex items-center justify-center transition-all duration-300 bg-blue14
          "
        >
          <span
           className="w-6 h-6 icon-wrapper text-blue-600">
            <WalletMinesIcon />
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-black1">برداشت تومانی</span>
          <span className="text-sm text-gray-500 mt-2">
            برداشت تومانی به کارت بانکی
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* پرداخت در ۲۰ دقیقه */}
  <div>
    <span className="flex justify-end mb-4 text-black1">برداشت ارز</span>

    <div
      className={`flex items-center justify-between rounded-xl p-4 cursor-pointer border transition-all duration-300 ${
        withdrawType === "crypto"
          ? "border-blue-500  shadow-md"
          : "border-gray21 hover:border-blue2"
      }`}
      onClick={() => {
        setWithdrawType("crypto");
        setShowBox(true);
        setAlertList(["لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید."]);
         navigate(ROUTES.WITHDRAWAL_CRYPTO);
      }}
    >
      <div className="flex items-center justify-center">
        <span className="w-6 h-6 icon-wrapper mr-2">
          <IconArrowLeft />
        </span>

        <button
          className={`text-sm border rounded-[8px] px-2 py-1.5 transition-all duration-300 ${
            withdrawType === "crypto"
              ? "bg-blue-400 text-white border-blue-500 shadow"
              : "text-gray5 border-gray21 bg-gray27 hover:border-blue2 hover:text-blue2"
          }`}
        >
          پرداخت در ۲۰ دقیقه
        </button>
      </div>

      <div className="flex flex-row-reverse">
        <div
          className="w-[52px] h-[52px] ml-2 rounded-[8px] flex items-center justify-center transition-all duration-300 bg-blue14"
        >
          <span
          className="w-6 h-6 icon-wrapper"
          >
            <IconCurrency />
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-black1">برداشت ارز</span>
          <span className="text-sm text-gray-500 mt-2">
            برداشت از کیف پول از طریق شبکه بلاکچین
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
};

export default WithdrawPage;
