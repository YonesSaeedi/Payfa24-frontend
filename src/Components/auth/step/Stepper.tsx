// import React from "react";
// import EmailIcon from "../../../assets/Icons/authentication/EmailIcon";
// import IconUserOctagon from "../../../assets/Icons/authentication/IconUserOctagon";
// import IconcardBank from "../../../assets/Icons/authentication/IconcardBank";


// type StepperProps = {
//   currentStep: number;
// };
// export const StepperComponent: React.FC = ({currentStep} :StepperProps) => {

//   return (
//     <div className="flex items-center justify-center py-8  gap-2">
//       <div className="flex items-center flex-col gap-1 ">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 1 ? "text-blue2" : "text-gray12"}`}>
//           <IconcardBank />
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >=  ? "text-blue2" : "text-gray12"}`}>کارت بانکی</span>
//       </div>
//       <div
//         className="flex-none lg:w-24 w-12 h-0"
//         style={{
//           border: "2px dashed #8792AF",
//         }}
//       ></div>
//       <div className="flex items-center flex-col gap-1 ">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 2 ? "text-blue2" : "text-gray12"}`}>
//           <IconUserOctagon />
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >= 2 ? "text-blue2" : "text-gray12"}`}> مشخصات فردی</span>
//       </div>
//       <div
//         className="flex-none lg:w-24 w-12 h-0"
//         style={{
//           border: "2px dashed #8792AF", 
//         }}
//       ></div>
//       <div className="flex items-center flex-col gap-1">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 3 ? "text-blue2" : "text-gray12"}`}>
//           <EmailIcon />
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >= 3 ? "text-blue2" : "text-gray12"}`}> ثبت ایمیل</span>
//       </div>
//     </div>
//   );
// };

// export default StepperComponent;

///////////////////////////////////////////////////

// import EmailIcon from "../../../assets/Icons/authentication/EmailIcon";
// import IconUserOctagon from "../../../assets/Icons/authentication/IconUserOctagon";
// import IconcardBank from "../../../assets/Icons/authentication/IconcardBank";
// type StepperProps = {
//   currentStep: number;
// };

// export const StepperComponent: React.FC<StepperProps> = ({ currentStep }) => {
//   return (
//     <div className="flex items-center justify-center py-8 gap-2">
//       {/* مرحله 1 */}
//       <div className="flex items-center flex-col gap-1">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 1 ? "text-blue2" : "text-gray12"}`}>
//           <IconcardBank />
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >= 1 ? "text-blue2" : "text-gray12"}`}>کارت بانکی</span>
//       </div>

//       {/* خط */}
//       <div
//         className="flex-none lg:w-24 w-12 h-0"
//         style={{ border: `2px dashed ${currentStep > 1 ? "#0B60FF" : "#8792AF"}` }}
//       ></div>

//       {/* مرحله 2 */}
//       <div className="flex items-center flex-col gap-1">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 2 ? "text-blue2" : "text-gray12"}`}>
//           <IconUserOctagon />
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >= 2 ? "text-blue2" : "text-gray12"}`}>مشخصات فردی</span>
//       </div>

//       {/* خط */}
//       <div
//         className="flex-none lg:w-24 w-12 h-0"
//         style={{ border: `2px dashed ${currentStep > 2 ? "#0B60FF" : "#8792AF"}` }}
//       ></div>

//       {/* مرحله 3 */}
//       <div className="flex items-center flex-col gap-1">
//         <span className={`lg:w-9 lg:h-9 w-6 h-6 ${currentStep >= 3 ? "text-blue2" : "text-gray12"}`}>
//           <EmailIcon/>
//         </span>
//         <span className={`lg:text-lg text-xs ${currentStep >= 3 ? "text-blue2" : "text-gray12"}`}>ثبت ایمیل</span>
//       </div>
//     </div>
//   );
// };

///////////////////////////////////////////////





// // Stepper.tsx
// import React from "react";
// import EmailIcon from "../../../assets/Icons/authentication/EmailIcon";
// import IconUserOctagon from "../../../assets/Icons/authentication/IconUserOctagon";
// import IconcardBank from "../../../assets/Icons/authentication/IconcardBank";

// type StepperProps = {
//   currentStep: number;
// };

// const StepperComponent: React.FC<StepperProps> = ({ currentStep }) => {
//   const steps = [
//     { label: "کارت بانکی", icon: <IconcardBank /> },
//     { label: "مشخصات فردی", icon: <IconUserOctagon /> },
//     { label: "ثبت ایمیل", icon: <EmailIcon /> },
//   ];

//   return (
//     <div className="flex items-center justify-center py-8 gap-2">
//     {steps.map((step, index) => (
//   <React.Fragment key={index}>
//     <div className="flex flex-col items-center gap-1">
//       <span
//         className={`lg:w-9 lg:h-9 w-6 h-6 ${
//           index < currentStep - 1
//             ? "text-blue2" // مرحله قبل تکمیل شده
//             : index === currentStep - 1
//             ? "text-blue2" // مرحله فعلی
//             : "text-gray12" // مرحله بعدی
//         }`}
//       >
//         {step.icon}
//       </span>
//       <span
//         className={`lg:text-lg text-xs ${
//           index < currentStep - 1
//             ? "text-blue2"
//             : index === currentStep - 1
//             ? "text-blue2"
//             : "text-gray12"
//         }`}
//       >
//         {step.label}
//       </span>
//     </div>

//     {index < steps.length - 1 && (
//       <div
//         className="flex-none lg:w-24 w-12 h-0"
//         style={{
//           border: `2px dashed ${
//             index < currentStep - 1 ? "#0B60FF" : "#8792AF"
//           }`,
//         }}
//       ></div>
//     )}
//   </React.Fragment>
// ))}

//     </div>
//   );
// };

// export default StepperComponent;






import React from "react";
import EmailIcon from "../../../assets/Icons/authentication/EmailIcon";
import IconUserOctagon from "../../../assets/Icons/authentication/IconUserOctagon";
import IconcardBank from "../../../assets/Icons/authentication/IconcardBank";

type StepperProps = {
  currentStep: number;
};

const StepperComponent: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { label: "ثبت ایمیل", icon: <EmailIcon /> },
    { label: "مشخصات فردی", icon: <IconUserOctagon /> },
    { label: "کارت بانکی", icon: <IconcardBank /> }, 
  ];

  return (
    <div className="flex items-center justify-center flex-row-reverse py-8 gap-2">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-1">
            <span
              className={`lg:w-9 lg:h-9 w-6 h-6 ${
                index < currentStep ? "text-blue2" : index === currentStep - 1 ? "text-blue2" : "text-gray12"
              }`}
            >
              {step.icon}
            </span>
            <span
              className={`lg:text-lg text-xs ${
                index < currentStep ? "text-blue2" : index === currentStep - 1 ? "text-blue2" : "text-gray12"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className="flex-none lg:w-24 w-12 h-0"
              style={{
                border: `2px dashed ${index < currentStep - 1 ? "#0B60FF" : "#8792AF"}`,
              }}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepperComponent;