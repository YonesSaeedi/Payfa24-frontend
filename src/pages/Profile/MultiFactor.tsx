import { useState } from "react";
import { useNavigate } from "react-router-dom"; // این خط جدید است
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import EmailIcon from "../../assets/icons/authentication/EmailIcon";
import MultiFactorCard from "../../components/MultiFactor/MultiFactorCard";
import Google from "../../assets/Icons/MultiFactor/Google.png";
import MessagesIcon from "../../assets/icons/MultiFactor/Iconmessages";
import TwoFactorModal from "../../components/MultiFactor/TwoFactorModal";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import TelegramIcon from "../../assets/icons/Footer/TelegramIcon";
import { toast } from "react-toastify";
import useGetUser from "../../hooks/useGetUser";
import { useMemo } from "react";
import { ROUTES } from "../../routes/routes";
import OTPModal from "../../components/OTPModal";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";

export default function MultiFactor() {
  const { data: twoFAData, refresh } = UseTwoStepVerification()
  const { data: userData } = useGetUser();


const [modalType, setModalType] = useState<string | null>(null);
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState("");
  const [isOpenActive, setIsOpenActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const MultiInfo = useMemo(() => [
    {
      type: "google",
      img: Google,
      button: "فعال کردن",
      Title: " ",
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
    {
      type: "telegram",
      icon: <TelegramIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای تلگرام",
      text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به تلگرام شما ارسال شده است.",
    },
  ], [twoFAData, userData]);


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
      } else if (type === "telegram") {
        navigate('/TelegramAuthFlow');
      } else {
        setIsOpen(true);
      }
    } else {
      setIsOpenActive(true);
      // هنوز فعال نشده
    }
  };

  // ---------- هندل تغییر OTP ----------
  const handleOtpChange = (code: string) => {
    setOtpCode(code);
  };

  const handleConfirm = async () => {
    try {
      const type = modalType; // نوع OTP

      const res = await apiRequest({
        url: `/api/account/2fa/verify/${type}`, // url داینامیک
        method: "POST",
        data: { code: otpCode }, // otpCode ارسال شود
      });
      refresh()
      toast.success((res as any)?.msg || "موفق!");
      setIsOpen(false);


    } catch (err) {
      toast.error((err as AxiosError<{msg?:string}>)?.response?.data?.message || "خطا در تایید کد.");
    }
  };


  console.log("modalType", modalType);


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
                  <p className="pt-3 text-gray5 lg:text-base font-normal text-xs">
                    برای امنیت بیشتر یکی از مراحل زیر را فعال کنید (تنها یک روش را میتوانید فعال کنید)
                  </p>
                  <div className="w-full flex gap-4 flex-col lg:mt-10 mt-6 mb-20">
                    {MultiInfo.map((item) => {
                      const isActive = !!(twoFAData?.twofa?.status && twoFAData?.twofa?.type === item.type);
                      return (
                        <MultiFactorCard
                          key={item.type}
                          dataCard={{
                            ...item,
                            button: isActive ? "غیرفعال کردن" : "فعال کردن"
                          }}
                          onClick={() => handleCardClick(item.type, isActive)}
                        />
                      );
                    })}


                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>

      {isOpen && (
        <TwoFactorModal
          type={modalType}
          closeModal={() => setIsOpen(null)}
        />
      )}

      {isOpenActive && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => setIsOpenActive(false)}
          >
            <div
              className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center flex-row-reverse justify-between">

                <span
                  className="icon-wrapper h-6 w-6 cursor-pointer"
                  onClick={() => setIsOpenActive(false)}
                >
                  <IconClose />
                </span>
              </div>

              <p
                className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
                dir="rtl"
              >
                لطفا کد ارسالی را وارد کنید
              </p>

              <div className="mt-[32px] mb-[48px]">
                <OTPModal length={6} onChange={handleOtpChange} />
              </div>



              <div className="flex gap-2 mb-8">

                <button
                  onClick={handleConfirm}
                  disabled={otpCode.length < 6}
                  className={`mt-4 w-full h-[48px] font-bold text-white2 rounded-lg transition-colors duration-300 ${otpCode.length < 6 ? "bg-gray5 cursor-not-allowed" : "bg-blue2 hover:bg-blue3"
                    }`}
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
