import { useState } from "react";
import { useNavigate } from "react-router-dom"; // این خط جدید است
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import EmailIcon from "../../assets/Icons/authentication/EmailIcon";
import MultiFactorCard from "../../Components/MultiFactor/MultiFactorCard";
import Google from "../../assets/Icons/MultiFactor/Google.png";
import MessagesIcon from "../../assets/Icons/MultiFactor/Iconmessages";
import TwoFactorModal from "../../Components/MultiFactor/TwoFactorModal";
import VerifyGooglePage from "./GoogleAuthFlow";
import { UseTwoStepVerification } from "../../hooks/UseTwoStepVerification";
import TelegramIcon from "../../assets/icons/Footer/TelegramIcon";
import { toast } from "react-toastify";
import useGetUser from "../../hooks/useGetUser";
import { useMemo } from "react";
import { ROUTES } from "../../routes/routes";


export default function MultiFactor() {
  const { data: twoFAData } = UseTwoStepVerification()
  const { data: userData } = useGetUser();


  const [modalType, setModalType] = useState(null);
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
    {
      type: "telegram",
      icon: <TelegramIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای تلگرام",
      text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به تلگرام شما ارسال شده است.",
    },
  ], [twoFAData, userData]);


  const handleCardClick = (type: string, isActive: boolean) => {
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

    if (isActive) {
      // یعنی کارت فعال است → مودال غیرفعال‌سازی باز شود
      setModalType(type);
    } else {
      // هنوز فعال نشده
      if (type === "google") {
        navigate(ROUTES.GOOGLE_AUTH_FLOW);
      } else if (type === "telegram") {
        navigate('/TelegramAuthFlow');
      } else {
        setModalType(type);
      }
    }
  };



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

      {modalType && (
        <TwoFactorModal
          type={modalType}
          closeModal={() => setModalType(null)}
        />
      )}
    </>
  );
}
