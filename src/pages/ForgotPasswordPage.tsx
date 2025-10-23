// ✳️ کد کامل و به‌روز
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";

import AuthLayout from "../layouts/AuthLayout";
import imageForgetDark from "../assets/imageForgetDark.png";
import imageForgetLight from "../assets/imageForgetLight.png";
import { ThemeContext } from "../context/ThemeContext";
import TextField from "../components/InputField/TextField";
import { getForgotPasswordSchema } from "../utils/validationSchemas";
import { apiRequest } from "../utils/apiClient";
import OTPModal from "../components/OTPModal";
import IconAgain from "../assets/Icons/Login/IconAgain";
import IconClose from "../assets/Icons/Login/IconClose";

type FormData = {
  email: string;
};

const DISABLE_DURATION = 120; // مدت زمان قفل شدن دکمه (ثانیه)
const STORAGE_KEY = "forget_button_disable_until";

export default function ForgotPasswordPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const schema = getForgotPasswordSchema();

  const [isOpen, setIsOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("email");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const [disableButton, setDisableButton] = useState(false);
  const [disableTimer, setDisableTimer] = useState(0);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const iranMobileRegex = /^09\d{9}$/;

  const buildPayload = (value: string, recaptcha: string, code: string | null) => {
    const trimmed = value.trim();
    if (emailRegex.test(trimmed)) return { code, email: trimmed, recaptcha };
    if (iranMobileRegex.test(trimmed)) return { code, mobile: trimmed, recaptcha };
    throw new Error("ایمیل یا شماره موبایل معتبر نیست.");
  };

  // 📦 بازیابی وضعیت دکمه بعد از رفرش
  useEffect(() => {
    const savedExpire = localStorage.getItem(STORAGE_KEY);
    if (savedExpire) {
      const remaining = Math.floor((parseInt(savedExpire) - Date.now()) / 1000);
      if (remaining > 0) {
        setDisableButton(true);
        setDisableTimer(remaining);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // 🔁 تایمر دکمه
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (disableButton && disableTimer > 0) {
      interval = setInterval(() => {
        setDisableTimer(prev => {
          if (prev <= 1) {
            setDisableButton(false);
            localStorage.removeItem(STORAGE_KEY);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [disableButton, disableTimer]);

  // 🔁 تایمر OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const onSubmit = async (data: FormData) => {
    if (!executeRecaptcha) return;
    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");
      setFormData(data);
      const payload = buildPayload(data.email, recaptchaToken, "");
      const response = await apiRequest({ url: "/api/auth/forget", method: "POST", data: payload });

      if (response.status) {
        setContactMethod(emailRegex.test(data.email) ? "email" : "phone");
        setIsOpen(true);
        setResendTimer(120);
        setCanResend(false);

        const expireTime = Date.now() + DISABLE_DURATION * 1000;
        localStorage.setItem(STORAGE_KEY, expireTime.toString());
        setDisableButton(true);
        setDisableTimer(DISABLE_DURATION);
      } else {
        console.error("Forgot password failed:", response);
      }
    } catch (err: any) {
      toast.error(err.response?.data.msg || "خطا در ارسال");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!executeRecaptcha || !formData || otpCode.length !== 6) return;
    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password_confirm");
      const payload = buildPayload(formData.email, recaptchaToken, otpCode);
      const response = await apiRequest({ url: "/api/auth/forget", method: "POST", data: payload });

      if (response.status) {
        setIsOpen(false);
        navigate("/forgot-password-set-password", {
          state: { username: formData.email, tokenForget: response.tokenForget },
        });
      } else {
        console.error("OTP confirm failed:", response);
      }
    } catch (err: any) {
      console.error("OTP confirm error:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData || !executeRecaptcha) return;
    setResendTimer(120);
    setCanResend(false);
    await onSubmit(formData);
  };

  return (
    <AuthLayout image={theme === "dark" ? imageForgetDark : imageForgetLight}>
      <div className="flex items-center justify-center pb-8 w-full" dir="rtl">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex items-center flex-col px-10">
            <h1 className="lg:text-[28px] text-[20px] font-bold text-blue2 mb-3 text-center">
              فراموشی رمز عبور
            </h1>
            <p className="font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] text-black1">
              برای بازیابی رمز عبور ایمیل یا شماره همراه خود را وارد کنید
            </p>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  label="ایمیل یا شماره همراه"
                  type="text"
                  error={errors.email?.message}
                  {...field}
                  labelBgClass="bg-white4"
                  showError=" "
                />
              )}
            />

            <button
              type="submit"
              disabled={disableButton || isLoading}
              className={`h-[48px] w-full rounded-xl font-bold text-lg text-white transition-colors duration-300 ${
                disableButton ? "bg-gray5 cursor-not-allowed" : "bg-blue2"
              } lg:mt-14 mt-12`}
            >
              {isLoading
                ? "در حال بررسی..."
                : disableButton
                ? `لطفا ${disableTimer} ثانیه صبر کنید`
                : "ادامه"}
            </button>
          </form>
        </div>
      </div>

      {/* --- OTP Modal --- */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
            <div
              className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center flex-row-reverse justify-between">
                <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                  {contactMethod === "phone" ? "تایید شماره همراه" : "تایید ایمیل"}
                </h2>
                <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={() => setIsOpen(false)}>
                  <IconClose />
                </span>
              </div>

              <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24" dir="rtl">
                لطفا کد ارسالی به{" "}
                {contactMethod === "phone" ? `شماره ${getValues("email")}` : `ایمیل ${getValues("email")}`} را وارد کنید.
              </p>

              <div className="mt-[32px] mb-[48px]">
                <OTPModal length={6} onChange={(val: string) => setOtpCode(val)} />
              </div>

              <div className="flex justify-between flex-row-reverse mb-4">
                <button
                  className={`flex items-center gap-1 text-gray12 ${
                    canResend ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  ارسال مجدد
                  <span className="icon-wrapper h-5 w-5">
                    <IconAgain />
                  </span>
                </button>

                <p className="text-gray12">
                  ارسال مجدد کد تا {Math.floor(resendTimer / 60)}:
                  {String(resendTimer % 60).padStart(2, "0")}
                </p>
              </div>

              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
                >
                  {contactMethod === "phone" ? "ویرایش موبایل" : "ویرایش ایمیل"}
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={otpCode.length !== 6}
                  className={`mt-4 w-[200px] h-[48px] font-bold text-white2 rounded-lg transition-colors duration-300 ${
                    otpCode.length !== 6 ? "bg-gray5 cursor-not-allowed" : "bg-blue2"
                  }`}
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
