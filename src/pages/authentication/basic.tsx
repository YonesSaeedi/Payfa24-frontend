// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import AuthenticationLayout from "../../layouts/AuthenticationLayoutBasic";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import StepEmail from "../../components/auth/step/StepBasic/StepEmail";
// import StepPersonal from "../../components/auth/step/StepBasic/StepPersonal";
// import StepCard from "../../components/auth/step/StepBasic/StepCard";
// import StepZiro from "../../components/auth/step/StepBasic/StepZiro";
// import { apiRequest } from "../../utils/apiClient";

// type UserInfoFromServer = {
//   kyc?: {
//     basic?: {
//       name?: string;
//       family?: string;
//       father?: string;
//       national_code?: string;
//       date_birth?: string;
//       cardbank?: boolean; 
//       email?: string;     
//       mobile?: string;
//     };
//   };
// };

// export default function AuthenticationBasic() {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);

//   const { data: userInfo } = useQuery<UserInfoFromServer>({
//     queryKey: ["kyc-info"],
//     queryFn: async () => {
//       return apiRequest<UserInfoFromServer>({
//         url: "/kyc/get-info",
//         method: "GET",
//       });
//     },
//   });

//   const safeUserInfo = {
//   kyc: {
//     basic: {
//       email: userInfo?.kyc?.basic?.email,
//       mobile: userInfo?.kyc?.basic?.mobile,
//       cardbank: userInfo?.kyc?.basic?.cardbank ?? false,
//       name: userInfo?.kyc?.basic?.name,
//       family: userInfo?.kyc?.basic?.family,
//       father: userInfo?.kyc?.basic?.father,
//       national_code: userInfo?.kyc?.basic?.national_code,
//       date_birth: userInfo?.kyc?.basic?.date_birth,
//     },
//   },
// };
//   const handleFinish = () => {
//     console.log("فرآیند احراز هویت تکمیل شد!");
//   };

//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const renderStep = () => {
//     // if (isLoading) return <p>در حال بارگذاری...</p>;

//     switch (step) {
//       case 0:
//         return <StepZiro onNext={() => setStep(1)} />;
//       case 1:
//         return <StepEmail onNext={() => setStep(2)} userInfo={safeUserInfo} />;
//       case 2:
//         return <StepPersonal onNext={() => setStep(3)} userInfo={safeUserInfo} />;
//       case 3:
//         return <StepCard onNext={() => handleFinish()} userInfo={safeUserInfo} />;
//       default:
//         return <StepEmail onNext={() => setStep(1)} userInfo={safeUserInfo} />;
//     }
//   };

//   return (
//     <HeaderLayout>
//       <AuthenticationLayout step={step} started={started} onStart={handleStart}>
//         <div className="flex flex-col items-center justify-center gap-6 w-full">
//           {renderStep()}
//         </div>
//       </AuthenticationLayout>
//     </HeaderLayout>
//   );
// }















import { useState } from "react";
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

  const { data: userInfo, refetch } = useGetKYCInfo();

  const safeUserInfo = {
    kyc: {
      basic: {
        email: userInfo?.kyc?.basic?.email,
        mobile: userInfo?.kyc?.basic?.mobile,
        cardbank: userInfo?.kyc?.basic?.cardbank ?? false,
        name: userInfo?.kyc?.basic?.name,
        family: userInfo?.kyc?.basic?.family,
        father: userInfo?.kyc?.basic?.father,
        national_code: userInfo?.kyc?.basic?.national_code,
        date_birth: userInfo?.kyc?.basic?.date_birth,
      },
    },
  };

  const handleFinish = () => {
    console.log("فرآیند احراز هویت تکمیل شد!");
  };

  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepZiro onNext={() => setStep(1)} />;
      case 1:
        return <StepEmail onNext={() => setStep(2)} userInfo={safeUserInfo} refetch={refetch} />;
      case 2:
        return <StepPersonal onNext={() => setStep(3)} userInfo={safeUserInfo} refetch={refetch} />;
      case 3:
        return <StepCard onNext={handleFinish} userInfo={safeUserInfo} refetch={refetch} />;
      default:
        return null;
    }
  };

  return (
    <HeaderLayout>
      <AuthenticationLayout step={step} started={started} onStart={handleStart}>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {renderStep()}
        </div>
      </AuthenticationLayout>
    </HeaderLayout>
  );
}