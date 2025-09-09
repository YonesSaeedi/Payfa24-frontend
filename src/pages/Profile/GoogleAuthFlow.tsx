// import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import Google from "../../assets/Icons/MultiFactor/Google.png"
// export default function VerifyGooglePage() {
//   return (
//     <>
//       <HeaderLayout>
//         <div className="container-style w-full pt-7 flex gap-10 flex-col">
//           <BreadcrumbNavigation />
//           <div className="lg:bg-gray42 lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
//             <div className="flex items-center justify-center" dir="rtl">
//               <div>
//                 <form className="w-full lg:w-[550px] text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
//                     <h1>تایید دو مرحله‌ای گوگل</h1>
//                     {/* /////////////// steper////////// */}
//                     <div className="flex items-center flex-col gap-6">
//                         <img className="w-16 h-16" src={Google} alt="Google" />
//                         <p className="lg:text-lg text-sm font-normal text-gray5">در صورت نصب نداشتن برنامه Google Authenticator بر روی گوشی خود میتوانید از طریق لینک زیر دانلود کنید.</p>
//                     </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </HeaderLayout>
//     </>
//   );
// }

// import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import { useState } from "react";
// import StepperGoogle from "../../Components/MultiFactor/Stepper/StepperGoogle";
// import DownloadApp from "../../Components/MultiFactor/Stepper/DownloadApp"; // مسیر فایل DownloadApp
// import IconDownloadApp from "../../assets/Icons/MultiFactor/IconDownloadApp";
// import { ScanQrCode } from "lucide-react";
// import IconSmsTracking from "../../assets/Icons/MultiFactor/IconSmsTracking";
// import GoogleAuthStepper from "../../Components/MultiFactor/Stepper/renderStepContent ";

// export default function VerifyGooglePage() {
//   const [currentStep, setCurrentStep] = useState(1); // مرحله فعلی
//   const totalSteps = 3; // تعداد کل مراحل

//   const handleNext = () => {
//     if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
//   };

//   const handlePrev = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   return (
//     <>
//       <HeaderLayout>
//         <div className="container-style w-full pt-7 flex gap-10 flex-col">
//           <BreadcrumbNavigation />
//           <div className="lg:bg-gray42 lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
//             <div className="flex items-center justify-center" dir="rtl">
//               <div>
//                 <form className="w-full lg:w-[550px] text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
//                   <h1>تأیید دو مرحله‌ای گوگل</h1>
//                   <StepperGoogle
//                     currentStep={currentStep}
//                     totalSteps={totalSteps}
//                     onNext={handleNext}
//                     onPrev={handlePrev}
//                   />

//                   {currentStep === 1 && <DownloadApp onNext={handleNext} />}
//                   {currentStep === 2 && (
//                     <div className="flex items-center flex-col gap-6">
//                       <img
//                         className="w-32 h-32"
//                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
//                         alt="QR Code"
//                       />
//                       <p className="lg:text-lg text-sm font-normal text-gray5">
//                         لطفاً برنامه Google Authenticator را اسکن کنید.
//                       </p>
//                       <div className="flex gap-2 mt-4">
//                         <button
//                           type="button"
//                           onClick={handlePrev}
//                           className="px-4 py-2 bg-gray-300 text-black rounded"
//                         >
//                           قبلی
//                         </button>
//                         <button
//                           type="button"
//                           onClick={handleNext}
//                           className="px-4 py-2 bg-blue-500 text-white rounded"
//                         >
//                           بعدی
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   {currentStep === 3 && (
//                     <div className="flex items-center flex-col gap-6">
//                       <p className="lg:text-lg text-sm font-normal text-gray5">
//                         لطفاً کد ارسال شده به Google Authenticator را وارد کنید.
//                       </p>
//                       <input
//                         type="text"
//                         placeholder="کد را وارد کنید"
//                         className="w-full max-w-xs p-2 border rounded"
//                       />
//                       <div className="flex gap-2 mt-4">
//                         <button
//                           type="button"
//                           onClick={handlePrev}
//                           className="px-4 py-2 bg-gray-300 text-black rounded"
//                         >
//                           قبلی
//                         </button>
//                         <button
//                           type="button"
//                           className="px-4 py-2 bg-blue-500 text-white rounded"
//                         >
//                           تأیید
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//         <GoogleAuthStepper/>
//       </HeaderLayout>
//     </>
//   );
// }

import React, { useState } from "react";
import DownloadAppPage from "../../Components/MultiFactor/Stepper/DownloadAppPage";
import ScanQrCodePage from "../../Components/MultiFactor/Stepper/ScanQrCodePage";
import EnterCodePage from "../../Components/MultiFactor/Stepper/EnterCodePage";
import Stepper from "../../Components/MultiFactor/Stepper/Stepper";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";

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
