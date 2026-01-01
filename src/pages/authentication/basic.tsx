import { useEffect, useState } from "react";
import AuthenticationLayout from "../../layouts/AuthenticationLayoutBasic";
import HeaderLayout from "../../layouts/HeaderLayout";
import StepPersonal from "../../components/auth/step/StepBasic/StepPersonal";
import StepCard from "../../components/auth/step/StepBasic/StepCard";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";




export default function AuthenticationBasic() {
  const navigate = useNavigate();
  const { data: userInfo, isLoading } = useGetKYCInfo();

  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  // فقط وقتی تموم شد → برو احراز پیشرفته
  useEffect(() => {
    if (userInfo?.level_kyc && step === 0) {
      navigate(ROUTES.AUTHENTICATION_ADVANCED, { replace: true });
    }
  }, [userInfo?.level_kyc, step, navigate]);

  const handleStart = () => {
    setStarted(true);
    setStep(2);
  };

  // اگر لودینگ یا دیتا نیومده
  if (isLoading || !userInfo) {
    return null;
  }

  const basic = userInfo.kyc?.basic || {};
  const hasEmailOrMobile = !!basic.email && !!basic.mobile;
  const hasPersonalInfo = !!basic.name && !!basic.family && !!basic.national_code;
  const hasCard = basic.cardbank === 1;


  // ۱. اگر basic شده ولی کارت نزده → فقط مرحله کارت
  if (userInfo.level_kyc === "basic" && !hasCard) {
    return (
      <HeaderLayout>
        <AuthenticationLayout step={3} started={true} onStart={() => {}} levelKyc="basic">
          <div className="w-full flex justify-center">
            <StepCard  userInfo={userInfo} />
          </div>
        </AuthenticationLayout>
      </HeaderLayout>
    );
  }

  if (hasEmailOrMobile && !hasPersonalInfo) {
    return (
      <HeaderLayout>
        <AuthenticationLayout step={2} started={true} onStart={() => {}} levelKyc={null}>
          <div className="w-full flex justify-center">
            <StepPersonal onNext={() => setStep(3)} userInfo={userInfo} />
          </div>
        </AuthenticationLayout>
      </HeaderLayout>
    );
  }

  // ۳. اگر همه چیز تموم شده (step === 0 و level_kyc پر شده) → useEffect ریدایرکت می‌کنه
  if (userInfo.level_kyc && step === 0) {
    return null;
  }

  // ۴. حالت عادی: کاربر هنوز شروع نکرده یا در حال انجام مراحل عادی
  const renderStep = () => {
    // if (step === 1) return <StepEmail onNext={() => setStep(2)} userInfo={userInfo} />;
    if (step === 2) return <StepPersonal onNext={() => setStep(3)} userInfo={userInfo} />;
    if (step === 3) return <StepCard  userInfo={userInfo} />;
    return null;
  };

  return (
    <HeaderLayout>
      <AuthenticationLayout
        step={step}
        started={started}
        onStart={handleStart}
        levelKyc={userInfo.level_kyc}
      >
        <div className="w-full flex justify-center">
          {renderStep()}
        </div>
      </AuthenticationLayout>
    </HeaderLayout>
  );
}