// import React from "react";

// interface StepperProps {
//   currentStep: number;
//   totalSteps: number;
//   onNext?: () => void;
//   onPrev?: () => void;
// }

// const StepperGoogle: React.FC<StepperProps> = ({ currentStep, totalSteps, onNext, onPrev }) => {
//   return (
//     <div className="flex justify-center mt-6 mb-6" dir="rtl">
//       <span className="text-sm font-medium text-gray5">
//         {currentStep} از {totalSteps}
//       </span>
//       <div className="flex gap-2 mt-4">
//         {onPrev && (

      
//           <button
//             type="button"
//             onClick={onPrev}
//             className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
//             disabled={currentStep === 1}
//           >
         
//             قبلی
//           </button>
//         )}
//         {onNext && (
//           <button
//             type="button"
//             onClick={onNext}
//             className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             disabled={currentStep === totalSteps}
//           >
//             بعدی
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StepperGoogle;



// import React from "react";
// import IconDownloadApp from "../../../assets/Icons/MultiFactor/IconDownloadApp";
// import IconScanQRcode from "../../../assets/Icons/MultiFactor/IconScanQRcode";
// import IconSmsTracking from "../../../assets/Icons/MultiFactor/IconSmsTracking";


// interface Props {
//   step: number;
//   onStart: () => void;
// }


// export default function StepperGoogle({ step, onStart }: Props) {
//   return (
//     <div
//       className={`w-full h-full flex flex-col gap-6 items-end ${
//         step === 0 ? "flex" : "hidden lg:flex "
//       }`}
//     >
//       {/* سطح 1 */}
//       <div className="lg:max-w-lg w-full bg-blue-400 flex  p-6 dark:text-white justify-center ">
//         <div className="flex flex-col-reverse items-center justify-end">
//           <span className="mr-2 text-black1"> دانلود اپ</span>
//           <span className="icon-wrapper w-7 h7 text-blue2">
//             <IconDownloadApp/>
//           </span>
//         </div>
//         <div className="flex flex-col-reverse items-center justify-end">
//           <span className="mr-2 text-black1">مشخصات فردی</span>
//           <span className="icon-wrapper w-7 h7 text-blue2">
//             <IconScanQRcode/>
//           </span>
//         </div>
//         <div className="flex flex-col-reverse items-center justify-end">
//           <span className="mr-2 text-black1">کارت بانکی</span>
//           <span className="icon-wrapper w-7 h7 text-blue2">
//             <IconSmsTracking/>
//           </span>
//         </div>
       
//       </div>

     
//     </div>
//   );
// }




import React from "react";
import IconDownloadApp from "../../../assets/icons/MultiFactor/IconDownloadApp";
import IconScanQRcode from "../../../assets/icons/MultiFactor/IconScanQRcode";
import IconSmsTracking from "../../../assets/icons/MultiFactor/IconSmsTracking";
import IconCheckmark from "../../../assets/icons/authentication/IconCheckmark";

interface Props {
  currentStep: number;
}

export default function Stepper({ currentStep }: Props) {
  const steps = [
    { label: "دانلود اپ", icon: <IconDownloadApp /> },
    { label: "اسکن QR", icon: <IconScanQRcode /> },
    { label: "کد تأیید", icon: <IconSmsTracking /> },
  ];

  return (
    <div className="flex items-center justify-center flex-row py-8 gap-2">
      {steps.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-1">
            <span
              className={`lg:w-9 lg:h-9 w-6 h-6 ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                 ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {index < currentStep ? item.icon : item.icon}
            </span>
            <span
              className={`lg:text-lg text-xs ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                  ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {item.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className="flex-none lg:w-24 w-12 h-0"
              style={{
                border: `2px dashed ${
                  index < currentStep ? "#0B60FF" : "#8792AF"
                }`,
              }}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}