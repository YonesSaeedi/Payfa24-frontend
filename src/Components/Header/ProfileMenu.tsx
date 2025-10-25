import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FrameIcon from "../../assets/icons/header/FrameIcon";
import IconUserAccount from "../../assets/icons/ProfileMenue/IconUserAccount";
import IconSecurity from "../../assets/icons/ProfileMenue/IconSecurity";
import IconAuthentication from "../../assets/icons/ProfileMenue/IconAuthentication";
import IconBankAccounts from "../../assets/icons/ProfileMenue/IconBankAccounts";
import IconConnecteddevices from "../../assets/icons/ProfileMenue/IconConnecteddevices";
import IconTransactionhistory from "../../assets/icons/ProfileMenue/IconTransactionhistory";
import IconExit from "../../assets/icons/ProfileMenue/IconExit";
import IconUser from "../../assets/icons/ProfileMenue/IconUser";
import IconArrowLeft from "../../assets/icons/ProfileMenue/IconArrowLeft";
import { ROUTES } from "../../routes/routes";
import { apiRequest } from "../../utils/apiClient";
import useGetUser from "../../hooks/useGetUser";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";

interface ProfileMenuProps {
  themeContext: {
    theme: "light" | "dark";
  };
  currentPath: string;
}

export default function ProfileMenu({
  themeContext,
  currentPath,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [IsModal, setIsModal] = useState(false);
  const { data: userData, isLoading } = useGetUser();
  const [openSecurity, setOpenSecurity] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest({ url: "/api/auth/logout", method: "POST" });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`hover:text-blue2 transition flex items-center ${
          currentPath === "/login"
            ? themeContext.theme === "dark"
              ? "text-primary"
              : "text-blue2 font-semibold"
            : "text-header-items"
        }`}
        aria-label="Profile"
      >
        <span className="w-9 h-9 icon-wrapper">
          <FrameIcon />
        </span>
      </button>

      <div
        className={`hidden lg:block absolute top-full left-0 mt-2 w-96 rounded-2xl shadow-lg bg-white8 text-sm z-50 overflow-hidden transition-transform duration-300 origin-top ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div
          dir="rtl"
          className="bg-gray33 py-4 px-3 flex items-center justify-between border border-gray21 m-4 rounded-[8px]"
        >
          <div className="flex ">
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
          <button
            onClick={() => navigate(ROUTES.AUTHENTICATION_ADVANCED)}
            className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition shadow-md  hover:shadow-gray12"
          >
            ارتقا سطح
            <span className="w-5 h-5 icon-wrapper mr-1">
              <IconArrowLeft />
            </span>
          </button>
        </div>

        <ul dir="rtl" className="p-4 space-y-3 font-medium">
          <Link to={ROUTES.PROFILE} className="flex items-center gap-2 w-full">
            <li className="flex items-center gap-2 pt-1 hover:text-blue2 cursor-pointer text-black1">
              <span className="w-6 h-6">
                <IconUserAccount />
              </span>
              حساب کاربری
            </li>
          </Link>
          <li
            className="flex flex-col cursor-pointer text-black1"
            onClick={() => setOpenSecurity(!openSecurity)}
          >
            <div className="flex items-center justify-between hover:text-blue2 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6">
                  <IconSecurity />
                </span>
                تنظیمات امنیت
              </div>

              <span
                className={`w-5 h-5 transition-transform duration-300 ${
                  openSecurity ? "rotate-180" : "rotate-0"
                }`}
              >
                <IconChervDown />
              </span>
            </div>

            {openSecurity && (
              <ul className="pr-8 pt-2 space-y-2 text-gray-600 text-sm">
                <Link
                  to={ROUTES.MULTI_FACTOR}
                  className="flex items-center gap-2 hover:text-blue2 px-2 pt-4"
                >
                  <li>ورود دو مرحله‌ای</li>
                </Link>
                <Link
                  to={ROUTES.CHANGE_PASSWORD}
                  className="flex items-center gap-2 hover:text-blue2 px-2 pt-2"
                >
                  <li>تغییر رمز عبور</li>
                </Link>
              </ul>
            )}
          </li>

          <Link
            to={ROUTES.AUTHENTICATION_BASIC}
            className="flex items-center gap-2 w-full"
          >
            <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
              <span className="w-6 h-6">
                <IconAuthentication />
              </span>{" "}
              احراز هویت
            </li>
          </Link>
          <Link
            to={ROUTES.BANK_CARDS}
            className="flex items-center gap-2 w-full"
          >
            <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
              <span className="w-6 h-6">
                <IconBankAccounts />
              </span>{" "}
              حساب‌های بانکی
            </li>
          </Link>

          <Link
            to={ROUTES.TRANSACTION.CRYPTO_HISTORY}
            className="flex items-center gap-2 w-full"
          >
            <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
              <span className="w-6 h-6">
                <IconTransactionhistory />
              </span>{" "}
              تاریخچه معاملات
            </li>
          </Link>
          <Link
            to={ROUTES.CONNECTED_DEVICES}
            className="flex items-center gap-2 w-full"
          >
            <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 pb-2 text-black1">
              <span className="w-6 h-6">
                <IconConnecteddevices />
              </span>{" "}
              دستگاه‌های متصل
            </li>
          </Link>
        </ul>

        <div
          onClick={() => {
            setIsModal(true);
            setOpen(false);
          }}
          className="p-4"
        >
          <button className="w-full rounded-xl border py-2 text-center border-blue2 text-blue-500 hover:bg-gray-100 transition">
            خروج از حساب کاربری
            <span className="w-6 h-6 icon-wrapper ml-1">
              <IconExit />
            </span>
          </button>
        </div>
      </div>

      {IsModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => {
              setIsModal(false);
              console.log("Clicked outside, closing modal");
            }}
          >
            <div
              className="lg:w-3/12 w-11/12 rounded-lg lg:p-10 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center gap-4 flex items-center justify-center flex-col">
                <h1 className="lg:text-2xl text-lg text-black0 font-medium">
                  خروج از حساب کاربری
                </h1>
                <p className="lg:text-lg text-sm text-gray5">
                  آیا از خروج از حساب کاربری خود اطمینان دارید. توجه داشته باشید
                  که اطلاعات شما نزد ما محفوظ میماند
                </p>
              </div>

              <div className="flex gap-2 mt-12 items-center justify-center ">
                <button
                  onClick={() => setIsModal(false)}
                  className="w-1/2 lg:py-3 py-2 border border-blue2 rounded-lg text-blue2  font-medium"
                >
                  انصراف
                </button>
                <Link to={""} className="w-1/2">
                  <button
                    onClick={handleLogout}
                    className="w-full lg:py-3 py-2 font-bold bg-blue2 text-white2 rounded-lg "
                  >
                    خروج
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
