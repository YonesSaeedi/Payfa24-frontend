import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import EmailIcon from "../../assets/icons/authentication/EmailIcon";
import MultiFactorCard from "../../components/MultiFactor/MultiFactorCard";
import Google from "../../assets/icons/MultiFactor/Google.png";
import MessagesIcon from "../../assets/icons/MultiFactor/Iconmessages";
import TwoFactorModal from "../../components/MultiFactor/TwoFactorModal";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import { toast } from "react-toastify";
import useGetUser from "../../hooks/useGetUser";
import { useMemo } from "react";
import { ROUTES } from "../../routes/routes";
import { apiRequest } from "../../utils/apiClient";
import { AxiosError } from "axios";
import OTPInputModal from "../../components/trade/OTPInputModal";

export default function MultiFactor() {
  const { data: twoFAData, refetch } = UseTwoStepVerification()
  const { data: userData } = useGetUser();
  const [modalType, setModalType] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [isOpenActive, setIsOpenActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState<number>(0)
  const [isSubmittingResendCode, setIsSubmittingResendCode] = useState<boolean>(false)
  const [isSubmittingOTP, setIsSubmittingOTP] = useState<boolean>(false)
  const navigate = useNavigate();
  const MultiInfo = useMemo(() => [
    {
      type: "google",
      img: Google,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای گوگل",
      text: "میتوانید با نصب اپلیکیشن google Authenticator هنگام ورود کد دو مرحله‌ای را دریافت کنید.",
    },
    {
      type: "sms",
      icon: <MessagesIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای پیامک",
      text: `فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به شماره ${userData?.user?.mobile ?? "..."} ارسال شده است.`,
    },
    {
      type: "email",
      icon: <EmailIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای ایمیل",
      text: `فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به ایمیل ${userData?.user?.email ?? "..."} ارسال شده است.`,
    },
  ], [twoFAData, userData]);
  // ====================================================================================================================
  // ====================================================================================================================
  // ====================================================================================================================
  const handleCardClick = (type: string, isActive: boolean) => {
    setModalType(type)
    // چک کردن وجود اطلاعات لازم قبل از ارسال درخواست
    if (type === "sms" && !userData?.user?.mobile) {
      toast.info("شماره موبایل شما ثبت نشده است.");
      return;
    }
    if (type === "email" && !userData?.user?.email) {
      toast.info("ایمیل شما ثبت نشده است.");
      return;
    }
    if (twoFAData?.twofa?.status && twoFAData.twofa.type !== type) {
      // یک روش دیگر فعال است → اجازه فعال سازی بقیه را نمی‌دهیم
      toast.info("یک روش دو مرحله‌ای قبلا فعال شده است. ابتدا آن را غیرفعال کنید.");
      return;
    }
    if (!isActive) {
      // یعنی کارت فعال است → مودال غیرفعال‌سازی باز شود
      if (type === "google") {
        navigate(ROUTES.GOOGLE_AUTH_FLOW);
      } else {
        setIsOpen(true);
      }
    } else {
      try {
        setIsSubmittingResendCode(true)
        apiRequest({ url: `/account/2fa/verify/sms`, method: "POST" });
        setIsOpenActive(true);
        setResendCodeTimeLeft(120)
      } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ارسال کد مشکلی پیش آمد.') }
      finally { setIsSubmittingResendCode(false) }
    }
  };
  // ---------- هندل تغییر OTP ----------
  const handleOtpChange = (code: string) => { setOtpCode(code); };
  // handle confirm otp ===================================================================================================
  const handleConfirm = async () => {
    try {
      setIsSubmittingOTP(true)
      const res = await apiRequest({ url: `/account/2fa/verify/${modalType}`, method: "POST", data: { code: otpCode }, });
      refetch()
      toast.success((res as any)?.msg || "با موفقیت تایید شد.");
      setIsOpen(false);
      setIsOpenActive(false)
    } catch (err) {
      toast.error(((err as AxiosError<{ msg?: string }>)?.response?.data?.msg) ?? "خطا در تایید کد.");
    } finally { setIsSubmittingOTP(false) }
  };
  // handle resend code =====================================================================================================
  const handleResendCode = async () => {
    try {
      setIsSubmittingResendCode(true)
      await apiRequest({ url: `/account/2fa/verify/${modalType}`, method: 'POST' })
      toast.success('کد برای شما ارسال شد.')
      setResendCodeTimeLeft(120)
    } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ارسال دوباره کد مشکلی پیش آمد.') }
    finally { setIsSubmittingResendCode(false) }
  }
  // resend code time left calculation =====================================================================================
  useEffect(() => {
    if (resendCodeTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setResendCodeTimeLeft(prev => prev - 1)
    }, 1000);
    return () => clearInterval(interval)
  }, [resendCodeTimeLeft])

  return (
    <>
      <HeaderLayout>
        <div className="container-style w-full pt-7 flex gap-10 flex-col">
          <BreadcrumbNavigation />
          <div className="lg:bg-gray25 lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
            <div className="flex items-center justify-center" dir="rtl">
              <div>
                <form className="w-full text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
                  <h1>ورود دو مرحله‌ای</h1>
                  <p className="pt-3 text-gray5 lg:text-base font-normal text-xs">برای امنیت بیشتر یکی از مراحل زیر را فعال کنید (تنها یک روش را میتوانید فعال کنید)</p>
                  <div className="w-full flex gap-4 flex-col lg:mt-10 mt-6 mb-20">
                    {MultiInfo.map((item) => {
                      const isActive = !!(twoFAData?.twofa?.status && twoFAData?.twofa?.type === item.type);
                      return (<MultiFactorCard key={item.type} dataCard={{ ...item, button: isActive ? "غیرفعال کردن" : "فعال کردن", }} onClick={() => handleCardClick(item.type, isActive)} />);
                    })}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
      {isOpen && <TwoFactorModal type={modalType ?? undefined} closeModal={() => setIsOpen(false)} />}
      {/* otp modal for deactivating 2fa ============================================================================= */}
      {isOpenActive &&
        <OTPInputModal
          closeModal={() => setIsOpenActive(false)}
          onChange={handleOtpChange}
          onSubmit={handleConfirm}
          OTPLength={6}
          handleResendCode={handleResendCode}
          isSubmitting={isSubmittingOTP}
          mainText={
            twoFAData?.twofa?.type === 'email' ? `لطفا کد ارسال شده به ایمیل ${userData?.user?.email} را وارد کنید`
              : twoFAData?.twofa?.type === 'google' ? 'لطفا کد ورود دو مرحله‌ای گوگل را فعال کنید.'
                : twoFAData?.twofa?.type === 'sms' ? `لطفا کد ارسال شده به پیامک ${userData?.user?.mobile} را وارد کنید.`
                  : 'لطفا کد ارسال شده را وارد کنید.'
          }
          resendCodeIsSubmitting={isSubmittingResendCode}
          titleText="تایید کد دو مرحله‌ای"
          resendCodeTimeLeft={resendCodeTimeLeft}
        />
      }
    </>
  );
}