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
      {/* هدر یا بخش کنترلی (اگه نیاز داری) */}
      <div className="lg:hidden p-4 bg-gray-30">
        <button
          onClick={onStart}
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={started}
        >
          {started ? "Started" : "Start"}
        </button>
      </div>

      {/* بخش اصلی (راست و چپ) */}
      <div className="flex w-full flex-row-reverse items-center">
        {/* بخش راست - ثابت */}
        <div className="w-1/2 bg-teal-400 p-4 overflow-y-auto h-full flex items-end  flex-col">
          <div className="bg-orange3 flex items-end flex-col">
            <div className="flex gap-1 text-orange1 lg:text-lg text-sm">
              <span>توجه داشته باشید</span>
              <span className="icon-wrapper w-6 h-6">
                <IconDanger />
              </span>
            </div>
            <ul className="text-end">
              <li>لطفا در صورت استفاده از فیلتر شکن آن را خاموش کنید</li>
              <li>
                واریز تومانی تنها از طریق حساب های بانکی که متعلق به شما میباشد
                امکان پذیر است{" "}
              </li>
            </ul>
          </div>
            <p>واریز تومان </p>

          {React.Children.map(children, (child, index) => {
            if (index === 0) return child; // بخش اول به عنوان راست
            return null;
          })}
        </div>

        {/* بخش چپ - متغیر */}
        <div className="w-1/2 p-6 bg-red-300">
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
