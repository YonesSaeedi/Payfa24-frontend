import React, { ReactNode } from "react";
import IconAlert from "../../assets/Icons/Login/IconAlert";
import IconDanger from "../../assets/Icons/Deposit/IconDanger";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";

interface DepositLayoutProps {
  step: number;
  started: boolean;
  onStart: () => void;
  children: ReactNode; // محتوای داخل (بخش راست و چپ)
}

const DepositLayout: React.FC<DepositLayoutProps> = ({
  step,
  started,
  onStart,
  children,
}) => {
  return (
    <div className="w-full container-style h-full flex flex-col lg:flex-row bg-green-600 items-center justify-center">



      {/* بخش اصلی (راست و چپ) */}
      <div className="flex w-full lg:flex-row-reverse flex-col items-center ">
        {/* بخش راست - ثابت */}
        <div className="lg:w-1/2 w-full bg-teal-400 lg:p-4 overflow-y-auto h-full flex lg:items-end items-center flex-col">
          <div className="bg-orange3  rounded-xl p-4 flex flex-col" dir="rtl">
            <div className="flex gap-1 text-orange1 lg:text-lg text-sm mb-4">
              <span className="icon-wrapper w-6 h-6">
                <IconDanger />
              </span>
              <span>توجه داشته باشید</span>
            </div>
            <ul className=" list-disc lg:text-base text-xs px-4 text-black0">
              <li>لطفا در صورت استفاده از فیلتر شکن آن را خاموش کنید</li>
              <li>
                واریز تومانی تنها از طریق حساب های بانکی که متعلق به شما میباشد
                امکان پذیر است
              </li>
            </ul>
          </div>

          {React.Children.map(children, (child, index) => {
            if (index === 0) return child; // بخش اول به عنوان راست
            return null;
          })}
        </div>

        {/* بخش چپ - متغیر */}
        <div className="w-full lg:w-1/2 p-6 bg-red-300">
          {React.Children.map(children, (child, index) => {
            if (index === 1) return child; // بخش دوم به عنوان چپ
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositLayout;
