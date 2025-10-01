// src/layouts/AuthenticationLayoutAdvance.tsx
import React from "react";
import AuthenticationLeft from "../Components/authenticationLeft";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRightAdvance from "../Components/auth/step/StepAdvanced/AuthenticationRightAdvance";

type Props = {
  text1: string;
  text2: string;
  started: boolean;
  step: number;
  onStart: () => void;
  children: React.ReactNode; // ⬅️ محتوا از Advance.tsx میاد
};

export default function AuthenticationLayoutAdvance({
  text1,
  text2,
  started,
  step,
  onStart,
  children,
}: Props) {
  return (
    <div className="w-full bg-white1 overflow-x-hidden">
      <div className="w-full lg:container-style my-7 px-4 py-2">
        <BreadcrumbNavigation />
      </div>

      <div className="w-full lg:container-style flex flex-col md:flex-row px-4 lg:px-8">
        {/* ستون سمت چپ */}
        <div
          className={`w-full h-full p-4 flex items-center justify-center 
              ${!started ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}
        >
          {!started ? (
            <AuthenticationLeft step={step} text1={text1} text2={text2} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {children} {/* ⬅️ محتوا از Advance.tsx میاد */}
            </div>
          )}
        </div>

        {/* ستون راست */}
        <div
          className={`w-full p-4 flex items-center justify-center 
              ${!started ? "lg:w-1/2 flex" : "lg:flex hidden"}`}
        >
          <AuthenticationRightAdvance step={step} onStart={onStart} />
        </div>
      </div>
    </div>
  );
}
