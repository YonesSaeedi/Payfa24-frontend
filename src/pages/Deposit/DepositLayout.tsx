import React, { ReactNode } from "react";
import IconDanger from "../../assets/icons/Deposit/IconDanger";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

interface DepositLayoutProps {
  step: number;
  started: boolean;
  onStart: () => void;
  children: ReactNode;
  alertMessages: string[];
}

const DepositLayout: React.FC<DepositLayoutProps> = ({
  children,
  alertMessages,
}) => {
  return (
    <div className="pt-5 w-full  container-style h-full flex flex-col items-center justify-center">
      {/* بخش اصلی (راست و چپ) */}
      <BreadcrumbNavigation/>
      <div className=" flex w-full lg:gap-7 lg:flex-row-reverse lg:bg-gray25 lg:p-10 flex-col items-start lg:mt-10 mt-4 justify-center lg:shadow-[0_0_12px_0_rgba(0,0,0,0.36)] rounded-2xl">
        
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
        <div className="w-full lg:w-1/2 lg:px-[34px] lg:py-10 py-6 lg:bg-gray43 rounded-2xl ">
          
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
              className="bg-orange5 rounded-xl lg:p-6 p-4 flex flex-col mt-6" 
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