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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-right">
            <p className="font-bold">کوثر محمدی</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              سطح کاربری ۱
            </p>
            <span className="text-green-600 text-xs">احراز شده</span>
          </div>
        </div>

        {/* منو اصلی */}
        <nav className="p-4 space-y-3 text-right">
          <Link to="/" className="flex items-center justify-end gap-3 hover:text-blue-600">
            خانه <HomeIcon />
          </Link>
          <Link to="/services" className="flex items-center justify-end gap-3 hover:text-blue-600">
            خدمات <CategoryIcon />
          </Link>
          <Link to="/wallet" className="flex items-center justify-end gap-3 hover:text-blue-600">
            کیف پول <WalletIcon />
          </Link>
          <Link to="/market" className="flex items-center justify-end gap-3 hover:text-blue-600">
            بازارها <ChartIcon />
          </Link>
          <Link to="/trade" className="flex items-center justify-end gap-3 hover:text-blue-600">
            معامله <BitcoinIcon />
          </Link>
        </nav>

        {/* پروفایل */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <details className="w-full">
            <summary className="cursor-pointer font-medium text-blue-600">
              پروفایل
            </summary>
            <ul className="pr-4 mt-2 space-y-2 text-gray-600 dark:text-gray-300">
              <li>تنظیمات امنیت</li>
              <li>احراز هویت</li>
              <li>حساب‌های بانکی</li>
              <li>تاریخچه معاملات</li>
              <li>دستگاه‌های متصل</li>
              <li className="text-red-500">خروج از حساب کاربری</li>
            </ul>
          </details>
        </div>

        {/* پایین منو */}
        <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            {theme === "dark" ? <Sun /> : <Moon />} حالت شب
          </button>
          <button className="flex items-center gap-2 text-red-500">
            خروج <LogOut />
          </button>
        </div>
      </div>
    </>
  );
}
