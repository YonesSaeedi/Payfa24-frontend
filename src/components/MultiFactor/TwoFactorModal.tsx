// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import OTPModal from "../OTPModal";
// import { apiRequest } from "../../utils/apiClient";
// import tickCircle from "../../assets/icons/MultiFactor/tick-circle.png";
// import IconClose from "../../assets/icons/Login/IconClose";
// import IconAgain from "../../assets/icons/Login/IconAgain";
// import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";

// interface PropModal {
//   type?: string;
//   closeModal: () => void;
// }
// interface ModalForm {
//   code: string;
// }

// export default function TwoFactorModal({ type, closeModal }: PropModal) {
//   const [resendTimer, setResendTimer] = useState(150);
//   const [canResend, setCanResend] = useState(false);
//   const { refetch } = UseTwoStepVerification();
//   const [step, setStep] = useState(1);
//   const { handleSubmit, setValue, watch } = useForm<ModalForm>({ defaultValues: { code: "" } });
//   const code = watch("code");
//   const onSubmit = async () => {
//     try {
//       if (step === 1) {
//         // مرحله 1: ارسال کد بدون body
//         await apiRequest({ url: `/account/2fa/verify/${type}`, method: "POST" });
//         setStep(2);
//       } else if (step === 2) {
//         // مرحله 2: تأیید کد همراه body
//         await apiRequest({ url: `/account/2fa/verify/${type}`, method: "POST", data: { code } });
//         setStep(3);
//         refetch();
//       }
//     } catch (err) {
//       const error = err as AxiosError<{ msg?: string }>;
//       toast.error(error.response?.data?.msg || "خطایی رخ داده است.");
//     }
//   };
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isOpen && resendTimer > 0) {
//       interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
//     } else if (resendTimer === 0) {
//       setCanResend(true);
//     }
//     return () => clearInterval(interval);
//   }, [isOpen, resendTimer]);
//   // =======================================================================================================================================
//   const getContent = () => {
//     if (step === 1) {
//       return (
//         <div className="w-full">
//           <p className="mb-8 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5">
//             برای فعال سازی ابتدا بر روی دکمه ارسال کد تایید بزنید تا پیامک یا ایمیل حاوی کد فعالسازی برای شما ارسال شود.
//           </p>
//           <button onClick={handleSubmit(onSubmit)} className="lg:mt-12 mt-8 w-full py-3 rounded-lg bg-blue2 text-white2 font-medium text-sm">
//             ارسال کد تایید
//           </button>
//         </div>
//       );
//     } else if (step === 2) {
//       return (
//         <div className="w-full">
//           <p className="lg:mb-8 mb-6 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5">
//             {type === "sms" ? "لطفاً کد ارسالی به شماره 0939934883 را وارد کنید" : "لطفاً کد ارسالی به ایمیل شما را وارد کنید"}
//           </p>
//           <div className="flex justify-center">
//             <OTPModal length={6} onChange={(val) => setValue("code", val)} />
//           </div>
//           <div className="flex items-center justify-between text-gray12 mb-4">
//             <div className="flex items-center gap-1 cursor-pointer" onClick={handleSubmit(onSubmit)}>
//               <span className="icon-wrapper w-5 h-5">
//                 <IconAgain />
//               </span>
//               <span>ارسال مجدد</span>
//             </div>
//             <p>
//               ارسال مجدد کد تا {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, "0")}
//             </p>
//           </div>
//           <button onClick={handleSubmit(onSubmit)} className="w-full py-3 rounded-lg text-white2 bg-blue2 font-bold">
//             تأیید
//           </button>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-full flex flex-col items-center lg:gap-6 gap-4">
//           <img className="w-[72px] h-[72px]" src={tickCircle} alt="tickCircle" />
//           <p className="font-medium lg:text-xl text-sm text-black0">
//             {type === "sms" ? "ورود دو مرحله‌ای با پیامک با موفقیت فعال شد!" : "ورود دو مرحله‌ای با ایمیل با موفقیت فعال شد!"}
//           </p>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
//       <div className="relative bg-black4 rounded-lg shadow-lg text-right lg:max-w-lg max-w-md  mx-4 lg:p-8 p-4 flex flex-col" onClick={(e) => e.stopPropagation()} dir="rtl">
//         <div className="flex items-center justify-between flex-row-reverse">
//           {(step === 1 || step === 2) && (
//             <button onClick={closeModal}>
//               <span className="icon-wrapper w-6 h-6">
//                 <IconClose />
//               </span>
//             </button>
//           )}
//           <h2 className="lg:text-lg lg:font-bold text-black1 text-sm font-normal">
//             {(step === 1 || step === 2) && (type === "sms" ? "تأیید دو مرحله‌ای پیامک" : "تأیید دو مرحله‌ای ایمیل")}
//           </h2>
//         </div>
//         <div className="flex flex-col w-full">{getContent()}</div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OTPModal from "../OTPModal";
import { apiRequest } from "../../utils/apiClient";
import tickCircle from "../../assets/icons/MultiFactor/tick-circle.png";
import IconClose from "../../assets/icons/Login/IconClose";
import IconAgain from "../../assets/icons/Login/IconAgain";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { toPersianDigits } from "../../components/Deposit/CardToCardTransfer";

interface PropModal {
  type?: string;
  closeModal: () => void;
  userMobile?: string; // شماره موبایل کاربر
  userEmail?: string; // ایمیل کاربر
}
interface ModalForm {
  code: string;
}

export default function TwoFactorModal({ type, closeModal, userMobile, userEmail }: PropModal) {
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const { refetch } = UseTwoStepVerification();
  const [step, setStep] = useState(1);
  const RESEND_TIMER_DURATION = 150; // 2 دقیقه و 30 ثانیه
  
  const { handleSubmit, setValue, watch } = useForm<ModalForm>({ 
    defaultValues: { code: "" } 
  });
  
  const code = watch("code");

  // تابع برای شروع تایمر ارسال مجدد
  const startResendTimer = () => {
    setResendTimer(RESEND_TIMER_DURATION);
    setCanResend(false);
  };

  // تابع برای ارسال مجدد کد
  const handleResendCode = async () => {
    if (!canResend && resendTimer > 0) return;

    try {
      await apiRequest({ 
        url: `/account/2fa/verify/${type}`, 
        method: "POST" 
      });
      
      startResendTimer(); // شروع مجدد تایمر از 2:30
      toast.success("کد تأیید مجدداً ارسال شد");
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      toast.error(error.response?.data?.msg || "خطا در ارسال مجدد کد");
    }
  };

  // تابع سابمیت اصلی
  const onSubmit = async () => {
    try {
      if (step === 1) {
        // مرحله 1: ارسال کد اولیه
        await apiRequest({ 
          url: `/account/2fa/verify/${type}`, 
          method: "POST" 
        });
        setStep(2);
        startResendTimer(); // شروع تایمر پس از ارسال اولیه
      } else if (step === 2) {
        // مرحله 2: تأیید کد
        await apiRequest({ 
          url: `/account/2fa/verify/${type}`, 
          method: "POST", 
          data: { code } 
        });
        setStep(3);
        refetch();
      }
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      toast.error(error.response?.data?.msg || "خطایی رخ داده است.");
    }
  };

  // مدیریت تایمر
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // تابع برای فرمت کردن زمان تایمر
  const formatTimer = () => {
    const minutes = Math.floor(resendTimer / 60);
    const seconds = resendTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // =======================================================================================================================================
  const getContent = () => {
    if (step === 1) {
      return (
        <div className="w-full">
          <p className="mb-8 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5">
            برای فعال سازی ابتدا بر روی دکمه ارسال کد تایید بزنید تا پیامک یا ایمیل حاوی کد فعالسازی برای شما ارسال شود.
          </p>
          <button 
            onClick={handleSubmit(onSubmit)} 
            className="lg:mt-12 mt-8 w-full py-3 rounded-lg bg-blue2 text-white2 font-medium text-sm"
          >
            ارسال کد تایید
          </button>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="w-full">
          <p className="lg:mb-8 mb-6 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5">
            {type === "sms" 
              ? `لطفاً کد ارسالی به شماره ${toPersianDigits(userMobile || "...")} را وارد کنید` 
              : `لطفاً کد ارسالی به ایمیل ${userEmail || "..."} را وارد کنید`}
          </p>
          
          <div className="flex justify-center">
            <OTPModal 
              length={6} 
              onChange={(val) => setValue("code", val)} 
            />
          </div>
          
          <div className="flex items-center justify-between text-gray12 mb-4">
            {/* قسمت سمت چپ: دکمه ارسال مجدد */}
            <div 
              className={`flex items-center gap-1 ${canResend ? 'cursor-pointer text-blue2' : 'cursor-not-allowed opacity-50'}`}
              onClick={canResend ? handleResendCode : undefined}
            >
              <span className="icon-wrapper w-5 h-5">
                <IconAgain />
              </span>
              <span>ارسال مجدد</span>
            </div>
            
            {/* قسمت سمت راست: تایمر */}
            <div className="flex items-center gap-1 text-gray12">
              <span>ارسال مجدد کد تا</span>
              <span className=" min-w-[40px] text-right">
                {toPersianDigits(formatTimer())}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit(onSubmit)} 
            className="w-full py-3 rounded-lg text-white2 bg-blue2 font-bold"
          >
            تأیید
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-full flex flex-col items-center lg:gap-6 gap-4">
          <img className="w-[72px] h-[72px]" src={tickCircle} alt="tickCircle" />
          <p className="font-medium lg:text-xl text-sm text-black0">
            {type === "sms" 
              ? "ورود دو مرحله‌ای با پیامک با موفقیت فعال شد!" 
              : "ورود دو مرحله‌ای با ایمیل با موفقیت فعال شد!"}
          </p>
        </div>
      );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={closeModal}
    >
      <div 
        className="relative bg-black4 rounded-lg shadow-lg text-right lg:max-w-lg max-w-md mx-4 lg:p-8 p-4 flex flex-col" 
        onClick={(e) => e.stopPropagation()} 
        dir="rtl"
      >
        <div className="flex items-center justify-between flex-row-reverse">
          {(step === 1 || step === 2) && (
            <button onClick={closeModal}>
              <span className="icon-wrapper w-6 h-6 text-gray12">
                <IconClose />
              </span>
            </button>
          )}
          <h2 className="lg:text-lg lg:font-bold text-black1 text-sm font-normal">
            {(step === 1 || step === 2) && 
              (type === "sms" ? "تأیید دو مرحله‌ای پیامک" : "تأیید دو مرحله‌ای ایمیل")}
          </h2>
        </div>
        <div className="flex flex-col w-full">
          {getContent()}
        </div>
      </div>
    </div>
  );
}