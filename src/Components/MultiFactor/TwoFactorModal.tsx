import { useState } from "react";
import { useForm } from "react-hook-form";
import OTPModal from "../OTPModal";
import { apiRequest } from "../../utils/apiClient";
import tickCircle from "../../assets/Icons/MultiFactor/tick-circle.png";
import IconClose from "../../assets/Icons/Login/IconClose";
import IconAgain from "../../assets/Icons/Login/IconAgain";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import { toast } from "react-toastify";

interface PropModal {
  type?: string;
  closeModal: () => void;
}

interface ModalForm {
  code: string;
}

export default function TwoFactorModal({ type, closeModal }: PropModal) {
  const { data: twoFAData, refresh } = UseTwoStepVerification()
  const [step, setStep] = useState(1);

  const { handleSubmit, setValue, watch } = useForm<ModalForm>({
    defaultValues: { code: "" },
  });

  const code = watch("code");

  const onSubmit = async () => {
    try {
      if (step === 1) {
        // مرحله 1: ارسال کد بدون body
        await apiRequest({ url: `/api/account/2fa/verify/${type}`, method: "POST" });
        setStep(2);
      } else if (step === 2) {
        // مرحله 2: تأیید کد همراه body
        await apiRequest({
          url: `/api/account/2fa/verify/${type}`,
          method: "POST",
          data: { code },
        });
        setStep(3);
        refresh()
      }
    } catch (error) {
      toast.error(  error?.response?.data?.msg || "خطایی رخ داده است.");
    }
  };

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
              ? "لطفاً کد ارسالی به شماره 0939934883 را وارد کنید"
              : "لطفاً کد ارسالی به ایمیل شما را وارد کنید"}
          </p>
          <div className="flex justify-center">
            <OTPModal length={6} onChange={(val) => setValue("code", val)} />
          </div>
          <div className="flex items-center justify-between text-gray12 mb-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={handleSubmit(onSubmit)}>
              <span className="icon-wrapper w-5 h-5">
                <IconAgain />
              </span>
              <span>ارسال مجدد</span>
            </div>
            <span>ارسال مجدد کد تا 2:30</span>
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
        <div className="flex flex-col items-center lg:gap-6 gap-4">
          <img className="w-20 h-20" src={tickCircle} alt="tickCircle" />
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
        className="relative bg-black4 rounded-lg shadow-lg text-right lg:w-[30%] w-full mx-4 lg:p-8 p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between flex-row-reverse">
          {(step === 1 || step === 2) && (
            <button onClick={closeModal}>
              <span className="icon-wrapper w-6 h-6">
                <IconClose />
              </span>
            </button>
          )}
          <h2 className="lg:text-lg lg:font-bold text-black1 text-sm font-normal">
            {(step === 1 || step === 2) &&
              (type === "sms"
                ? "تأیید دو مرحله‌ای پیامک"
                : "تأیید دو مرحله‌ای ایمیل")}
          </h2>
        </div>
        <div className="flex flex-col w-full">{getContent()}</div>
      </div>
    </div>
  );
}
