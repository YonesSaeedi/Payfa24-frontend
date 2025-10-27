// import React from "react";
// import Google from "../../../assets/Icons/MultiFactor/Google.png";
// // import StepperGoogle from "../../components/MultiFactor/Stepper/StepperGoogle";
// // import { useState } from "react";

// export default function DownloadApp({ onNext }: { onNext: () => void }) {
//   return (
//     <div className="flex items-center flex-col gap-6 bg-slate-400">
//       <img className="w-16 h-16" src={Google} alt="Google" />
//       <p className="lg:text-lg text-sm font-normal text-gray5">
//         در صورت نصب نداشتن برنامه Google Authenticator بر روی گوشی خود می‌توانید
//         از طریق لینک زیر دانلود کنید.
//       </p>

//       <div className="w-full flex flex-col gap-4 mt-32  lg:px-8 ">
//         <button
//           type="button"
//           className="w-full text-lg font-bold text-blue2 py-2 rounded-lg border border-blue2"
//         >
//           دانلود برنامه
//         </button>
//         <button
//           onClick={onNext}
//           className="w-full py-3 font-bold text-lg bg-blue2  rounded-lg text-white2"
//         >
//           ادامه
//         </button>
//       </div>
//     </div>
//   );
// }


import Google from "../../../assets/Icons/MultiFactor/Google.png";

interface DownloadAppPageProps {
  onNext: () => void; // تابع بدون ورودی و خروجی خاص
}

export default function DownloadAppPage({ onNext }: DownloadAppPageProps) {
  return (
    <div className="flex w-full flex-col items-center text-center gap-6" dir="rtl">
      <img className="w-16 h-16" src={Google} alt="Google" />
      <p className="lg:text-lg text-sm font-normal text-gray5">
        در صورت نصب نداشتن برنامه Google Authenticator بر روی گوشی خود میتوانید
        از طریق لینک زیر دانلود کنید.
      </p>
      <div className="w-full flex flex-col gap-4 mb-0 lg:mt-8 mt-48 lg:px-8">
        <button className="w-full py-3 font-bold text-lg text-blue2 rounded-lg border border-blue2">
          دانلود برنامه
        </button>
        <button
          onClick={onNext}
          className="w-full py-3 font-bold text-lg bg-blue2 rounded-lg text-white2"
        >
          ادامه
        </button>
      </div>
    </div>
  );
}
