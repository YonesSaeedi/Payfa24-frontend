import React, { ReactNode } from "react";
import IconAlert from "../../assets/Icons/Login/IconAlert";
import IconDanger from "../../assets/Icons/Deposit/IconDanger";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";

interface DepositLayoutProps {
  step: number;
  started: boolean;
  onStart: () => void;
  children: ReactNode; // محتوای داخل (بخش راست و چپ)
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
    <div className="w-full container-style h-full flex flex-col lg:flex-row  items-center justify-center">

      {/* بخش اصلی (راست و چپ) */}
      <div className=" flex w-full lg:gap-7 lg:flex-row-reverse lg:p-10 flex-col items-start mt-14 justify-center lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl">
        {/* بخش راست - ثابت */}
        <div className="lg:w-1/2 w-full lg:px-4  overflow-y-auto h-full flex items-center flex-col">
         {alertMessages.length > 0 && (
          <div className="bg-orange3 w-full rounded-xl lg:p-6 mb-4 lg:mb-6 p-2 flex flex-col" dir="rtl">
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
          {React.Children.map(children, (child, index) => {
            if (index === 0) return child;
            return null;
          })}
        </div>

        {/* بخش چپ - متغیر */}
        <div className="w-full lg:w-1/2 lg:px-4 lg:py-8  lg:bg-gray44 rounded-2xl">
          {React.Children.map(children, (child, index) => {
            if (index === 1) return child; 
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositLayout;
