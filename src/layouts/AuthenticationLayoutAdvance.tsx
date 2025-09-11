// import { useState } from "react";
// import AuthenticationLeft from "../Components/authenticationLeft";
// import AuthenticationRight from "../Components/authenticationRight";
// import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
// import StepEmail from "../Components/auth/step/StepBasic/StepEmail";
// import StepPersonal from "../Components/auth/step/StepBasic/StepPersonal";
// import StepCard from "../Components/auth/step/StepBasic/StepCard";

// export default function AuthenticationLayoutAdvance({
//   children,
//   text1,
//   text2,
// }) {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);

//   const handleNextStep = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const renderLeftPanelContent = () => {
//     if (step === 0) {
//       return null;
//     }
//     switch (step) {
//       case 1:
//         return <StepEmail onNext={handleNextStep} />;
//       case 2:
//         return <StepPersonal onNext={handleNextStep} />;
//       case 3:
//         return <StepCard onNext={() => console.log("فرآیند تکمیل شد")} />;
//       default:
//         return null;
//     }
//   };
//   return (
//     <div className="w-full bg-white1">
//       <div className="w-full lg:container-style my-7 px-4 py-2">
//         <BreadcrumbNavigation />
//       </div>

//       <div className="w-full  lg:container-style flex flex-col  md:flex-row px-4 lg:px-8">
//         {/* ستون سمت چپ: تصویر یا فرم ها */}
//         <div
//           className={`w-full h-full p-4 flex items-center justify-center
//               ${!started ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}
//         >
//           {!started ? (
//             <AuthenticationLeft
//               step={step}
//               text1={text1}
//               text2={text2}
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center gap-6 w-full">
//               {renderLeftPanelContent()}
//             </div>
//           )}
//         </div>

//         {/*راست */}
//         <div
//           className={`w-full p-4 flex items-center justify-center
//               ${!started ? "lg:w-1/2 flex" : "lg:flex hidden"}`}
//         >
//           <AuthenticationRight step={step} onStart={handleStart} />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import AuthenticationLeft from "../Components/authenticationLeft";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

import AuthenticationRightAdvance from "../Components/auth/step/StepAdvanced/AuthenticationRightAdvance";
import IdentificationDocument from "../Components/auth/step/StepAdvanced/IdentificationDocument";
import IdentityVerification from "../Components/auth/step/StepAdvanced/IdentityVerification";

export default function AuthenticationLayoutAdvance({
  text1,
  text2,
}) {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleStart = () => {
    setStarted(true);
    setStep(1);
  };

  const renderLeftPanelContent = () => {
    if (step === 0) {
      return null;
    }
    switch (step) {
      case 1:
        return <IdentificationDocument onNext={handleNextStep} />;
      case 2:
        return <IdentityVerification onNext={handleNextStep} />;
      default:
        return null;
    }
  };
  return (
    <div className="w-full bg-white1">
      <div className="w-full lg:container-style my-7 px-4 py-2">
        <BreadcrumbNavigation />
      </div>

      <div className="w-full lg:container-style flex flex-col  md:flex-row px-4 lg:px-8">
        {/* ستون سمت چپ: تصویر یا فرم ها */}
        <div
          className={`w-full h-full p-4 flex items-center justify-center 
              ${!started ? "lg:w-1/2 lg:flex hidden" : "lg:w-full flex"}`}
        >
          {!started ? (
            <AuthenticationLeft step={step} text1={text1} text2={text2} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {renderLeftPanelContent()}
            </div>
          )}
        </div>

        {/*راست */}
        <div
          className={`w-full p-4 flex items-center justify-center 
              ${!started ? "lg:w-1/2 flex" : "lg:flex hidden"}`}
        >
          <AuthenticationRightAdvance step={step} onStart={handleStart} />{" "}
        </div>
      </div>
    </div>
  );
}
