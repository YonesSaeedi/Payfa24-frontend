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

// TwoFactorModal.tsx (نسخه اصلاح شده)

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import OTPModal from "../OTPModal"; // دیگه نیازی نیست
// import OTPInputModal from "../../"; // اینو اضافه کن
import { apiRequest } from "../../utils/apiClient";
import tickCircle from "../../assets/icons/MultiFactor/tick-circle.png";
import IconClose from "../../assets/icons/Login/IconClose";
// import IconAgain from "../../assets/icons/Login/IconAgain";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { toPersianDigits } from "../../components/Deposit/CardToCardTransfer";
import OTPInputModal from "../trade/OTPInputModal";

interface PropModal {
  type?: string;
  closeModal: () => void;
  userMobile?: string;
  userEmail?: string;
}
interface ModalForm {
  code: string;
}

export default function TwoFactorModal({ type, closeModal, userMobile, userEmail }: PropModal) {
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const { refetch } = UseTwoStepVerification();
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState(""); // اضافه شده
  const [isSubmitting, setIsSubmitting] = useState(false); // اضافه شده
  const RESEND_TIMER_DURATION = 150;
  
  const { handleSubmit, setValue } = useForm<ModalForm>({ 
    defaultValues: { code: "" } 
  });
  

  // تابع برای شروع تایمر ارسال مجدد
  const startResendTimer = () => {
    setResendTimer(RESEND_TIMER_DURATION);
    setCanResend(false);
  };

  // تابع برای ارسال مجدد کد - حالا از OTPInputModal استفاده میکنیم
  const handleResendCode = async () => {
    if (!canResend && resendTimer > 0) return;

    try {
      setIsSubmitting(true);
      await apiRequest({ 
        url: `/account/2fa/verify/${type}`, 
        method: "POST" 
      });
      
      startResendTimer();
      toast.success("کد تأیید مجدداً ارسال شد");
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      toast.error(error.response?.data?.msg || "خطا در ارسال مجدد کد");
    } finally {
      setIsSubmitting(false);
    }
  };

  // هندل تغییر OTP
  const handleOtpChange = (val: string) => {
    setOtpCode(val);
    setValue("code", val);
  };

  // تابع سابمیت اصلی
  const onSubmit = async () => {
    try {
      if (step === 1) {
        // مرحله 1: ارسال کد اولیه
        setIsSubmitting(true);
        await apiRequest({ 
          url: `/account/2fa/verify/${type}`, 
          method: "POST" 
        });
        setStep(2);
        startResendTimer();
      }
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      toast.error(error.response?.data?.msg || "خطایی رخ داده است.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تابع تأیید OTP (برای استفاده در OTPInputModal)
  const handleConfirmOTP = async () => {
    try {
      setIsSubmitting(true);
      await apiRequest({ 
        url: `/account/2fa/verify/${type}`, 
        method: "POST", 
        data: { code: otpCode } 
      });
      setStep(3);
      refetch();
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      toast.error(error.response?.data?.msg || "خطایی رخ داده است.");
    } finally {
      setIsSubmitting(false);
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

  // =======================================================================================================================================
  const getContent = () => {
    if (step === 1) {
      return (
        <div className="w-full">
          <p className="mb-8 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5 text-center">
            برای فعال سازی ابتدا بر روی دکمه ارسال کد تایید بزنید تا پیامک یا ایمیل حاوی کد فعالسازی برای شما ارسال شود.
          </p>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className={`lg:mt-12 mt-8 w-full py-3 rounded-lg font-medium text-sm
              ${isSubmitting ? 'bg-blue2 cursor-not-allowed' : 'bg-blue2 text-white2 hover:bg-blue1'}`}
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال کد تایید'}
          </button>
        </div>
      );
    } else if (step === 2) {
      // حالا از OTPInputModal استفاده میکنیم
      return (
        <OTPInputModal
          closeModal={closeModal}
          onChange={handleOtpChange}
          onSubmit={handleConfirmOTP}
          handleResendCode={handleResendCode}
          isSubmitting={isSubmitting}
          mainText={
            type === "sms" 
              ? `لطفاً کد ارسالی به شماره ${toPersianDigits(userMobile || "...")} را وارد کنید` 
              : `لطفاً کد ارسالی به ایمیل ${userEmail || "..."} را وارد کنید`
          }
          titleText={type === "sms" ? "تأیید دو مرحله‌ای پیامک" : "تأیید دو مرحله‌ای ایمیل"}
          resendCodeTimeLeft={resendTimer}
          submitButtonText="تأیید"
          OTPLength={6}
        />
      );
    } else {
      return (
        <div className="w-full flex flex-col items-center lg:gap-6 gap-4 py-3">
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
      onClick={step !== 2 ? closeModal : undefined} // فقط در step 2 کلیک روی background مودال را نبندد
    >
      <div 
        className="relative bg-black4 rounded-lg shadow-lg text-right lg:max-w-lg max-w-md mx-4 lg:p-8 p-4 flex flex-col" 
        onClick={(e) => e.stopPropagation()} 
        dir="rtl"
      >
        {step == 1 && ( // در step 2 هدر را نشان نده چون OTPInputModal هدر خودش را دارد
          <div className="flex items-center justify-between flex-row-reverse mb-6">
            <button onClick={closeModal} className="p-1">
              <span className="icon-wrapper w-6 h-6 text-gray12 hover:text-red-500">
                <IconClose />
              </span>
            </button>
            <h2 className="lg:text-lg lg:font-bold text-black1 text-sm font-normal">
              {type === "sms" ? "تأیید دو مرحله‌ای پیامک" : "تأیید دو مرحله‌ای ایمیل"}
            </h2>
          </div>
        )}
        
        <div className="flex flex-col w-full">
          {getContent()}
        </div>
      </div>
    </div>
  );
}