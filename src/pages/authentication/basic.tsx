import { useContext, useState } from "react";
import AuthenticationLayout from "../../layouts/AuthenticationLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { ThemeContext } from "../../Context/ThemeContext";
import enticationDark from "../../assets/enticationDark.png";
import enticationLight from "../../assets/enticationLight.png";
import IconcardBank from "../../assets/Icons/authentication/IconcardBank";
import EmailIcon from "../../assets/Icons/authentication/EmailIcon";
import IconUserOctagon from "../../assets/Icons/authentication/IconUserOctagon";
import IconDownloadPhoto from "../../assets/Icons/authentication/IconDownloadPhoto";
import IdentyIcon from "../../assets/Icons/authentication/IdentyIcon";
import StepEmail from "../../Components/auth/step/StepEmail";
import StepPersonal from "../../Components/auth/step/StepPersonal";
import StepCard from "../../Components/auth/step/StepCard";

export default function AuthenticationBasic() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(false);
  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepEmail onNext={() => setStep(2)} />;
      case 2:
        return <StepPersonal onNext={() => setStep(3)}  />;
      case 3:
        return <StepCard onNext={() => handleFinish()}  />;
      default:
        return <StepEmail onNext={() => setStep(2)} />;
    }
  };

  const handleFinish = () => {
    console.log("فرآیند احراز هویت تکمیل شد!");
  };
  return (
    <HeaderLayout>
      <AuthenticationLayout
        left={
          !started ? (
            <div className="hidden md:flex flex-col items-center justify-center gap-6 lg:mb-16">
              <img
                src={theme === "dark" ? enticationDark : enticationLight}
                alt="auth"
                className="object-contain"
              />
              <p className="text-center text-lg text-black0 ">
                لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل
                نمایید
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {renderStep()}
            </div>
          )
        }
        right={
          <div className="w-full flex  flex-col gap-6 items-end">
            {/* سطح 1 */}
            <div className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex  flex-col p-6 dark:text-white justify-center sm:justify-end">
              <h1 className="text-right mb-5 text-blue2">
                سطح 1 : احراز هویت پایه
              </h1>
              <div className="flex flex-row items-center justify-end">
                <span className="mr-2 text-black1">ثبت ایمیل</span>
                <span className="icon-wrapper w-7 h7 text-blue2">
                  <EmailIcon />
                </span>
              </div>
              <div className="flex flex-row items-center justify-end">
                <span className="mr-2 text-black1">مشخصات فردی</span>
                <span className="icon-wrapper w-7 h7 text-blue2">
                  <IconUserOctagon />
                </span>
              </div>
              <div className="flex flex-row items-center justify-end">
                <span className="mr-2 text-black1">کارت بانکی</span>
                <span className="icon-wrapper w-7 h7 text-blue2">
                  <IconcardBank />
                </span>
              </div>
              <div dir="rtl">
                <p className="text-right mt-5">دسترسی ها :</p>
                <ul className="list-disc list-inside text-right text-gray15">
                  <li>مشاهده قیمت‌ها</li>
                  <li>خرید و فروش رمز ارزها</li>
                </ul>
              </div>
              <button
                className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold"
                onClick={() => setStarted(true)}
              >
                احراز هویت
              </button>
            </div>

            {/* سطح 2 */}
            <div className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-gray15 rounded-lg border-[1px] md:flex  flex-col p-6 justify-center sm:justify-end">
              <h1 className="text-right">سطح 2 : احراز هویت پیشرفته</h1>
              <div className="flex flex-row items-center justify-end mt-5">
                <span className="mr-2">ثبت مدرک شناسایی</span>
                <span className="icon-wrapper w-7 h-7">
                  <IconDownloadPhoto />
                </span>
              </div>
              <div className="flex flex-row items-center justify-end">
                <span className="mr-2">تایید هویت</span>
                <span className="icon-wrapper w-7 h-7">
                  <IdentyIcon />
                </span>
              </div>
              <h3 className="mt-5 text-right">دسترسی ها :</h3>
              <div className="flex flex-col gap-1" dir="rtl">
                <span className="text-right">
                  5 میلیون تومان برداشت ریالی روزانه
                </span>
                <span className="text-right">
                  5 میلیون تومان برداشت ارزی روزانه
                </span>
                <span className="text-right">دسترسی به ارز Utopia USD</span>
              </div>
            </div>
          </div>
        }
      />
    </HeaderLayout>
  );
}
