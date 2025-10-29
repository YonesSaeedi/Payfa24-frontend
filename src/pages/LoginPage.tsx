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
import { GoogleLoginButton } from "../firebase/GoogleLoginButton";
import { LoginResponse } from "../types/api/login";
import { AxiosError } from "axios";
import OTPInputModal from "../components/trade/OTPInputModal";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // use theme ==============================================================================================================================================
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  // ==============================================================================================================================================
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCodeIsSubmitting, setResendCodeIsSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [idUser, setIdUser] = useState<number | null>(null);
  const [token2fa, setToken2fa] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginSchema = getLoginSchema();
  const { handleSubmit, control, formState: { errors } } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema), defaultValues: { email: "", password: "", }, });
  // timer for resend =====================================================================================================================================================================
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && !canResend && resendTimer > 0) interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    else if (resendTimer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [isOpen, resendTimer, canResend]);
  // submits login entered data ========================================================================================================================================
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      if (!executeRecaptcha) return;
      const recaptchaToken = await executeRecaptcha("login");
      const payload: Record<string, string> = { recaptcha: recaptchaToken, password: data.password, };
      const isPhone = /^\d+$/.test(data.email);
      if (isPhone) payload.mobile = data.email;
      else payload.email = data.email;
      setContactMethod(isPhone ? "phone" : "email");
      const response = await apiRequest<LoginResponse, Record<string, string>>({ url: "/api/auth/login", method: "POST", data: payload, });
      // no otp needed =============================================================================
      if (response?.access_token) {
        localStorage.setItem("accessToken", response?.access_token);
        localStorage.setItem("refreshToken", response?.refresh_token || "");
        localStorage.setItem("expiresAt", response?.expires_in?.toString() || "");
        toast.success("با موفقیت وارد شدید.");
        navigate(ROUTES.HOME);
      }
      // otp needed ===============================================================================
      else if (response?.id_user && response?.token2fa) {
        setIdUser(response.id_user);
        setToken2fa(response.token2fa);
        setResendTimer(120);
        setCanResend(false);
        setIsOpen(true);
      } else toast.error(response?.msg || "خطا در ورود!");
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || "ورود با مشکل مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };
  // sends otp to api and confirms it ======================================================================================================================================
  const handleConfirm = async () => {
    if (!idUser || !token2fa || otpCode.length < 5) return;
    try {
      const res = await apiRequest<LoginResponse, { code: string, id_user: number, token2fa: string }>(
        { url: "/api/auth/login/login-2fa", method: "POST", data: { code: otpCode, id_user: idUser, token2fa: token2fa, }, }
      );
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
    }
  };
  // resend otp code ======================================================================================================================================================
  const handleResend = async () => {
    if (!idUser || !token2fa || !canResend) return;
    try {
      setResendCodeIsSubmitting(true)
      await apiRequest({ url: "/api/auth/login/resend-2fa", method: "POST", data: { id_user: idUser, token2fa: token2fa, }, });
      toast.success("کد جدید ارسال شد.");
      setResendTimer(120);
      setCanResend(false);
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || "خطا در ارسال مجدد.");
    } finally { setResendCodeIsSubmitting(false) }
  };
  // google login btn functionality ========================================================================================================================================
  const handleLoginResponse = (data: LoginResponse) => {
    if (data?.id_user && data?.token2fa) {
      setIdUser(data.id_user);
      setToken2fa(data.token2fa);
      setResendTimer(120);
      setCanResend(false);
      setIsOpen(true);
      return;
    }
    // if google login was successful (access_token + status === true)
    if (data?.access_token && data?.status) {
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token || "");
      localStorage.setItem("expiresAt", data.expires_in?.toString() || "");
      toast.success(data?.msg || "ورود با گوگل با موفقیت انجام شد.");
      navigate(ROUTES.HOME);
      return;
    }
    // if google login wasn't successful
    toast.error(data?.msg || "پاسخ نامعتبر از سرور دریافت شد");
  };

  return (
    <AuthLayout image={theme === "dark" ? imageLoginDark : imageLoginLight}>
      <div className="flex items-center justify-center" dir="rtl">
        <div className="w-full max-w-md px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-[28px] font-bold text-blue2 mb-2 text-center">ورود به پی‌فا24</h1>
            <p className="font-normal mb-10 lg:text-lg text-sm text-center text-black1">برای ورود ایمیل یا شماره همراه خود را وارد کنید</p>
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
              <span className="icon-wrapper h-4 w-4"><IconAlert /></span>
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
              <div className="flex justify-between items-center mb-10">
                <p className="text-gray12 text-sm font-normal">رمز عبور خود را فراموش کرده‌اید؟</p>
                <span className="font-normal text-blue2 cursor-pointer text-[14px]">بازیابی رمز عبور</span>
              </div>
            </Link>
            <button type="submit" className="w-full h-[48px] rounded-xl bg-blue2 text-white2 font-bold text-lg" disabled={isLoading}>{isLoading ? "در حال ارسال ..." : "ادامه"}</button>
            <p className="text-sm font-normal text-gray12 pt-3 pb-10 text-start">
              هنوز ثبت نام نکرده‌اید؟
              <Link className="text-blue2 text-sm px-1 font-normal" to={"/register"}>ساخت حساب کاربری</Link>
            </p>
            <div className="flex items-center justify-center">
              <div className={`flex-grow h-[1px] ${theme === "dark" ? "bg-gray19" : "bg-gray19"}`}></div>
              <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
              <div className="flex-grow h-[1px] bg-gray19"></div>
            </div>
            <GoogleLoginButton onSuccess={handleLoginResponse} />
          </form>
        </div>
      </div>
      {/* otp modal ================================================================================================================================== */}
      {isOpen &&
        <OTPInputModal
          titleText='تایید ورود'
          mainText={contactMethod === "email" ? 'کد ارسال شده به ایمیل خود را وارد کنید' : contactMethod === "phone" ? 'کد ارسال شده به پیامک خود را وارد کنید.' : 'کد ارسال شده را وارد کنید.'}
          closeModal={() => setIsOpen(false)}
          OTPLength={6}
          onSubmit={handleConfirm}
          handleResendCode={handleResend}
          resendCodeIsSubmitting={resendCodeIsSubmitting}
          resendCodeTimeLeft={resendTimer}
          onChange={(value: string) => setOtpCode(value)}
        />
      }
      {/* {isOpen && (
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
      )} */}
    </AuthLayout>
  );
}
