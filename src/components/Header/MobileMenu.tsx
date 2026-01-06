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
import useGetUser from "../../hooks/useGetUser";
import IconSun from "../../assets/icons/header/IconSun";
import MoonIcon from "../../assets/icons/HeaderLogin/MoonIcon";
import { ROUTES } from "../../routes/routes";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";
import { useNavigate } from "react-router-dom";
import ReceiptTextIcon from "../../assets/icons/Home/WalletCardIcon/ReceiptTextIcon";
import Logout from "../../assets/images/logout.png";


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
 // قبل از return
const [IsModal, setIsModal] = useState(false);



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



const handleLogout = () => {
  const token = localStorage.getItem("accessToken");

  localStorage.removeItem("_grecaptcha");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("expiresAt");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("fcmToken");
  window.location.replace("/login");
  
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const dataToSign = `POST api/v4/auth/logout ${timestamp} []`;
  const signature = CryptoJS.HmacSHA256(
    dataToSign,
    "V65HMX2FHYVQCFT33WX3PCPY7H59MIBDOMCOWQ4LALMYCYBY4HJIGAN51JOEK590"
  ).toString(CryptoJS.enc.Hex);

  fetch("https://api.payfa24.org/api/v4/auth/logout", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      "X-Signature": signature,
      "X-Timestamp": timestamp,
      "X-Device": "mobile",
    },
    keepalive: true,
    credentials: "include",
  }).catch(() => {});
};

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
          onClick={onClose}
        />
      )}

    <div
  className={`fixed top-0 right-0 h-full  ${open ? "translate-x-0" : "translate-x-full" } max-h-screen z-30 w-72 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 p-3 overflow-y-auto`}dir="rtl">

        <div dir="rtl" className=" py-4 px-3 flex-col items-center justify-between border shadow-md m-4 rounded-[20px] mt-8">
          <div className="flex  ">
            <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
              <IconUser />
            </span>
           <div>
  <p className="font-semibold text-black1">
    {isLoading
      ? "در حال بارگذاری..."
      : `${userData?.user.name || ""} ${userData?.user.family || ""}`}
  </p>
 <p className="text-xs text-gray-500 pt-1">
  {isLoading ? "": `سطح احراز هویت ${userData?.user.level_kyc === "advanced"? "پیشرفته": userData?.user.level_kyc === "basic"? "پایه": "—"}`}
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
  <button onClick={() => {onClose();onOpenServicesModal();}}
    className="flex items-center gap-2 group">
    <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover:text-blue2">
      <CategoryIcon />
    </span>
    <span className="transition-colors duration-200 group-hover:text-blue2">
      خدمات
    </span>
  </button>
</div>

<li className="flex flex-col cursor-pointer">
  <details className="w-full group">
    <summary className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-2 group/item">
        <span className="flex items-center justify-center w-6 h-6 transition-colors duration-200 group-hover/item:text-blue2">
         <ReceiptTextIcon/>
        </span>
        <span className="transition-colors duration-200 group-hover/item:text-blue2">
          تاریخچه
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

    <ul className="pr-4 mt-5 text-gray-600 dark:text-gray-300 space-y-4">
      <div className="flex items-center justify-start gap-2">
        <Link
          to={ROUTES.TRANSACTION.ORDER_HISTORY}
          className="flex items-center gap-2 group w-auto"
        >
          <span className="transition-colors duration-200 hover:text-blue2">
         تاریخچه خرید و فروش
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-start gap-2">
        <Link
          to={ROUTES.TRANSACTION.CRYPTO_HISTORY}
          className="flex items-center gap-2 group w-auto"
        >
          <span className="transition-colors duration-200 hover:text-blue2">
           تاریخچه رمزارز
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-start gap-2">
        <Link
              to={ROUTES.TRANSACTION.TOMAN_HISTORY}
          className="flex items-center gap-2 group w-auto"
        >
          <span className="transition-colors duration-200 hover:text-blue2">
           تاریخچه تومانی
          </span>
        </Link>
      </div>
    </ul>
  </details>
</li>


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
   onClick={() => setIsModal(true)}
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
  

  {IsModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    onClick={() => setIsModal(false)} // ← کلیک روی بک‌گراند، مودال بسته می‌شود
  >
    {/* overlay کل صفحه */}
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

    {/* مودال وسط صفحه با عرض محدود */}
    <div
      className="relative w-11/12 max-w-md lg:max-w-lg rounded-lg lg:p-8 p-4 bg-white8 z-10"
      onClick={(e) => e.stopPropagation()} // ← کلیک داخل مودال رو جلوگیری می‌کنه
    >
      <div className="text-center gap-4 flex items-center justify-center flex-col">
        <img src={Logout} alt="Logout" />
        <h1 className="lg:text-2xl text-lg text-black0 font-medium">
          خروج از حساب کاربری
        </h1>
        <p className="lg:text-lg text-sm text-gray5">
          آیا از خروج از حساب کاربری خود اطمینان دارید. توجه داشته باشید که اطلاعات شما محفوظ می‌ماند
        </p>
      </div>

      <div className="flex gap-2 mt-12 items-center justify-center">
        <button
          onClick={() => setIsModal(false)}
          className="w-1/2 lg:py-3 py-2 border border-blue2 rounded-xl text-blue2 font-bold"
        >
          انصراف
        </button>
        <button
          onClick={handleLogout}
          className="w-1/2 lg:py-3 py-2 font-bold bg-blue2 text-white2 rounded-xl"
        >
          خروج
        </button>
      </div>
    </div>
  </div>
)}



    </>

    
  );

  
}
