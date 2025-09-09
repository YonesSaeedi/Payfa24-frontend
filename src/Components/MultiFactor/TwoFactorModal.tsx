import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import TextField from "../InputField/TextField";
import IconEyeOpen from "../../assets/Icons/Login/IconEyeOpen";
import IconEyeClosed from "../../assets/Icons/Login/IconEyeClosed";
import IconClose from "../../assets/Icons/Login/IconClose";
import OTPModal from "../OTPModal";
import tickCircle from "../../assets/Icons/MultiFactor/tick-circle.png";
import IconAgain from "../../assets/Icons/Login/IconAgain";

type ModalData = {
  password: string;
};

interface PropModal {
  type: "sms" | "email";
  closeModal: () => void;
}

export default function TwoFactorModal({ type, closeModal }: PropModal) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModalData>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: ModalData) => {
    if (step === 1) setStep(2);
  };

  const getContent = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <p className="mb-8 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5">
            لطفا رمز عبور خود را وارد کنید
          </p>
          <Controller
            name="password"
            control={control}
            rules={{ required: "رمز عبور را وارد کنید." }}
            render={({ field }) => (
              <TextField
                label="رمز عبور خود را وارد کنید"
                type={showPassword ? "text" : "password"}
                icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                error={errors.password?.message}
                onIconClick={() => setShowPassword((prev) => !prev)}
                labelBgClass="bg-black4"
                {...field}
              />
            )}
          />
          <button
            type="submit"
            className="lg:mt-12 mt-8 w-full py-3 rounded-lg bg-blue2 text-white2 font-medium text-sm"
          >
            تأیید
          </button>
        </form>
      );
    } else if (step === 2) {
      return (
        <div className="w-full ">
          <p className="lg:mb-8 mb-6 lg:mt-12 mt-8 lg:text-lg text-sm font-normal text-gray5 ">
            {type === "sms"
              ? "لطفاً کد ارسالی به شماره 0939934883 را وارد کنید"
              : "لطفاً کد ارسالی به ایمیل شما را وارد کنید"}
          </p>
          <div className="flex justify-center ">
            <OTPModal
              length={5}
              onChange={(code) => console.log("کد:", code)}
            />
          </div>
          <div className="flex items-center justify-between text-gray12 mb-4">
            <div className="flex items-center gap-1">
              <span className="icon-wrapper w-5 h-5">
                <IconAgain />
              </span>
              <span>ارسال مجدد</span>
            </div>
            <span>ارسال مجدد کد تا 2:30</span>
          </div>
          <button
            onClick={() => setStep(3)}
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
          {step === 1 || step === 2 ? (
            <button onClick={closeModal}>
              <span className="icon-wrapper w-6 h-6">
                <IconClose />
              </span>
            </button>
          ) : (
            " "
          )}
          <h2 className="lg:text-lg lg:font-bold text-black1 text-sm font-normal">
            {(step === 1 || step === 2) && type === "sms"
              ? "تأیید دو مرحله‌ای پیامک"
              : (step === 1 || step === 2) && type === "email"
              ? "تأیید دو مرحله‌ای ایمیل"
              : ""}
          </h2>
        </div>
        <div className="flex flex-col w-full ">{getContent()}</div>
      </div>
    </div>
  );
}



