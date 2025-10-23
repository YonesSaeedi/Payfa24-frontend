import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
// آیکون‌های اختصاصی پروژه‌ت
import HomeIcon from "../../assets/icons/header/HomeIcon";
import CategoryIcon from "../../assets/icons/header/CategoryIcon";
import WalletIcon from "../../assets/icons/header/WalletIcon";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import BitcoinIcon from "../../assets/icons/header/BitcoinIcon";
import IconUser from "../../assets/icons/ProfileMenue/IconUser";
import IconArrowLeft from "../../assets/icons/ProfileMenue/IconArrowLeft";
import IconExit from "../../assets/icons/ProfileMenue/IconExit";
import IconProfileMenu from "../../assets/icons/Login/IconProfileMenu";
import { apiRequest } from "../../utils/apiClient";
import useGetUser from "../../hooks/useGetUser"; // مسیر رو متناسب با پروژه درست کن
import IconSun from "../../assets/icons/header/IconSun";
import MoonIcon from "../../assets/icons/HeaderLogin/MoonIcon";
import { ROUTES } from "../../routes/routes";
import IconAuthentication from "../../assets/icons/ProfileMenue/IconAuthentication";
import IconBankAccounts from "../../assets/icons/ProfileMenue/IconBankAccounts";
import IconTransactionhistory from "../../assets/icons/ProfileMenue/IconTransactionhistory";
import IconConnecteddevices from "../../assets/icons/ProfileMenue/IconConnecteddevices";
import IconSecurity from "../../assets/icons/ProfileMenue/IconSecurity";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";


type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onOpenServicesModal: () => void;
};

export default function MobileMenu({ open, onClose, onOpenServicesModal }: MobileMenuProps) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext is undefined. Wrap with ThemeProvider.");
  }

  const { theme, toggleTheme } = themeContext;
  const [openSecurity, setOpenSecurity] = useState(false);

  const { data: userData, isLoading } = useGetUser();

  const handleLogout = async () => {
    try {
      await apiRequest({ url: "/api/auth/logout", method: "POST" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    finally {
      localStorage.clear();
      window.location.replace("/login");
    }
  };
  const navigate = useNavigate();

  return (
    <>
      {/* پس‌زمینه تاریک */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* منو سمت راست */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-72 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 p-3 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        dir="rtl"
      >
        {/* هدر پروفایل */}
        <div
          dir="rtl"
          className=" py-4 px-3 flex-col items-center justify-between border shadow-md m-4 rounded-[20px] mt-12"
        >
          <div className="flex  ">
            <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
              <IconUser />
            </span>
            <div >
              <p className="font-semibold text-black1">
                {isLoading ? "در حال بارگذاری..." : userData?.user.name_display || "—"}
              </p>
              <p className="text-xs text-gray-500 pt-1">
                {isLoading ? "" : `سطح کاربری ${userData?.user.level_account || "—"}`}
              </p>
            </div>
          </div>
          <button onClick={() => navigate(ROUTES.AUTHENTICATION_ADVANCED)} className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition w-full mt-4  shadow-md  hover:shadow-gray12">
            ارتقا سطح
            <span className="w-5 h-5 icon-wrapper mr-1">
              <IconArrowLeft />
            </span>
          </button>
        </div>

        {/* منو اصلی */}
        <nav className="flex flex-col gap-6 p-4 space-y-3 text-right">
          <Link to="/" className="  flex items-center justify-start gap-2 hover:text-blue-600">
            <span className=" flex items-center justify-center w-6 h-6 text-blue2">
              <HomeIcon />
            </span>
            خانه
          </Link>
          <button
            onClick={() => {
              onClose();              // بستن منوی موبایل
              onOpenServicesModal();   // باز کردن مودال خدمات
            }}
            className="flex items-center justify-start gap-2 hover:text-blue-600 w-full text-left"
          >
            <span className="flex items-center justify-center w-6 h-6 text-blue2">
              <CategoryIcon />
            </span>
            خدمات
          </button>

          <Link to="/wallet" className="flex items-center justify-start gap-2 hover:text-blue-600">
            <span className=" flex items-center justify-center w-6 h-6 text-blue2">
              <WalletIcon />
            </span>
            کیف پول
          </Link>
          <Link to="/market" className=" flex items-center justify-start gap-2 hover:text-blue-600">
            <span className=" flex items-center justify-center w-6 h-6 text-blue2">
              <ChartIcon />
            </span>
            بازارها
          </Link>
          <Link to="/trade" className=" flex items-center justify-start gap-2 hover:text-blue-600">
            <span className=" flex items-center justify-center w-6 h-6 text-blue2">
              <BitcoinIcon />
            </span>

            معامله
          </Link>
        </nav>

        {/* پروفایل */}
        <div className="p-4 text-right">
          <details className="w-full group">
            <summary className="flex items-center justify-between cursor-pointer  hover:text-blue2">
              <span className="flex">
                <span className=" flex items-center justify-center w-6 h-6 ml-2 text-blue2">
                  <IconProfileMenu />
                </span>
                پروفایل

              </span>
              <svg
                className="w-5 h-5 transform transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ul dir="rtl" className="pr-4 mt-5 text-gray-600 dark:text-gray-300 space-y-4">
              <li
                className="flex flex-col cursor-pointer "
                onClick={() => setOpenSecurity(!openSecurity)}
              >
                <div className="flex items-center justify-between hover:text-blue2 pt-2">
                  <div className="flex items-center gap-2">
                    {/* <span className="w-6 h-6">
        <IconSecurity />
      </span> */}
                    تنظیمات امنیت
                  </div>

                  {/* 🔽 آیکن فلش (خودت import کن) */}
                  <span
                    className={`w-5 h-5 transition-transform duration-300 ${openSecurity ? "rotate-180" : "rotate-0"
                      }`}
                  >
                    <IconChervDown />
                  </span>
                </div>

                {openSecurity && (
                  <ul className="lg:pr-8 pt-2 space-y-2 text-gray-600 text-sm">
                    <Link to={ROUTES.MULTI_FACTOR} className="flex items-center gap-2 hover:text-blue2 px-4 pt-4">
                      <li>ورود دو مرحله‌ای</li>
                    </Link>
                    <Link to={ROUTES.CHANGE_PASSWORD} className="flex items-center gap-2 hover:text-blue2 px-4 py-3">
                      <li>تغییر رمز عبور</li>
                    </Link>
                  </ul>
                )}
              </li>

              <Link to={ROUTES.AUTHENTICATION_BASIC} className="flex items-center gap-2 w-full">
                <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer ">
                  {/* <span className="w-6 h-6"> <IconAuthentication /></span> */}
                  احراز هویت
                </li>
              </Link>

              <Link to={ROUTES.BANK_CARDS} className="flex items-center gap-2 ">
                <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer">
                  {/* <span className="w-6 h-6"> <IconBankAccounts /></span> */}
                  حساب‌های بانکی
                </li>
              </Link>

              <Link to={ROUTES.TRANSACTION.ROOT} className="flex items-center gap-2 w-full">
                <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer ">
                  {/* <span className="w-6 h-6"> <IconTransactionhistory /></span> */}
                  تاریخچه معاملات
                </li>
              </Link>

              <Link to={ROUTES.CONNECTED_DEVICES} className="flex items-center gap-2 ">
                <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer ">
                  {/* <span className="w-6 h-6">  <IconConnecteddevices /></span> */}
                  دستگاه‌های متصل
                </li>
              </Link>

              <Link to={ROUTES.LOGIN} className="flex items-center gap-2 w-full">
                <li className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer ">

                  خروج از حساب کاربری
                </li>
              </Link>
            </ul>
          </details>
        </div>

        {/* پایین منو */}
        <div className="p-4 flex-col items-center justify-between dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300"
          >
            {theme === "dark" ? <span className="w-6 h-6 text-blue2"><IconSun /></span> : <span className="w-6 h-6 text-blue2"><MoonIcon /></span>}حالت شب
          </button>

        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-4">
          <span className="w-6 h-6 text-blue2"><IconExit /></span>
          خروج از حساب کاربری
        </button>
      </div>
    </>
  );
}
