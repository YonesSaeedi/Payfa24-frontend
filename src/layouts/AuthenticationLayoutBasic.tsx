import React from "react";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRight from "../components/authenticationRight";
import AuthenticationLeft from "../components/authenticationLeft";

type AuthenticationLayoutProps = {
  step: number;
  started: boolean;
  onStart: () => void;
  children?: React.ReactNode;
};

export default function AuthenticationLayoutBasic({
  step,
  started,
  onStart,
  children,
}: AuthenticationLayoutProps) {
  return (
    <div className="w-full bg-white1">
      <div className="w-full lg:container-style my-7 px-4 py-2">
        <BreadcrumbNavigation />
      </div>

      <div className="w-full lg:container-style flex flex-col md:flex-row px-0 lg:px-8">
        {/* سمت چپ */}
        <div
          className={`w-full h-full p-4 flex items-center justify-center ${
            !started ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"
          }`}
        >
          {!started ? (
            <AuthenticationLeft
              step={step}
              text2="لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد."
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {children}
            </div>
          )}
        </div>

        {/* سمت راست */}
        <div
          className={`w-full p-4 flex items-center justify-center ${
            !started ? "lg:w-1/2 flex" : "lg:flex hidden"
          }`}
        >
          <AuthenticationRight step={step} onStart={onStart} />
        </div>
      </div>
    </div>
  );
}
