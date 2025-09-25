import { Link } from "react-router-dom";
import { Moon, Sun, LogOut } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

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

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext is undefined. Wrap with ThemeProvider.");
  }

  const { theme, toggleTheme } = themeContext;

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
        className={`fixed top-0 right-0 h-full z-50 w-72 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* هدر پروفایل */}
             <div
          dir="rtl"
          className="bg-gray33 py-4 px-3 flex-col items-center justify-between border border-gray21 m-4 rounded-[8px]"
        >
          <div className="flex ">
            <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
              <IconUser />
            </span>
            <div>
              <p className="font-semibold text-black1">کوثر محمدی</p>
              <p className="text-xs text-gray-500 pt-1">سطح کاربری 1</p>
            </div>
          </div>
          <button className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition w-full mt-4">
            ارتقا سطح
            <span className="w-5 h-5 icon-wrapper mr-1">
              <IconArrowLeft />
            </span>
          </button>
        </div>

        {/* منو اصلی */}
        <nav className="flex flex-col gap-6 p-4 space-y-3 text-right">
          <Link to="/" className="  flex items-center justify-start gap-2 hover:text-blue-600">
           <span className=" flex items-center justify-center w-6 h-6">
                  <HomeIcon />
                </span>
                 خانه 
          </Link>
          <Link to="/services" className=" flex items-center justify-start gap-2 hover:text-blue-600">
           <span className=" flex items-center justify-center w-6 h-6">
                  <CategoryIcon />
                </span>
                 
            خدمات 
          </Link>
          <Link to="/wallet" className="flex items-center justify-start gap-2 hover:text-blue-600">
           <span className=" flex items-center justify-center w-6 h-6">
                 <WalletIcon />
                </span>
            کیف پول 
          </Link>
          <Link to="/market" className=" flex items-center justify-start gap-2 hover:text-blue-600">
          <span className=" flex items-center justify-center w-6 h-6">
                 <ChartIcon />
                </span>
            بازارها 
          </Link>
          <Link to="/trade" className=" flex items-center justify-start gap-2 hover:text-blue-600">
          <span className=" flex items-center justify-center w-6 h-6">
                <BitcoinIcon />
                </span>
         
            معامله 
          </Link>
        </nav>

        {/* پروفایل */}
        <div className="p-4 text-right">
  <details className="w-full group">
    <summary className="flex items-center justify-between cursor-pointer font-medium text-blue-600">
      <span className="flex">
        <span className=" flex items-center justify-center w-6 h-6 ml-2">
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
    <ul className=" pr-4 mt-2  text-gray-600 dark:text-gray-300">
      <li  className="mb-4">تنظیمات امنیت</li>
      <li  className="mb-4">احراز هویت</li>
      <li  className="mb-4">حساب‌های بانکی</li>
      <li  className="mb-4">تاریخچه معاملات</li>
      <li  className="mb-4">دستگاه‌های متصل</li>
      <li className="text-red-500">خروج از حساب کاربری</li>
    </ul>
  </details>
</div>

        {/* پایین منو */}
        <div className="p-4 flex-col items-center justify-between dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            {theme === "dark" ? <Sun /> : <Moon />} حالت شب
          </button>
          
        </div>
        <button className="flex items-center gap-2   p-4">
             <span className="w-6 h-6 text-black1"><IconExit/></span>
        خروج از حساب کاربری 
          </button>
      </div>
    </>
  );
}
