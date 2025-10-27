import { useEffect, useState } from "react";
import TextField from "./InputField/TextField";
import IconAlert from "../assets/icons/Login/IconAlert";
import IconGoogle from "../assets/icons/Login/IconGoogle";
import { useForm, Controller, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiRequest } from "../utils/apiClient";
import { Link } from "react-router-dom";
import { getStepInviteSchema } from "../utils/validationSchemas";
import { toast } from "react-toastify";
import { ROUTES } from "../routes/routes";
import { AxiosError } from "axios";
import OTPInputModal from "./trade/OTPInputModal";

interface RegisterResponse {
  status: boolean;
  access_token: string;
  expires_in: number;
  msg?: string;
  refresh_token: string;
  [key: string]: unknown;
}
interface CheckResponse {
  status: boolean;
  msg?: string;
  [key: string]: unknown;
}
interface StepInviteFormData {
  email: string;
  inviteCode?: string;
}

export default function StepInvite({ onNext }: { onNext: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false)
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState<number>(0)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | null>(null);
  const [contactValue, setContactValue] = useState<string>('')
  const [otpCode, setOtpCode] = useState<string>("");
  // const [isOtpError, setIsOtpError] = useState<boolean>(false);
  const schema = getStepInviteSchema();
  const defaultValues: StepInviteFormData = { email: "", inviteCode: undefined, };
  const { handleSubmit, control, formState: { errors } } = useForm<StepInviteFormData>({ resolver: yupResolver(schema) as unknown as Resolver<StepInviteFormData>, defaultValues, });
  // handle submit register data =================================================================================================================================
  const onSubmit: SubmitHandler<StepInviteFormData> = async (data) => {
    if (!executeRecaptcha) return;
    try {
      setIsSubmitting(true);
      const recaptchaToken = await executeRecaptcha("register");
      const value = data.email.trim();
      setContactValue(value)
      const payload: Record<string, string> = { recaptcha: recaptchaToken };

      if (/^\d+$/.test(value)) {
        payload.mobile = value;
        setContactMethod("phone");
      } else {
        payload.email = value;
        setContactMethod("email");
      }
      if (data.inviteCode?.trim()) {
        payload.id_referral = data.inviteCode.trim();
      }
      const response = await apiRequest<RegisterResponse, Record<string, string>>({ url: "/api/auth/register", method: "POST", data: payload });
      if (response?.status === true) {
        localStorage.setItem("accessToken", response?.access_token);
        localStorage.setItem("refreshToken", response?.refresh_token);
        localStorage.setItem("expiresAt", response?.expires_in.toString());
      }
      toast.success(`رمز یکبار مصرف به ${contactValue} ارسال شد.`)
      setResendCodeTimeLeft(120)
      setIsOpen(true);
    } catch (err) {
      toast.error((err as AxiosError<{ msg: string }>)?.response?.data?.msg || "در ثبت اطلاعات مشکلی پیش آمد.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // handle confirm otp ===========================================================================================================================================
  const handleConfirm = async () => {
    if (otpCode.length === 5) {
      setIsConfirming(true)
      try {
        await apiRequest<CheckResponse, Record<string, string>>({ url: "/api/auth/register/check", method: "POST", data: { code: otpCode }, });
        toast.success("حساب شما با موفقیت ایجاد شد.");
        onNext();
      } catch (err) {
        toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در تایید کد مشکلی پیش آمد.')
      }
      finally { setIsConfirming(false) }
    } else toast.error('کد وارد شده باید 5 رقم باشد!')
  };
  // handle resend otp code ===========================================================================================================================================
  const handleResend = async () => {
    setIsResending(true)
    try {
      const response = await apiRequest<{ status?: boolean, msg?: string }>({ url: '/api/auth/register/resend', method: "POST" })
      setResendCodeTimeLeft(120)
      toast.success(response?.msg)
    } catch (err) { toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ارسال مجدد کد مشکلی پیش آمد؛ لطفا دوباره تلاش کنید.') }
    finally { setIsResending(false) }
  }
  // resend code timer ===========================================================================================================================================================
  useEffect(() => {
    if (resendCodeTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setResendCodeTimeLeft(prev => prev - 1)
    }, 1000);
    return () => clearInterval(interval)
  }, [resendCodeTimeLeft])

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="w-full mx-auto">
          <h1 className="text-[28px] font-bold text-blue2 mb-2 text-center">ثبت نام در پی‌فا24</h1>
          <p className="font-normal mb-10 lg:text-lg text-sm text-center text-black1">برای ثبت نام ایمیل یا شماره همراه خود را وارد کنید</p>
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
                showError={true}
              />
            )}
          />
          <div className="w-full text-gray12 sm:text-sm text-xs font-normal flex gap-1 items-end justify-end flex-row-reverse mt-2 mb-6">
            <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            <span className="icon-wrapper h-4 w-4"><IconAlert /></span>
          </div>
          <div className="text-blue2 flex flex-col gap-2 w-full items-center" dir="rtl">
            <div className="flex justify-between w-full text-sm font-normal mb-3">
              <span>کد دعوت دارید؟</span>
              <div
                dir="ltr"
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${hasInviteCode ? "bg-blue2" : "bg-gray19"}`}
                onClick={() => setHasInviteCode((prev) => !prev)}
              >
                <div className={`bg-white1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${hasInviteCode ? "translate-x-6" : "translate-x-0"}`}></div>
              </div>
            </div>
            {hasInviteCode &&
              <div className="flex flex-col w-full">
                <Controller
                  name="inviteCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="کد دعوت"
                      error={errors.inviteCode?.message}
                      {...field}
                      labelBgClass="bg-white4"
                      showError={true}
                    />
                  )}
                />
              </div>
            }
          </div>
          <button
            type="submit"
            className={`w-full h-[48px] rounded-xl mt-10 bg-blue2 text-white2 font-bold text-lg hover:bg-blue-600 transition duration-300`}
            disabled={!executeRecaptcha || isSubmitting}
          >
            {isSubmitting ? "در حال ارسال ..." : "ادامه"}
          </button>
          <p className="text-sm font-normal text-gray12 mt-3 mb-10 text-start">
            حساب کاربری دارید؟
            <span className="text-blue2 text-sm px-1 font-normal">
              <Link to={ROUTES.LOGIN}>ورود به حساب</Link>
            </span>
          </p>
          <div className="flex items-center justify-center">
            <div className="flex-grow h-[1px] bg-gray19"></div>
            <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
            <div className="flex-grow h-[1px] bg-gray19"></div>
          </div>
          <button className="w-full h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-gray12 border border-gray12">
            <span className="icon-wrapper h-5 w-5"><IconGoogle /></span>اکانت گوگل
          </button>
        </form>
        {isOpen &&
          <OTPInputModal
            closeModal={() => setIsOpen(false)}
            onChange={(value: string) => setOtpCode(value)}
            onSubmit={handleConfirm}
            OTPLength={5}
            editButtonText={`ویرایش ${contactMethod === 'email' ? 'ایمیل' : 'شماره همراه'}`}
            handleEdit={() => setIsOpen(false)}
            handleResendCode={handleResend}
            isSubmitting={isConfirming}
            isSubmittingText="در حال تایید کد ..."
            mainText={`لطفا کد ارسال شده به ${contactValue} را وارد کنید`}
            resendCodeIsSubmitting={isResending}
            resendCodeTimeLeft={resendCodeTimeLeft}
            submitButtonText="تایید"
            titleText={`تایید ${contactMethod === 'email' ? 'ایمیل' : 'شماره همراه'}`}
          />
        }
      </div>
    </div>
  );
}
