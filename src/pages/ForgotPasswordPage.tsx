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
import IconAgain from "../assets/icons/Login/IconAgain";
import IconClose from "../assets/icons/Login/IconClose";
import { AxiosError } from "axios";

type FormData = {
  mobile: string; 
};

interface ForgotPasswordResponse {
  status: boolean;
  msg?: string;
  tokenForget?: string;
}

const DISABLE_DURATION = 120;
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
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmittingMain, setIsSubmittingMain] = useState(false);
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [disableTimer, setDisableTimer] = useState(0);

  const { handleSubmit, control, formState: { errors }, getValues, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { mobile: "" }, 
  });

  const mobileValue = watch("mobile"); 

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (disableButton && disableTimer > 0) {
      interval = setInterval(() => {
        setDisableTimer((prev) => {
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const onSubmit = async (data: FormData) => {
    if (!executeRecaptcha) return;
    setIsSubmittingMain(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");
      setFormData(data);
      
      // فقط mobile ارسال می‌کنیم
      const payload = { 
        recaptcha: recaptchaToken,
        mobile: data.mobile // فقط موبایل
      };
      
      const response = await apiRequest<ForgotPasswordResponse, Record<string, string>>({
        url: "/auth/forget",
        method: "POST",
        data: payload,
      });
      if (response?.status) {
        setIsOpen(true);
        setResendTimer(120);
        setCanResend(false);
        const expireTime = Date.now() + DISABLE_DURATION * 1000;
        localStorage.setItem(STORAGE_KEY, expireTime.toString());
        setDisableButton(true);
        setDisableTimer(DISABLE_DURATION);
      } else {
        toast.error(response?.msg || "خطا در ارسال کد");
      }
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "خطا در ارسال");
    } finally {
      setIsSubmittingMain(false);
    }
  };

  const handleConfirm = async () => {
    if (!executeRecaptcha || !formData || otpCode.length !== 6) return;
    setIsSubmittingOTP(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password_confirm");
      
      // فقط mobile ارسال می‌کنیم
      const payload = {
        recaptcha: recaptchaToken,
        mobile: formData.mobile, // فقط موبایل
        code: otpCode
      };
      
      const response = await apiRequest<ForgotPasswordResponse, Record<string, string>>({
        url: "/auth/forget",
        method: "POST",
        data: payload,
      });
      if (response?.status) {
        setIsOpen(false);
        navigate("/forgot-password-set-password", {
          state: {
            username: formData.mobile, // mobile به عنوان username
            tokenForget: response.tokenForget,
          },
        });
      } else {
        toast.error(response?.msg || "تایید کد با مشکل مواجه شد");
      }
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "تایید کد با مشکل مواجه شد!");
    } finally {
      setIsSubmittingOTP(false);
    }
  };

  const handleResend = async () => {
    if (!formData || !executeRecaptcha) return;
    setResendTimer(120);
    setCanResend(false);
    await onSubmit(formData);
  };

  const isMobileFilled = mobileValue?.trim().length > 0; // تغییر به mobile

  return (
    <AuthLayout image={theme === "dark" ? imageForgetDark : imageForgetLight}>
      <div className="flex items-center justify-center pb-8 w-full " dir="rtl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex items-center flex-col lg:max-w-md lg:px-0 px-4 "
        >
          <h1 className="lg:text-[28px] text-[20px] font-bold text-blue2 mb-3 text-center">
            فراموشی رمز عبور
          </h1>
          {/* تغییر متن راهنما */}
          <p className="font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] text-black1">
            برای بازیابی رمز عبور شماره همراه خود را وارد کنید
          </p>
          
          {/* تغییر Controller به mobile */}
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <TextField
                label="شماره همراه" // تغییر label
                type="tel"
                error={errors.mobile?.message} // تغییر به mobile
                {...field}
                labelBgClass="bg-white4"
              />
            )}
          />
          
          <button
            type="submit"
            disabled={!isMobileFilled || disableButton || isSubmittingMain} // تغییر به mobile
            className={`h-[48px] w-full rounded-xl font-bold text-lg text-white transition-colors duration-300 ${
              !isMobileFilled || disableButton
                ? "bg-blue2 opacity-50 cursor-not-allowed"
                : "bg-blue2 opacity-100"
            } lg:mt-14 mt-12`}
          >
            {isSubmittingMain ? "در حال ارسال ..." : "ادامه"}
          </button>
        </form>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="lg:max-w-md max-w-sm rounded-lg lg:p-6 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center flex-row-reverse justify-between">
                {/* تغییر متن مدال */}
                <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                  تایید شماره همراه
                </h2>
                <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={() => setIsOpen(false)}>
                  <IconClose />
                </span>
              </div>
              
              {/* تغییر متن مدال */}
              <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24" dir="rtl">
                لطفا کد ارسالی به شماره {getValues("mobile")} را وارد کنید.
              </p>
              
              <div className="mt-[32px] mb-[48px] ">
                <OTPModal length={6} onChange={(val: string) => setOtpCode(val)} />
              </div>
              
              <div className="flex justify-between flex-row-reverse mb-4">
                <button
                  className={`flex items-center gap-1 text-gray12 ${canResend ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  ارسال مجدد
                  <span className="icon-wrapper h-5 w-5"><IconAgain /></span>
                </button>
                <p className="text-gray12">
                  ارسال مجدد کد تا {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, "0")}
                </p>
              </div>
              
              <div className="flex gap-2 mb-8">
                {/* تغییر متن دکمه ویرایش */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
                >
                  ویرایش شماره همراه
                </button>
                <button
                  dir="rtl"
                  onClick={handleConfirm}
                  disabled={otpCode.length !== 6 || isSubmittingOTP}
                  className={`mt-4 w-[200px] h-[48px] font-bold text-white2 rounded-lg transition-colors duration-300 ${
                    otpCode.length !== 6
                      ? "bg-blue2 opacity-50 cursor-not-allowed"
                      : "bg-blue2 opacity-100"
                  }`}
                >
                  {isSubmittingOTP ?"در حال بررسی ..." : "تایید"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
}