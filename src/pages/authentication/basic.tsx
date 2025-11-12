import { useEffect, useState } from "react";
import AuthenticationLayout from "../../layouts/AuthenticationLayoutBasic";
import HeaderLayout from "../../layouts/HeaderLayout";
import StepEmail from "../../components/auth/step/StepBasic/StepEmail";
import StepPersonal from "../../components/auth/step/StepBasic/StepPersonal";
import StepCard from "../../components/auth/step/StepBasic/StepCard";
import StepZiro from "../../components/auth/step/StepBasic/StepZiro";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";

export default function AuthenticationBasic() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const { data: userInfo } = useGetKYCInfo();

  const safeUserInfo = {
    kyc: {
      basic: {
        email: userInfo?.kyc?.basic?.email ?? undefined,
        mobile: userInfo?.kyc?.basic?.mobile ?? undefined,
        cardbank: !!userInfo?.kyc?.basic?.cardbank,
        name: userInfo?.kyc?.basic?.name ?? undefined,
        family: userInfo?.kyc?.basic?.family ?? undefined,
        father: userInfo?.kyc?.basic?.father ?? undefined,
        national_code: userInfo?.kyc?.basic?.national_code ?? undefined,
        date_birth: userInfo?.kyc?.basic?.date_birth ?? undefined,
      },
    },
  };

  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };


  useEffect(() => {
    if (!userInfo) return;

    if (userInfo?.level_kyc === null) {
      setStarted(true);
      setStep(1);
    } else if (userInfo?.level_kyc === "basic") {
      setStarted(true);
      setStep(3);
    }
  }, [userInfo]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepZiro onNext={() => setStep(1)} />;
      case 1:
        return <StepEmail onNext={() => setStep(2)} userInfo={safeUserInfo} />;
      case 2:
        return <StepPersonal onNext={() => setStep(3)} userInfo={safeUserInfo} />;
      case 3:
        return <StepCard onNext={() => {}} userInfo={safeUserInfo} />;
      default:
        return null;
    }
  };

  return (
    <HeaderLayout>
      <AuthenticationLayout step={step} started={started} onStart={handleStart}>
        <div className="flex flex-col items-center justify-center gap-6 w-full">{renderStep()}</div>
      </AuthenticationLayout>
    </HeaderLayout>
  );
}
