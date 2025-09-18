import React, { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconWarning from "../../assets/icons/trade/IconWarning";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
import WithdrawForm from "../../Components/Withdrawal/WithdrawForm";
import CryptoWithdrawForm from "../../Components/Withdrawal/CryptoWithdrawForm";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import IconCurrency from "../../assets/icons/Withdrawal/IconCurrency";

const WithdrawPage: React.FC = () => {
  const [showBox, setShowBox] = useState(false);
  const [withdrawType, setWithdrawType] = useState<"fiat" | "crypto">("fiat");

  // 🔹 state برای هشدارها
  const [alertList, setAlertList] = useState<string[]>([
    "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.",
    "سقف مجاز هر برداشت ۱۰۰ میلیون تومان است.",
    "سقف مجاز هر برداشت برای هر شماره شبا ۲۰۰ میلیون می‌باشد.",
  ]);

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12 pt-6">
            <BreadcrumbNavigation />

            <div className="bg-white1 rounded-[16px] lg:shadow-[0_0_12px_0_#00000029] p-6 flex flex-col flex-col-reverse lg:flex-row pt-8 mb-9">
              {/* فرم اصلی */}
              <div className="flex-1 lg:p-8 pt-8">
                {withdrawType === "fiat" ? (
                <WithdrawForm />
                ) : (
                  <CryptoWithdrawForm />
                )}
              </div>

              {/* بخش سمت راست */}
              <div className="lg:flex-1 flex flex-col gap-6  pt-8 ">
                {/* هشدارها */}
                <div
                  dir="rtl"
                  className="bg-orange5 rounded-xl p-4 text-sm text-left w-full "
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

                {/* انتخاب نوع برداشت */}
                <div className="hidden lg:flex flex-col gap-4">
                  {/* پرداخت در لحظه */}
                  <div
                    className="flex items-center justify-between rounded-xl p-4 mb-1 cursor-pointer border border-gray21 hover:border-blue2 transition"
                    onClick={() => {
                      setWithdrawType("fiat");
                      setShowBox(false);
                      // 🔹 برگشت به حالت هشدار پیش‌فرض
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
                      <button className="text-gray5 border border-gray21 rounded-[8px] px-2 py-1.5 bg-gray27 text-sm hover:border-blue2 hover:text-blue2">
                        پرداخت در لحظه
                      </button>
                    </div>

                    <div className="flex flex-row-reverse">
                      <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                        <span className="w-6 h-6 icon-wrapper text-blue2">
                          <WalletMinesIcon />
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-black1">برداشت تومان</span>
                        <span className="text-sm text-gray-500">
                          برداشت تومانی به کارت بانکی
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* پرداخت در ۲۰ دقیقه */}
                  <div
                    className="flex items-center justify-between rounded-xl p-4 cursor-pointer border border-gray21 hover:border-blue2 transition"
                    onClick={() => {
                      setWithdrawType("crypto");
                      setShowBox(!showBox);
                      // 🔹 تغییر هشدارها به یک آیتم
                      setAlertList([
                        "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.",
                      ]);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <span className="w-6 h-6 icon-wrapper mr-2">
                        <IconArrowLeft />
                      </span>
                      <span className="text-gray5 border border-gray21 rounded-[8px] px-2 py-1.5 bg-gray27 text-sm hover:border-blue2 hover:text-blue2">
                        پرداخت در ۲۰ دقیقه
                      </span>
                    </div>

                    <div className="flex flex-row-reverse">
                      <div className="w-[52px] h-[52px] ml-2 bg-blue14 rounded flex items-center justify-center">
                        <span className="w-6 h-6 icon-wrapper text-blue2">
                          <IconCurrency />
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-black1">برداشت ارز</span>
                        <span className="text-sm text-gray-500">
                          برداشت از کیف پول از طریق شبکه بلاکچین
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* جزئیات سطح ۱ وقتی showBox فعال است */}
                  {showBox && (
                    <div className="border border-gray21 rounded-xl p-4 mt-2 text-right">
                      <p className="font-semibold mb-2 text-blue2">
                        سطح ۱: احراز هویت پایه
                      </p>

                      <div className="flex flex-col gap-2 pt-2 mb-4">
                        <p className="text-sm text-right align-middle text-gray5">
                          مجموع برداشت 24 ساعت اخیر
                        </p>
                        <p className="text-sm text-right align-middle text-black1">
                          ۸۴۹,۰۰۰,۸۴۹ تومان از ۱۳۳,۹۰۴,۰۰۰,۰۰۰ تومان
                        </p>
                        <p className="text-sm text-right align-middle text-gray5 pt-5">
                          مجموع برداشت 24 ساعت اخیر
                        </p>
                        <p className="text-black1">
                          ۸۴۹,۰۰۰,۸۴۹ تومان از ۱۳۳,۹۰۴,۰۰۰,۰۰۰ تومان
                        </p>
                      </div>
                    </div>
                  )}
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
