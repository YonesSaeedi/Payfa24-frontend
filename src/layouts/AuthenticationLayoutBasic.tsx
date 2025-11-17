import React from "react";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import AuthenticationRight from "../components/authenticationRight";
import AuthenticationLeft from "../components/authenticationLeft";

type AuthenticationLayoutProps = {
  step: number;
  started: boolean;
  onStart: () => void;
  children?: React.ReactNode;
};

export default function AuthenticationLayoutBasic({
  step,
  started,
  onStart,
  children,
}: AuthenticationLayoutProps) {
  return (
    <div className="w-full bg-white1">
      <div className="w-full lg:container-style lg:mt-4 mt-7 px-4 py-2">
        <BreadcrumbNavigation />
      </div>

      <div className="w-full lg:container-style flex flex-col pb-14 lg:mt-9 md:flex-row px-0 lg:px-8 items-center">
        {/* سمت چپ */}
        <div
          className={`w-full h-full flex items-center justify-center  ${
            !started ? " lg:flex hidden lg:px-5 mb-20" : "lg:w-full flex"
          }`}
        >
          {!started ? (
            <AuthenticationLeft
              step={step}
              text2="لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد . "
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {children}
            </div>
          )}
        </div>

        {/* سمت راست */}
        <div
          className={`w-full lg:p-0 p-4 flex items-center justify-center ${
            !started ? "lg:lg:w-5/6 flex" : "lg:flex hidden"
          }`}
        >
          <AuthenticationRight step={step} onStart={onStart} />
        </div>
      </div>
    </div>
  );
}
// import React from "react";
// import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
// import AuthenticationRight from "../components/authenticationRight";
// import AuthenticationLeft from "../components/authenticationLeft";

// type AuthenticationLayoutProps = {
//   step: number;
//   started: boolean;
//   onStart: () => void;
//   children?: React.ReactNode;
// };

// export default function AuthenticationLayoutBasic({ step, onStart }: AuthenticationLayoutProps) {
//   return (
//     <div className="w-full bg-white1">
//       <div className="w-full lg:container-style lg:mt-4 mt-7 px-4 py-2">
//         <BreadcrumbNavigation />
//       </div>

//       <div className="w-full lg:container-style flex flex-col lg:flex-row pb-14 lg:mt-9 px-0 lg:px-8 items-start gap-8">
//         <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:px-5 min-h-[300px]">
//           <AuthenticationLeft step={step} text2="لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد." />
//         </div>
//         <div className="w-full lg:w-1/2 flex items-start justify-center lg:p-0 p-4">
//           <AuthenticationRight step={step} onStart={onStart} />
//         </div>
//       </div>
//     </div>
//   );
// }
