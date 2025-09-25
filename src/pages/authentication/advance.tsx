import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import StepCard from "../../Components/auth/step/StepBasic/StepCard";
import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";

export default function advance() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false); // State برای مدیریت شروع فرآیند

  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };
  
  const handleFinish = () => {
    console.log("فرآیند تکمیل شد.");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <IdentificationDocument onNext={() => setStep(2)} />;
      case 2:
        return <IdentityVerification onNext={() => setStep(3)} />;
      case 3:
        return <StepCard onNext={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <HeaderLayout>
      <AuthenticationLayoutAdvance
        step={step}
        started={started}
        onStart={handleStart} 
        text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
        text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید "
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {renderStep()}
        </div>
      </AuthenticationLayoutAdvance>
    </HeaderLayout>
  );
}