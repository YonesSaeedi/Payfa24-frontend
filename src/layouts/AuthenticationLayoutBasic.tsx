import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRight from "../components/authenticationRight";
import AuthenticationLeft from "../components/authenticationLeft";
import StepEmail from "../components/auth/step/StepBasic/StepEmail";
import StepPersonal from "../components/auth/step/StepBasic/StepPersonal";
import StepCard from "../components/auth/step/StepBasic/StepCard";
import { apiRequest } from "../utils/apiClient";
import { ROUTES } from "../routes/routes";

type UserInfo = {
  level_kyc: string;
  kyc: {
    basic?: {
      name?: string;
      family?: string;
      mobile?: string | null;
      email?: string | null;
      father?: string;
      national_code?: string;
      date_birth?: string;
      cardbank?: number;
    };
    advanced?: {
      status: "pending" | "success" | "reject";
      reason_reject: string | null;
    };
  };
};

export default function AuthenticationLayout() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDataAndSetStep = async () => {
      try {
        const response = await apiRequest<UserInfo>({ url: "/api/kyc/get-info" });
        console.log("AuthenticationLayout - User Info:", response);
        if (response?.level_kyc === "Basic") {
          // اگر سطح احراز هویت Basic است، یعنی هر سه مرحله تکمیل شده است
          navigate(ROUTES.AUTHENTICATION_ADVANCED);
        } else {
          const basicInfo = response.kyc?.basic;
          // منطق دقیق‌تر برای تعیین مرحله
          if (basicInfo?.name) {
            setStep(3);
          } else if (
            basicInfo?.mobile && basicInfo?.email
          ) {
            setStep(2);
          } else {
            setStep(1);
          }
          setStarted(true);
        }
      } catch (error: any) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDataAndSetStep();
  }, [navigate]);
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };
  const renderLeftPanelContent = () => {
    if (!started || isLoading) {
      return null;
    }
    switch (step) {
      case 1:
        return <StepEmail onNext={handleNextStep} />;
      case 2:
        return <StepPersonal onNext={handleNextStep} />;
      case 3:
        return <StepCard onNext={() => navigate(ROUTES.AUTHENTICATION_ADVANCED)} />;
      default:
        return <StepCard onNext={() => navigate(ROUTES.AUTHENTICATION_ADVANCED)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white1">
        در حال بررسی وضعیت احراز هویت...
      </div>
    );
  }

  return (
    <div className="w-full bg-white1">
      <div className="w-full lg:container-style my-7 px-4 py-2"><BreadcrumbNavigation /></div>
      <div className="w-full lg:container-style flex flex-col md:flex-row px-0 lg:px-8">
        <div className={`w-full h-full p-4 flex items-center justify-center ${!started ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}>
          {!started ?
            <AuthenticationLeft step={step} text2=" لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید این مرحله تنها چند دقیقه زمان خواهد برد" />
            :
            <div className="flex flex-col items-center justify-center gap-6 w-full">{renderLeftPanelContent()}</div>
          }
        </div>
        <div className={`w-full p-4 flex items-center justify-center ${!started ? "lg:w-1/2 flex" : "lg:flex hidden"}`}>
          <AuthenticationRight step={step} onStart={handleStart} />
        </div>
      </div>
    </div>
  );
}
