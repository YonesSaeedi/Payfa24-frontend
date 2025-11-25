import { Link} from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import HomeIcon from "../../assets/icons/header/HomeIcon";
import CategoryIcon from "../../assets/icons/header/CategoryIcon";
import WalletIcon from "../../assets/icons/header/WalletIcon";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import BitcoinIcon from "../../assets/icons/header/BitcoinIcon";
import IconUser from "../../assets/icons/ProfileMenue/IconUser";
import IconExit from "../../assets/icons/ProfileMenue/IconExit";
import IconProfileMenu from "../../assets/icons/Login/IconProfileMenu";
import { apiRequest } from "../../utils/apiClient";
import useGetUser from "../../hooks/useGetUser";
import IconSun from "../../assets/icons/header/IconSun";
import MoonIcon from "../../assets/icons/HeaderLogin/MoonIcon";
import { ROUTES } from "../../routes/routes";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";
import { useNavigate } from "react-router-dom";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onOpenServicesModal: () => void;
};

export default function MobileMenu({
  open,
  onClose,
  onOpenServicesModal,
}: MobileMenuProps) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext is undefined. Wrap with ThemeProvider.");
  }

  const { theme, toggleTheme } = themeContext;
  const [openSecurity, setOpenSecurity] = useState(false);

  const { data: userData, isLoading } = useGetUser();

  const navigate = useNavigate();
const { data: kycInfo, isLoading: kycLoading } = useGetKYCInfo();

const handleKYCClick = () => {
  if (kycLoading) return;
  if (!kycInfo?.level_kyc) {
    navigate(ROUTES.AUTHENTICATION_BASIC); 
  } else if (kycInfo.level_kyc === "basic") {
    navigate(ROUTES.AUTHENTICATION_ADVANCED); 
  } else {
    navigate(ROUTES.AUTHENTICATION_ADVANCED);
  }
  onClose(); // بستن منو بعد از انتخاب
};

  const handleLogout = async () => {
    try {
      await apiRequest({ url: "/auth/logout", method: "POST" });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.clear();
      window.location.replace("/login");
    }
  };



  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

    <div
  className={`fixed top-0 right-0 h-full  ${
    open ? "translate-x-0" : "translate-x-full" } max-h-screen z-50 w-72 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 p-3 overflow-y-auto`}
  dir="rtl"
>

        <div
          dir="rtl"
          className=" py-4 px-3 flex-col items-center justify-between border shadow-md m-4 rounded-[20px] mt-8"
        >
          <div className="flex  ">
            <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
              <IconUser />
            </span>
            <div>
              <p className="font-semibold text-black1">
                {isLoading
                  ? "در حال بارگذاری..."
                  : userData?.user.name_display || "—"}
              </p>
              <p className="text-xs text-gray-500 pt-1">
                {isLoading
                  ? ""
                  : `سطح کاربری ${userData?.user.level_account || "—"}`}
              </p>
            </div>
          </div>
        
        </div>

        <nav className="flex flex-col gap-6 p-4 space-y-3 text-right">
   <div className="flex items-center justify-start gap-2">
  <Link to="/" className="flex items-center gap-2 group">
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <HomeIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      خانه
    </span>
  </Link>
</div>


          <div className="flex items-center justify-start gap-2">
  <button
    onClick={() => {
      onClose();
      onOpenServicesModal();
    }}
    className="flex items-center gap-2 group"
  >
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <CategoryIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      خدمات
    </span>
  </button>
</div>

<div className="flex items-center justify-start gap-2">
  <Link to="/wallet" className="flex items-center gap-2 group">
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <WalletIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      کیف پول
    </span>
  </Link>
</div>
<div className="flex items-center justify-start gap-2">
  <Link to="/market" className="flex items-center gap-2 group">
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <ChartIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      بازارها
    </span>
  </Link>
</div>

       <div className="flex items-center justify-start gap-2">
  <Link to="/trade" className="flex items-center gap-2 group">
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <BitcoinIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      معامله
    </span>
  </Link>
</div>

        </nav>

        <div className="p-4 text-right">
        <details className="w-full group">
  <summary className="flex items-center justify-between cursor-pointer">
    <div className="flex items-center gap-2 group/item">
      <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover/item:text-blue2">
        <IconProfileMenu />
      </span>
      <span className="transition-colors duration-200 group-hover/item:text-blue2">
        پروفایل
      </span>
    </div>

    <svg
      className="w-5 h-5 transform transition-transform duration-300 group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </summary>

  <ul dir="rtl" className="pr-4 mt-5 text-gray-600 dark:text-gray-300 space-y-4">

    {/* تنظیمات امنیت */}
    <li className="flex flex-col cursor-pointer">
      <div
        className="flex items-center justify-between pt-2 group/security w-auto"
        onClick={() => setOpenSecurity(!openSecurity)}
      >
        <span className="transition-colors duration-200 group-hover/security:text-blue2">
          تنظیمات امنیت
        </span>
        <span
          className={`w-5 h-5 transition-transform duration-300 ${
            openSecurity ? "rotate-180" : "rotate-0"
          }`}
        >
          <IconChervDown />
        </span>
      </div>

      {openSecurity && (
        <ul className="lg:pr-8 pt-2 space-y-2 text-gray-600 text-sm">

          <div className="flex items-center justify-start gap-2">
            <Link
              to={ROUTES.MULTI_FACTOR}
              className="flex items-center gap-2 group w-auto"
            >
              <span className="transition-colors duration-200 hover:text-blue2">
                ورود دو مرحله‌ای
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-start gap-2">
            <Link
              to={ROUTES.CHANGE_PASSWORD}
              className="flex items-center gap-2 group w-auto"
            >
              <span className="transition-colors duration-200 hover:text-blue2">
                تغییر رمز عبور
              </span>
            </Link>
          </div>

        </ul>
      )}
    </li>

    {/* احراز هویت */}
<div className="flex items-center justify-start gap-2">
  <button
    onClick={handleKYCClick}
    className="flex items-center gap-2 group w-auto transition-colors duration-200 hover:text-blue2"
  >
    احراز هویت
  </button>
</div>


    {/* حساب‌های بانکی */}
    <div className="flex items-center justify-start gap-2">
      <Link
        to={ROUTES.BANK_CARDS}
        className="flex items-center gap-2 group w-auto"
      >
        <span className="transition-colors duration-200 hover:text-blue2">
          حساب‌های بانکی
        </span>
      </Link>
    </div>

    {/* تاریخچه معاملات */}
    <div className="flex items-center justify-start gap-2">
      <Link
        to={ROUTES.TRANSACTION.ROOT}
        className="flex items-center gap-2 group w-auto"
      >
        <span className="transition-colors duration-200 hover:text-blue2">
          تاریخچه معاملات
        </span>
      </Link>
    </div>

    {/* دستگاه‌های متصل */}
    <div className="flex items-center justify-start gap-2">
      <Link
        to={ROUTES.CONNECTED_DEVICES}
        className="flex items-center gap-2 group w-auto"
      >
        <span className="transition-colors duration-200 hover:text-blue2">
          دستگاه‌های متصل
        </span>
      </Link>
    </div>



  </ul>
</details>

        </div>

        {/* پایین منو */}
      {/* حالت شب */}
<div className="p-4 flex-col items-center justify-between dark:border-gray-700">
  <div className="flex items-center justify-start gap-2">
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 group w-auto"
    >
      <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
        {theme === "dark" ? <IconSun /> : <MoonIcon />}
      </span>
      <span className="transition-colors duration-200 group-hover:text-blue2">
        حالت شب
      </span>
    </button>
  </div>
</div>

{/* خروج از حساب کاربری */}
<div className="p-4 flex items-center justify-start gap-2">
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 group w-auto"
  >
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-red-600 ">
      <IconExit />
    </span>
    <span className=" transition-colors duration-200 group-hover:text-red-600">
      خروج از حساب کاربری
    </span>
  </button>
</div>

      </div>
    </>
  );
}
