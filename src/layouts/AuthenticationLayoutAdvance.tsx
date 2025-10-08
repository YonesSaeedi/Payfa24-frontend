// src/layouts/AuthenticationLayoutAdvance.tsx
import React from "react";
import AuthenticationLeft from "../components/authenticationLeft";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRightAdvance from "../components/auth/step/StepAdvanced/AuthenticationRightAdvance";

type Props = {
  text1: string;
  text2: string;
  step: 0 | 1 | 2;
  setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2>>
  children: React.ReactNode; // ⬅️ محتوا از Advance.tsx میاد
};

export default function AuthenticationLayoutAdvance({ text1, text2, step, setStep, children, }: Props) {

  return (
    <div className="w-full bg-white1 overflow-x-hidden">
      <div className="w-full lg:container-style my-7 px-4 py-2"><BreadcrumbNavigation /></div>
      <div className="w-full lg:container-style flex flex-col md:flex-row px-4 lg:px-8">
        {/* ستون سمت چپ */}
        <div className={`w-full h-full p-4 flex items-center justify-center ${step === 0 ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}>
          {step === 0 ?
            <AuthenticationLeft step={step} text1={text1} text2={text2} />
            :
            <div className="flex flex-col items-center justify-center gap-6 w-full">{children}</div>
          }
        </div>
        {/* ستون راست */}
        <div className={`w-full p-4 flex items-center justify-center ${step === 0 ? "lg:w-1/2 flex" : "lg:flex hidden"}`}>
          <AuthenticationRightAdvance step={step} onStart={() => setStep(1)} />
        </div>
      </div>
    </div>
  );
}
