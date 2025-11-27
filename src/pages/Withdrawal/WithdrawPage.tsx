
import React, { useEffect, useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import IconArrowLeft from "../../assets/icons/Withdrawal/IconArrowLeft";
import IconCurrency from "../../assets/icons/Withdrawal/IconCurrency";
import { useNavigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const WithdrawPage: React.FC = () => {
  const [, setShowBox] = useState(false);
  const [withdrawType, setWithdrawType] = useState<"fiat" | "crypto">("fiat");
  const navigate = useNavigate();

  const [, setAlertList] = useState<string[]>([
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

            <div className="bg-white1 rounded-[16px] lg:shadow-[0_0_12px_0_#00000029] lg:p-6 flex flex-col flex-col-reverse lg:flex-row lg:pt-8 mb-9">
              <div className="flex-1 lg:p-8 lg:pt-8 ">
                <Outlet /> 
              </div>
              <div className=" lg:flex-1 flex flex-col gap-6 lg:p-8 ">
                <div className="lg:flex hidden flex-col gap-10">
                  {/* ---------------------------------------------------------------------- withdraw Fiat ----------------------------------------------------------------- */}
                  <div>
                    <span className="flex justify-end mb-4 text-black1">برداشت تومان</span>
                    <div className={`flex items-center justify-between rounded-xl p-4 mb-1 cursor-pointer border transition-all duration-300 ${ withdrawType === "fiat"
                          ? "border-blue-500 light:bg-blue-50 shadow-md"
                          : "border-gray21 hover:border-blue2" }`}
                      onClick={() => {setWithdrawType("fiat");setShowBox(false);navigate("/withdraw/fiat");
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
                        <button className={`text-sm border rounded-[8px] px-2 py-1.5 transition-all duration-300 ${ withdrawType === "fiat"
                              ? " text-blue2 border-blue2 shadow"
                              : "text-gray5 border-gray21 bg-gray27 hover:border-blue2 hover:text-blue2"
                          }`}
                        >
                          پرداخت در لحظه
                        </button>
                      </div>
                      <div className="flex flex-row-reverse">
                        <div
                          className="w-[52px] h-[52px] ml-2 rounded-[8px] flex items-center justify-center transition-all duration-300 bg-blue14" >
                          <span className="w-6 h-6 icon-wrapper text-blue-600">
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
                  {/* ----------------------------------------------------------------------------------withdra crypto --------------------------------------------------- */}
                  <div>
                    <span className="flex justify-end mb-4 text-black1">برداشت رمز ارز</span>
                    <div className={`flex items-center justify-between rounded-xl p-4 cursor-pointer border transition-all duration-300 ${
                        withdrawType === "crypto" ? "border-blue-500 shadow-md": "border-gray21 hover:border-blue2"}`}
                      onClick={() => {setWithdrawType("crypto");setShowBox(true);
                        setAlertList([
                          "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید.",]);
                        navigate("/withdraw/crypto");
                      }}>
                      <div className="flex items-center justify-center">
                        <span className="w-6 h-6 icon-wrapper mr-2">
                          <IconArrowLeft />
                        </span>
                        <button className={`text-sm border rounded-[8px] px-2 py-1.5 transition-all duration-300 ${
                            withdrawType === "crypto"
                              ? " text-blue2 border-blue2 shadow"
                              : "text-gray5 border-gray21 bg-gray27 hover:border-blue2 hover:text-blue2"
                          }`}
                        >
                          پرداخت در ۲۰ دقیقه
                        </button>
                      </div>

                      <div className="flex flex-row-reverse">
                        <div className="w-[52px] h-[52px] ml-2 rounded-[8px] flex items-center justify-center transition-all duration-300 bg-blue14">
                          <span className="w-6 h-6 icon-wrapper">
                            <IconCurrency />
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-black1">برداشت رمز ارز</span>
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
