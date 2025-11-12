import React from "react";
import AuthenticationLeft from "../components/authenticationLeft";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRightAdvance from "../components/auth/step/StepAdvanced/AuthenticationRightAdvance";

type Props = {
  text1: string;
  text2: string;
  step: 0 | 1 | 2;
  setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2>>
  children: React.ReactNode; 
};

export default function AuthenticationLayoutAdvance({ text1, text2, step, setStep, children, }: Props) {

  return (
    <div className="w-full bg-white1 container-style">
      <div className="w-full  my-7 py-2"><BreadcrumbNavigation /></div>
      <div className="w-full flex flex-col md:flex-row ">
        {/* ستون سمت چپ */}
        <div className={`w-full h-full flex items-center justify-center ${step === 0 ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}>
          {step === 0 ?
            <AuthenticationLeft step={step} text1={text1} text2={text2} />
            :
            <div className="flex flex-col items-center justify-center gap-6 w-full">{children}</div>
          }
        </div>
        {/* ستون راست */}
        <div className={`w-full py-4 flex items-center justify-center ${step === 0 ? "lg:w-1/2 flex" : "lg:flex hidden"}`}>
          <AuthenticationRightAdvance step={step} onStart={() => setStep(1)} />
        </div>
      </div>
    </div>
  );
}
