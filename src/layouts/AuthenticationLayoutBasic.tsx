import React from "react";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationLeft from "../components/authenticationLeft";
import AuthenticationRight from "../components/authenticationRight";

type AuthenticationLayoutProps = {
  step: number;
  started: boolean;
  onStart: () => void;
  levelKyc: string | null;
  children?: React.ReactNode;
};

export default function AuthenticationLayoutBasic({ step, started, onStart, levelKyc, children }: AuthenticationLayoutProps) {
  const showIntroPage = levelKyc === null && !started;

  return (
    <div className="w-full bg-white1">
      <div className="w-full lg:container-style lg:mt-4 mt-7 px-4 py-2">
        <BreadcrumbNavigation />
      </div>

      <div className="w-full lg:container-style flex flex-col lg:flex-row pb-14 lg:mt-9  items-start gap-8">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-start ">
          {showIntroPage ? (
            <AuthenticationLeft text2="لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد." />
          ) : (
            <div className="w-full   ">{children}</div>
          )}
        </div>

        {/* سمت راست: همیشه AuthenticationRight باشه (حتی تو مراحل) */}
        <div className="w-full lg:w-1/2 flex items-start justify-center lg:p-0 p-4">
          <AuthenticationRight step={step} onStart={onStart} levelKyc={levelKyc} started={started} />
        </div>
      </div>
    </div>
  );
}
