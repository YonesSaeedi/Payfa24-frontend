import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import MessagesIcon from "../../assets/icons/header/MessagesIcon";
import CategoryIcon from "../../assets/icons/header/CategoryIcon";
import WalletIcon from "../../assets/icons/header/WalletIcon";
import BitcoinIcon from "../../assets/icons/header/BitcoinIcon";
import HomeIcon from "../../assets/icons/header/HomeIcon";
import MoonIcon from "../../assets/icons/header/MoonIcon";
import HomeActiveIcon from "../../assets/icons/header/HomeActiveIcon";
import ChartActiveIcon from "../../assets/icons/header/ChartActiveIcon";
import CategoryActiveIcon from "../../assets/icons/header/CategoryActiveIcon";
import MessagesActiveIcon from "../../assets/icons/header/MessagesActiveIcon";
import RingIcon from "../../assets/icons/header/ringIcon";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import pfIcon from "../../assets/images/HeaderIcon/pf.png";
import groupIcon from "../../assets/images/HeaderIcon/Group 71185 (1).png";
import IconRingActive from "../../assets/icons/header/IconRingActive";
import IconSun from "../../assets/icons/header/IconSun";
import { useRef } from "react";
import { useEffect } from "react";
import IconMobileMenue from "../../assets/icons/header/IconMobileMenue";
import MobileMenu from "./MobileMenu";
import NotificationsDropdown from "../Notification/NotificationDropDown";
import ServicesBox from "../ServicesBox/ServicesBox";
import ProfileMenu from "./ProfileMenu";
import VectorIcon from "../../assets/icons/header/vectorIcon";
import WalletActiveIcon from "../../assets/icons/header/WalletActiveIcon";
import IconTradeActive from "../../assets/icons/header/IconTradeActive";

export default function Header() {
  const themeContext = useContext(ThemeContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const [showServices, setShowServices] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Did you forget to wrap in ThemeProvider?"
    );
  }

  const { toggleTheme } = themeContext;

  const toggleServices = () => {
    setShowServices((prev) => !prev);
  };

  return (
    <header className="bg-white dark:bg-gray29  dark:text-white fixed left-0 w-full z-[1000]  ">
      <nav className="container-style mx-auto flex items-center justify-between py-4 px-4 lg:px-6">
        <div className="flex gap-3 md:gap-4 text-gray-600 items-center">
          <div className="hidden lg:flex">
            <ProfileMenu
              themeContext={themeContext}
              currentPath={currentPath}
            />
          </div>

          <button
            className="hidden hover:text-blue2 transition lg:flex items-center justify-center w-8 h-8"
            aria-label="Profile"
          >
            <VectorIcon />
          </button>

          <button
            className="hover:text-blue2 transition hidden lg:flex items-center justify-center w-7 h-7"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            {themeContext.theme === "dark" ? <IconSun /> : <MoonIcon />}
          </button>

          <Link
            to="/ticket"
            aria-label="Messages"
            className={`hover:text-blue2 transition flex items-center justify-center w-7 h-7 ${
              currentPath === "/ticket"
                ? themeContext.theme === "dark"
                  ? "text-primary"
                  : "text-blue2 font-semibold"
                : "text-header-items"
            }`}
          >
            {currentPath === "/ticket" ? (
              <MessagesActiveIcon />
            ) : (
              <MessagesIcon />
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="hover:text-blue2 transition flex items-center justify-center w-7 h-7"
              aria-label="Notifications"
            >
              {showNotifications ? <IconRingActive /> : <RingIcon />}
            </button>

            {showNotifications && (
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50">
                <NotificationsDropdown />
              </div>
            )}
          </div>
          <button
            className="hover:text-blue2 transition flex lg:hidden items-center justify-center w-7 h-7"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            {themeContext.theme === "dark" ? <IconSun /> : <MoonIcon />}
          </button>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <ul className="hidden lg:flex space-x-6 xl:space-x-8 text-gray1">
            <li className="relative pr-4">
              <button
                onClick={toggleServices}
                className="hover:text-blue-600 transition flex items-center"
              >
                خدمات
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  {showServices ? <CategoryActiveIcon /> : <CategoryIcon />}
                </span>
              </button>
            </li>

            <li className="pr-4">
              <Link
                to="/wallet"
                className={`hover:text-blue-600 transition flex items-center ${
                  currentPath === "/wallet"
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue-600 font-semibold"
                    : "text-header-items"
                }`}
              >
                کیف پول
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                    {currentPath === "/wallet" ? <WalletActiveIcon/>:  <WalletIcon />}
                </span>
              
              </Link>
            </li>

            <li className="pr-4">
              <Link
                to="/market"
                className={`hover:text-blue2 transition flex items-center ${
                  currentPath === "/market"
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue2 font-semibold"
                    : "text-header-items"
                }`}
              >
                بازارها
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  {currentPath === "/market" ? (
                    <ChartActiveIcon />
                  ) : (
                    <ChartIcon />
                  )}
                </span>
              </Link>
            </li>

            <li className="pr-4">
              <Link
                to="/trade"
                className={`hover:text-blue2 transition flex items-center ${
                  currentPath.startsWith("/trade")
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue2 font-semibold"
                    : "text-header-items"
                }`}
              >
                معامله
                
                 <span className="pl-2 flex items-center justify-center w-8 h-8">
      {currentPath.startsWith("/trade") ? <IconTradeActive /> : <BitcoinIcon />}
    </span>
              </Link>
            </li>

            <li className="pr-4">
              <Link
                to="/"
                className={`hover:text-blue2 transition flex items-center ${
                  currentPath === "/"
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue2 font-semibold"
                    : "text-header-items"
                }`}
              >
                خانه
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  {currentPath === "/" ? <HomeActiveIcon /> : <HomeIcon />}
                </span>
              </Link>
            </li>
          </ul>
          <div className="text-blue-600 font-bold flex items-center gap-2 md:gap-3">
            <Link to="/" className="flex items-center">
              <img src={pfIcon} alt="Logo" className="w-6 h-6 md:w-7 md:h-7" />
              <img
                src={groupIcon}
                alt="Logo"
                className="w-6 h-6 md:w-7 md:h-7"
              />
            </Link>
          </div>
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <IconMobileMenue /> : <IconMobileMenue />}
          </button>
          <MobileMenu
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            onOpenServicesModal={() => setShowServices(true)}
          />
          {showServices && (
            <ServicesBox onClose={() => setShowServices(false)} />
          )}
        </div>
      </nav>
    </header>
  );
}
