import React, { ReactNode } from "react";
// import IconAlert from "../../assets/Icons/Login/IconAlert"; // استفاده نشده
import IconDanger from "../../assets/icons/Deposit/IconDanger";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo"; // استفاده نشده

interface DepositLayoutProps {
  step: number;
  started: boolean;
  onStart: () => void;
  children: ReactNode;
  alertMessages: string[];
}

const DepositLayout: React.FC<DepositLayoutProps> = ({
  step,
  started,
  onStart,
  children,
  alertMessages,
}) => {
  return (
    <div className="w-full container-style h-full flex flex-col lg:flex-row items-center justify-center">
      {/* بخش اصلی (راست و چپ) */}
      <div className=" flex شhشش w-full lg:gap-7 lg:flex-row-reverse lg:p-10 flex-col items-start mt-14 justify-center lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl">
        
        {/*
          بخش راست - ثابت (ستون انتخاب‌های واریز)
        */}
        <div className="lg:w-1/2 w-full lg:px-4 h-full flex items-center flex-col">
          
          
          {React.Children.map(children, (child, index) => {
            if (index === 0) return child; 
            return null;
          })}
        </div>

        {/* بخش چپ -  (ستون فرم‌ها)
        */}
        <div className="w-full lg:w-1/2 lg:px-4 pb-8  lg:bg-gray43 rounded-2xl ">
          
          {/* ۱. محتوای اصلی (فرم‌های واریز) */}
          {React.Children.map(children, (child, index) => {
            if (index === 1) return child; 
            return null;
          })}
          
          {/*
            ۲. باکس هشدار نارنجی
            👈 اکنون در انتهای ستون چپ (پایین فرم) نمایش داده می‌شود.
          */}
          
          {alertMessages.length > 0 && ( 
            <div 
              className="bg-orange5 rounded-xl lg:p-6 p-4 flex flex-col mt-6 lg:mx-7" 
              dir="rtl"
            >
              <div className="flex gap-1 text-orange1 lg:text-lg text-sm mb-2">
                <span className="icon-wrapper w-6 h-6">
                  <IconDanger />
                </span>
                <span className="lg:text-lg text-sm">توجه داشته باشید</span>
              </div>
              <ul className=" list-disc lg:text-base text-xs px-4 text-black0">
                {alertMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositLayout;