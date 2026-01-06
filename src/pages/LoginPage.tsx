import { useState, useEffect, useContext } from "react";
import IconAlert from "../assets/icons/Login/IconAlert";
import { ThemeContext } from "../context/ThemeContext";
import IconEyeOpen from "../assets/icons/Login/IconEyeOpen";
import IconEyeClosed from "../assets/icons/Login/IconEyeClosed";
import AuthLayout from "../layouts/AuthLayout";
import imageLoginDark from "../assets/Login ImageDark.png";
import imageLoginLight from "../assets/Login imageLight.png";
import TextField from "../components/InputField/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLoginSchema } from "../utils/validationSchemas";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/apiClient";
import { ROUTES } from "../routes/routes";
import { LoginResponse } from "../types/api/login";
import { AxiosError } from "axios";
import OTPInputModal from "../components/trade/OTPInputModal";
import { toPersianDigits } from "../components/Deposit/CardToCardTransfer";

type LoginFormData = {
  mobile: string;
  password: string;
};

export default function LoginPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [showPassword, setShowPassword] = useState(false);
  const [twofaMsg, setTwofaMsg] = useState<string>('کد ورود دو مرحله‌ای را وارد کنید')
  const [twofaType, setTwofaType] = useState<null | 'sms' | 'email' | 'google'>(null)
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [is2FASubmitting, setIs2FASubmitting] = useState<boolean>(false)
  const [resendCodeIsSubmitting, setResendCodeIsSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [idUser, setIdUser] = useState<number | null>(null);
  const [token2fa, setToken2fa] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginSchema = getLoginSchema();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { mobile: "", password: "" }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && !canResend && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer, canResend]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      if (!executeRecaptcha) return;

      const recaptchaToken = await executeRecaptcha("login");


      const payload: Record<string, string> = {
        recaptcha: recaptchaToken,
        password: data.password
      };

      payload.mobile = data.mobile;

      const response = await apiRequest<LoginResponse, Record<string, string>>({
        url: "/auth/login",
        method: "POST",
        data: payload
      });

      if (response?.twofaType) setTwofaType(response?.twofaType);

      setTwofaMsg(prev =>
        response?.twofaType === 'email' ? 'لطفا کد ارسالی به ایمیل خود را وارد کنید.'
          : response?.twofaType === 'google' ? 'لطفا کد ورود دو مرحله‌ای گوگل را وارد کنید.'
            : response?.twofaType === 'sms' ? 'لطفا کد ارسال شده به پیامک خود را وارد کنید.'
              : prev
      );

      if (response?.access_token) {
        localStorage.setItem("accessToken", response?.access_token);
        localStorage.setItem("refreshToken", response?.refresh_token || "");
        localStorage.setItem("expiresAt", response?.expires_in?.toString() || "");
        toast.success("با موفقیت وارد شدید.");
        navigate(ROUTES.HOME);
      }
      else if (response?.id_user && response?.token2fa) {
        setIdUser(response.id_user);
        setToken2fa(response.token2fa);
        setResendTimer(120);
        setCanResend(false);
        setIsOpen(true);
      } else {
        toast.error(response?.msg || "خطا در ورود!");
      }
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || "ورود با مشکل مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!idUser || !token2fa || otpCode.length < 5) return;
    try {
      setIs2FASubmitting(true);
      const res = await apiRequest<LoginResponse, { code: string; id_user: number; token2fa: string }>({
        url: "/auth/login/login-2fa",
        method: "POST",
        data: { code: otpCode, id_user: idUser, token2fa: token2fa },
      });
      if (res?.access_token) {
        toast.success("ورود با موفقیت انجام شد.");
        localStorage.setItem("accessToken", res?.access_token);
        localStorage.setItem("refreshToken", res?.refresh_token || "");
        localStorage.setItem("expiresAt", res?.expires_in?.toString() || "");
        setIsOpen(false);
        navigate(ROUTES.HOME);
      } else {
        toast.error(res?.msg || "کد وارد شده نادرست است.");
      }
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || "خطا در تأیید کد.");
    } finally {
      setIs2FASubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!idUser || !token2fa || !canResend) return;
    try {
      setResendCodeIsSubmitting(true);
      await apiRequest({
        url: "/auth/login/resend-2fa",
        method: "POST",
        data: { id_user: idUser, token2fa: token2fa }
      });
      toast.success("کد جدید ارسال شد.");
      setResendTimer(120);
      setCanResend(false);
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || "خطا در ارسال مجدد.");
    } finally {
      setResendCodeIsSubmitting(false);
    }
  };

  return (
    <AuthLayout image={theme === "dark" ? imageLoginDark : imageLoginLight}>
      <form onSubmit={handleSubmit(onSubmit)} className="lg:max-w-md w-full lg:px-4 px-4 lg:pt-10" dir="rtl">
        <h1 className="lg:text-[28px] text-xl font-bold text-blue2 text-center">
          ورود به پی‌فا{toPersianDigits(24)}
        </h1>

        <p className="font-normal lg:mb-10 mb-7 lg:text-lg text-sm text-center text-black1 pt-3">
          برای ورود شماره موبایل خود را وارد کنید
        </p>

        <Controller
          name="mobile"
          control={control}
          render={({ field }) => (
            <TextField
              label="شماره موبایل"
              type="text"
              error={errors.mobile?.message}
              {...field}
              labelBgClass="bg-white4"
            />
          )}
        />

        <div className="sm:text-sm text-xs font-normal lg:mb-6 mb-5 mt-2 flex gap-1 items-center justify-start text-gray12">
          <span className="icon-wrapper h-4 w-4">
            <IconAlert />
          </span>
          <p>توجه داشته باشید که در دامنه (panel.payfa24.com) باشید.</p>
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
          <div className="flex justify-between items-center lg:mb-10 mb-[49px] lg:mt-[10px] mt-2">

            <p className="text-gray12 text-sm font-normal">رمز عبور خود را فراموش کرده‌اید؟</p>

            <span className="font-normal text-blue2 cursor-pointer text-[14px]">بازیابی رمز عبور</span>
          </div>
        </Link>

        <button
          type="submit"
          className="w-full h-[48px] lg:rounded-xl rounded-lg bg-blue2 text-white2 font-bold lg:text-lg text-sm"
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال ..." : "ادامه"}
        </button>

        <p className="text-sm font-normal text-gray12 mt-3 lg:mb-10 mb-8 text-start">
          هنوز ثبت نام نکرده‌اید؟
          <Link className="text-blue2 text-sm px-1 font-normal" to={ROUTES.REGISTER}>
            ساخت حساب کاربری
          </Link>
        </p>


      </form>

      {isOpen && (
        <OTPInputModal
          titleText="تایید ورود"
          mainText={twofaMsg}
          closeModal={() => setIsOpen(false)}
          OTPLength={6}
          onSubmit={handleConfirm}
          isSubmitting={is2FASubmitting}
          handleResendCode={twofaType !== 'google' ? handleResend : undefined}
          resendCodeIsSubmitting={twofaType !== 'google' ? resendCodeIsSubmitting : undefined}
          resendCodeTimeLeft={twofaType !== 'google' ? resendTimer : undefined}
          onChange={(value: string) => setOtpCode(value)}
        />
      )}
    </AuthLayout>
  );
}