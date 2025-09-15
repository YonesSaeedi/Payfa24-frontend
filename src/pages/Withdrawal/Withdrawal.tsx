import React, { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconWarning from "../../assets/icons/trade/IconWarning";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation"
import WithdrawForm from "../../Components/Withdrawal/WithdrawForm";
import CryptoWithdrawForm from "../../Components/Withdrawal/CryptoWithdrawForm";

const WithdrawPage: React.FC = () => {
   const [showBox, setShowBox] = useState(false);
    const [withdrawType, setWithdrawType] = useState<"fiat" | "crypto">("fiat");
  return (
    <div className="h-full">
      <HeaderLayout>
        <div className=" w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
            <BreadcrumbNavigation />


           

                   <div className="bg-white1  rounded-[16px] lg:shadow-[0_0_12px_0_#00000029] p-6 flex flex-col lg:flex-row pt-8 mt-4">
                 
              <div className="flex-1 p-8">
                   {withdrawType === "fiat" ? (
                  <WithdrawForm />
                ) : (
                  <CryptoWithdrawForm/>// 🔥 فرم جدید برای برداشت ارز
                )}
                </div>

                {/* بخش کناری (هشدار و گزینه‌ها) */}
                <div className="flex-1 flex flex-col gap-6 p-8">
                  <div dir="rtl" className="bg-orange5 border border-orange-200 rounded-xl p-4 text-sm text-left">
                    <h3 className="text-orange-600 font-bold flex items-left gap-2 mb-2">
                      <span dir="rtl" className="w-5 h-5 text-orange1">
                        <IconWarning />
                      </span>
                      توجه داشته باشید
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 p-4">
                      <li className="text-right">
                        لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.
                      </li>
                      <li className="text-right">
                        سقف مجاز هر برداشت ۱۰۰ میلیون تومان است.
                      </li>
                      <li className="text-right">
                        سقف مجاز هر برداشت برای هر شماره شبا ۲۰۰ میلیون می‌باشد.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl p-4 mb-1 cursor-pointer border border-gray21 bg-white hover:border-blue2 transition"  onClick={() => setWithdrawType("fiat")}>
                      <button className="text-gray5 border border-gray-300 rounded-[8px] px-4 py-2 font-normal bg-gray27">
                        پرداخت در لحظه
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

                   <div
  className="flex items-center justify-between rounded-xl p-4 cursor-pointer border border-gray21 bg-white hover:border-blue2 transition"
  onClick={() => {
    setWithdrawType("crypto");
    setShowBox(!showBox);
  }}
>

                      <span className="text-gray5 border border-gray-300 rounded-[8px] px-4 py-2 bg-gray27">
                         پرداخت در ۲۰ دقیقه
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
                   {showBox && (
        <div className="border border-gray-300 rounded-xl p-4 bg-white mt-2 text-right">
          <p className="font-semibold mb-2">سطح ۱: احراز هویت پایه</p>
          <p className="text-gray-700 text-sm">
            مجموع برداشت ۲۴ ساعت اخیر: ۸۴۹,۰۰۰,۸۴۹ تومان از ۱۳۳,۹۰۴,۰۰۰,۰۰۰ تومان
          </p>
          <p className="text-gray-700 text-sm">
            مجموع برداشت ۲۴ ساعت اخیر: ۸۴۹,۰۰۰,۸۴۹ تومان از ۱۳۳,۹۰۴,۰۰۰,۰۰۰ تومان
          </p>
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
