

import  { useState } from "react";
import DownloadAppPage from "../../components/MultiFactor/Stepper/DownloadAppPage";
import ScanQrCodePage from "../../components/MultiFactor/Stepper/ScanQrCodePage";
import EnterCodePage from "../../components/MultiFactor/Stepper/EnterCodePage";
import Stepper from "../../components/MultiFactor/Stepper/Stepper";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

export default function GoogleAuthFlow() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DownloadAppPage onNext={handleNext} />;
      case 1:
        return <ScanQrCodePage onNext={handleNext} onPrev={handlePrev} />;
      case 2:
        return <EnterCodePage onPrev={handlePrev} />;
      default:
        return null;
    }
  };

  return (
    <HeaderLayout>
      <div className="container-style w-full pt-7 flex gap-10 flex-col" dir="rtl">
        <BreadcrumbNavigation />
        <div className="lg:bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
          <div className="max-w-xl flex flex-col items-center justify-center mx-auto lg:p-10">
            <p className="text-lg lg:flex hidden font-medium text-black1 mb-12">
              تایید دو مرحله‌ای گوگل
            </p>
            <Stepper currentStep={currentStep} />
            <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-lg"></div>
            {renderStepContent()}
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
