import { useState } from "react";
import AuthenticationLayout from "../../layouts/AuthenticationLayoutBasic";
import HeaderLayout from "../../layouts/HeaderLayout";
import StepEmail from "../../Components/auth/step/StepBasic/StepEmail";
import StepPersonal from "../../Components/auth/step/StepBasic/StepPersonal";
import StepCard from "../../Components/auth/step/StepBasic/StepCard";
import StepZiro from "../../Components/auth/step/StepBasic/StepZiro";

export default function AuthenticationBasic() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepZiro onNext={() => setStep(1)} />;
      case 1:
        return <StepEmail onNext={() => setStep(2)} />;
      case 2:
        return <StepPersonal onNext={() => setStep(3)} />;
      case 3:
        return <StepCard onNext={() => handleFinish()} />;
      default:
        return <StepEmail onNext={() => setStep(1)} />;
    }
  };

  const handleFinish = () => {
    console.log("فرآیند احراز هویت تکمیل شد!");
  };

  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };

  return (
    <HeaderLayout>
      <AuthenticationLayout 
        step={step} 
        started={started} 
        onStart={handleStart}
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {renderStep()}
        </div>
      </AuthenticationLayout>
    </HeaderLayout>
  );
}
