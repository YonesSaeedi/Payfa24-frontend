import { useContext } from "react";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { ThemeContext } from "../Context/ThemeContext";
import enticationDark from "../assets/enticationDark.png";
import enticationLight from "../assets/enticationLight.png";
// import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

export default function Authentication() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  return (
    <HeaderLayout>
      <AuthenticationLayout
        image={theme === "dark" ? enticationDark : enticationLight}
      >
        <div className=" w-full px-2 flex flex-col gap-6 ">
          <div className="   border-solid border-primary rounded-lg border-[1px] flex flex-col p-6 dark:text-white justify-center sm:justify-end">
            <h1 className="text-right mb-5 text-primary">
              سطح 1 : احراز هویت پایه
            </h1>
            <div className="flex flex-row items-center justify-end">
              <span className="mr-2">ثبت ایمیل</span>
              <span className="icon-wrapper">ww</span>
            </div>
            <div className="flex flex-row items-center justify-end">
              <span className="mr-2">مشخصات فردی</span>
              <span className="icon-wrapper">ww</span>
            </div>
            <div className="flex flex-row items-center justify-end">
              <span className="mr-2">کارت بانکی</span>
              <span className="icon-wrapper">ww</span>
            </div>
            <p className="text-right">: دسترسی ها</p>
            <div className="flex flex-col items-end text-[#586076]">
              <span className="text-right">مشاهده قیمت‌ها</span>
              <span className="text-right">خرید و فروش رمزارزها</span>
            </div>
            <button className="bg-primary w-full mt-5 h-[48px] rounded-lg text-white font-bold mx-auto sm:ml-auto">
              احراز هویت
            </button>
          </div>

          <div className="w-full mb-5 text-[#8792AF] border-solid border-[#D1D9F0] rounded-lg border-[1px] flex flex-col p-6 justify-center sm:justify-end">
            <h1 className="text-right">سطح 1 : احراز هویت پیشرفته</h1>
            <div className="flex flex-row items-center justify-end">
              <span className="mr-2">ثبت مدرک شناسایی</span>
              <span className="icon-wrapper">ww</span>
            </div>
            <div className="flex flex-row items-center justify-end">
              <span className="mr-2">تایید هویت</span>
              <span className="icon-wrapper">ww</span>
            </div>
            <h3 className="mt-5 text-right">: دسترسی ها</h3>
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
      </AuthenticationLayout>
    </HeaderLayout>
  );
}
