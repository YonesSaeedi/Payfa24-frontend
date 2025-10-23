import React, { useState, useEffect, useContext } from "react";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { ThemeContext } from "../context/ThemeContext";
import IconEyeOpen from "../assets/Icons/Login/IconEyeOpen";
import IconEyeClosed from "../assets/Icons/Login/IconEyeClosed";
import AuthLayout from "../layouts/AuthLayout";
import imageLoginDark from "../assets/Login ImageDark.png";
import imageLoginLight from "../assets/Login imageLight.png";
import TextField from "../components/InputField/TextField";
import { Link, useNavigate } from "react-router-dom";
import IconClose from "../assets/Icons/Login/IconClose";
import IconAgain from "../assets/Icons/Login/IconAgain";
import OTPModal from "../components/OTPModal";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLoginSchema } from "../utils/validationSchemas";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/apiClient";
import { ROUTES } from "../routes/routes";
import { GoogleLoginButton } from "../firebase/GoogleLoginButton";

type LoginFormData = {
  email: string;
  password: string;
};

interface LoginResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  id_user?: number;
  token2fa?: string;
  twofaType?: string;
  status?: boolean;
  msg?: string;
}

export default function LoginPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone" | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ⚙️ states مربوط به 2FA
  const [otpCode, setOtpCode] = useState("");
  const [idUser, setIdUser] = useState<number | null>(null);
  const [token2fa, setToken2fa] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);

  const loginSchema = getLoginSchema();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 🕒 تایمر ۲ دقیقه‌ای برای ارسال مجدد
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && !canResend && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer, canResend]);

  // 🧩 مرحله ۱: ارسال اطلاعات ورود
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      if (!executeRecaptcha) return;
      const recaptchaToken = await executeRecaptcha("login");

      const payload: Record<string, string> = {
        recaptcha: recaptchaToken,
        password: data.password,
      };
      const isPhone = /^\d+$/.test(data.email);
      if (isPhone) payload.mobile = data.email;
      else payload.email = data.email;
      setContactMethod(isPhone ? "phone" : "email");

      const response = await apiRequest<LoginResponse, Record<string, string>>({
        url: "/api/auth/login",
        method: "POST",
        data: payload,
      });

      // ✅ ورود موفق بدون 2FA
      if (response?.access_token) {
        localStorage.setItem("accessToken", response?.access_token);
        localStorage.setItem("refreshToken", response?.refresh_token || "");
        localStorage.setItem("expiresAt", response?.expires_in?.toString() || "");
        toast.success("با موفقیت وارد شدید.");
        navigate(ROUTES.HOME);
      }
      // 🔐 نیاز به 2FA
      else if (response?.id_user && response?.token2fa) {
        setIdUser(response.id_user);
        setToken2fa(response.token2fa);
        setResendTimer(120);
        setCanResend(false);
        setIsOpen(true);
      } else {
        toast.error(response?.msg || "خطا در ورود");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "ورود با مشکل مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };



  // 🧩 مرحله ۲: تایید کد ۲FA
  const handleConfirm = async () => {
    if (!idUser || !token2fa || otpCode.length < 5) return;
    try {
      const res = await apiRequest({
        url: "/api/auth/login/login-2fa",
        method: "POST",
        data: {
          code: otpCode,
          id_user: idUser,
          token2fa: token2fa,
        },
      });

      if (res?.access_token) {
        toast.success("ورود با موفقیت انجام شد.");
        localStorage.setItem("accessToken", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token || "");
        localStorage.setItem("expiresAt", res.expires_in?.toString() || "");
        setIsOpen(false);
        navigate(ROUTES.HOME);
      } else {
        toast.error(res?.msg || "کد وارد شده نادرست است.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "خطا در تأیید کد.");
    }
  };

  // 🧩 مرحله ۳: ارسال مجدد کد
  const handleResend = async () => {
    if (!idUser || !token2fa || !canResend) return;
    try {
      const res = await apiRequest({
        url: "/api/auth/login/resend-2fa",
        method: "POST",
        data: {
          id_user: idUser,
          token2fa: token2fa,
        },
      });
      if (res?.status === true) {
        toast.success("کد جدید ارسال شد.");
        setResendTimer(120);
        setCanResend(false);
      } else {
        toast.error(res?.msg || "ارسال مجدد انجام نشد.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "خطا در ارسال مجدد.");
    }
  };

const handleLoginResponse = (data: LoginResponse) => {
  console.log("google",data);

  
  // 🔐 اگر ورود نیاز به تأیید دو مرحله‌ای دارد
  if (data?.id_user && data?.token2fa) {
        console.log("ورود دو مرحله ای");

    setIdUser(data.id_user);
    setToken2fa(data.token2fa);
    setResendTimer(120);
    setCanResend(false);
    setIsOpen(true);
    return;
  }

  // ✅ اگر ورود موفق بود (access_token + status === true)
  if (data?.access_token && data?.status) {
    console.log("ورود");
    
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token || "");
    localStorage.setItem("expiresAt", data.expires_in?.toString() || "");
    toast.success(data?.msg || "ورود با گوگل با موفقیت انجام شد 🎉");
    navigate(ROUTES.HOME);
    return;
  }

  // ⚠️ در غیر اینصورت خطا
  toast.error(data?.msg || "پاسخ نامعتبر از سرور دریافت شد");
};



  // 🧩 هندل کلیک‌ها در UI بدون تغییر JSX
  const handleModalConfirm = () => handleConfirm();
  const handleModalResend = () => handleResend();

  return (
    <AuthLayout image={theme === "dark" ? imageLoginDark : imageLoginLight}>
      {/* 👇 کل JSX بدون تغییر */}
      <div className="flex items-center justify-center" dir="rtl">
        <div className="w-full max-w-md px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-[28px] font-bold text-blue2 mb-2 text-center">
              ورود به پی‌فا24
            </h1>
            <p className="font-normal mb-10 lg:text-lg text-sm text-center text-black1">
              برای ورود ایمیل یا شماره همراه خود را وارد کنید
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

            <div className="sm:text-sm text-xs font-normal pb-6 flex gap-1 items-end justify-start text-gray12">
              <span className="icon-wrapper h-4 w-4">
                <IconAlert />
              </span>
              <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            </div>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  label="رمز عبور خود را وارد کنید"
                  type={showPassword ? "text" : "password"}
                  error={errors.password?.message}
                  icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                  onIconClick={() => setShowPassword((prev) => !prev)}
                  {...field}
                  labelBgClass="bg-white4"
                />
              )}
            />

            <Link to={"/forgot-password"}>
              <div className="flex justify-between items-center mb-10">
                <p className="text-gray12 text-sm font-normal">
                  رمز عبور خود را فراموش کرده‌اید؟
                </p>
                <span className="font-normal text-blue2 cursor-pointer text-[14px]">
                  بازیابی رمز عبور
                </span>
              </div>
            </Link>

            <button
              type="submit"
              className="w-full h-[48px] rounded-xl bg-blue2 text-white2 font-bold text-lg"
              disabled={isLoading}
            >
              {isLoading ? "در حال ارسال ..." : "ادامه"}
            </button>

            <p className="text-sm font-normal text-gray12 pt-3 pb-10 text-start">
              هنوز ثبت نام نکرده‌اید؟
              <span className="text-blue2 text-sm px-1 font-normal">
                <Link to={"/register"}>ساخت حساب کاربری</Link>
              </span>
            </p>

            <div className="flex items-center justify-center">
              <div className={`flex-grow h-[1px] ${theme === "dark" ? "bg-gray19" : "bg-gray19"}`}></div>
              <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
              <div className="flex-grow h-[1px] bg-gray19"></div>
            </div>
            <GoogleLoginButton
              onSuccess={handleLoginResponse}
            />
          </form>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <div
              className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center flex-row-reverse justify-between">
                <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                  {contactMethod === "phone" ? "تایید شماره همراه" : "تایید ایمیل"}
                </h2>
                <span
                  className="icon-wrapper h-6 w-6 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <IconClose />
                </span>
              </div>

              <p
                className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
                dir="rtl"
              >
                لطفا کد ارسالی به
                {contactMethod === "phone"
                  ? `شماره ${getValues("email")}`
                  : `ایمیل ${getValues("email")}`}
                را وارد کنید.
              </p>

              <div className="mt-[32px] mb-[48px]">
                <OTPModal length={6} onChange={(code) => setOtpCode(code)} />
              </div>

              <div className="flex justify-between flex-row-reverse mb-4">
                <div
                  className={`flex gap-2 items-center ${canResend ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  onClick={canResend ? handleModalResend : undefined}
                >
                  <span className="text-gray12">ارسال مجدد</span>
                  <span className="icon-wrapper h-5 w-5">
                    <IconAgain />
                  </span>
                </div>
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
                  {contactMethod === "phone" ? "ویرایش شماره همراه" : "ویرایش ایمیل"}
                </button>
                <Link to={""}>
                  <button
                    onClick={handleModalConfirm}
                    className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
                  >
                    تایید
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
