import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "./../../Context/ThemeContext";

import MessagesIcon from "../../assets/Icons/header/MessagesIcon";
import CategoryIcon from "../../assets/Icons/header/CategoryIcon";
import WalletIcon from "../../assets/Icons/header/WalletIcon";
import BitcoinIcon from "../../assets/Icons/header/BitcoinIcon";
import HomeIcon from "../../assets/Icons/header/HomeIcon";
import MoonIcon from "../../assets/Icons/header/MoonIcon";
import HomeActiveIcon from "../../assets/Icons/header/HomeActiveIcon";
import ChartActiveIcon from "../../assets/Icons/header/ChartActiveIcon";
import CategoryActiveIcon from "../../assets/Icons/header/CategoryActiveIcon";
import MessagesActiveIcon from "../../assets/Icons/header/MessagesActiveIcon";
import ProfileMenu from "./ProfileMenu";
import ServicesBox from "../ServicesBox/ServicesBox";
import VectorIcon from "../../assets/Icons/header/vectorIcon";
import RingIcon from "../../assets/Icons/header/ringIcon";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import pfIcon from "../../assets/images/HeaderIcon/pf.png";
import groupIcon from "../../assets/images/HeaderIcon/Group 71185 (1).png";
import NotificationDropDown from "../Notification/NotificationDropDown";
import IconRingActive from "../../assets/icons/header/IconRingActive";
import IconSun from "../../assets/icons/header/IconSun";

export default function Header() {
  const [showServices, setShowServices] = useState(false);
  const [open, setOpen] = useState(false);

  const themeContext = useContext(ThemeContext);
  const location = useLocation();
  const currentPath = location.pathname;

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Did you forget to wrap in ThemeProvider?"
    );
  }

  const { toggleTheme } = themeContext;

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white sticky top-0 z-50">
      <nav className="container-style mx-auto flex items-center justify-between py-4 px-6">
        {/* Left Icons */}
        <div className="flex gap-4 text-gray-600 items-center">
          <ProfileMenu themeContext={themeContext} currentPath={currentPath} />

          {/* Profile Icon */}
          <button
            className="hover:text-blue2 transition flex items-center justify-center w-8 h-8"
            aria-label="Profile"
          >
            <VectorIcon />
          </button>

          {/* Moon Icon */}
         <button
  className="hover:text-blue2 transition hidden lg:flex items-center justify-center w-7 h-7"
  aria-label="Toggle Theme"
  onClick={toggleTheme}
>
  {themeContext.theme === "dark" ? <IconSun/> : <MoonIcon />}
</button>




          {/* Messages Icon */}
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

<div className="relative group">
  {/* دکمه */}
  <button
    className="hover:text-blue2 transition flex items-center justify-center w-7 h-7"
    aria-label="Notifications"
  >
    <IconRingActive />
  </button>

  {/* پل نامرئی */}
  <div className="absolute left-0 top-full w-full h-4 bg-transparent"></div>

  {/* Dropdown */}
  <div className="absolute left-0 top-[calc(100%+1rem)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
    <NotificationDropDown />
  </div>
</div>




        </div>

        <div className="flex items-center space-x-6">
          <ul className="hidden lg:flex space-x-8 text-gray1">
            {/* Services */}
            <li className="relative pr-6">
              <button
                onClick={() => setShowServices(!showServices)}
                className="hover:text-blue-600 transition flex items-center"
              >
                خدمات
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  {showServices ? <CategoryActiveIcon /> : <CategoryIcon />}
                </span>
              </button>

              {showServices && (
                <ServicesBox onClose={() => setShowServices(false)} />
              )}
            </li>

            {/* Wallet */}
            <li className="pr-6">
              <Link
                to="/walet"
                className={`hover:text-blue-600 transition flex items-center ${
                  currentPath === "/walet"
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue-600 font-semibold"
                    : "text-header-items"
                }`}
              >
                کیف پول
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  <WalletIcon />
                </span>
              </Link>
            </li>

            {/* Market */}
            <li className="pr-6">
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

            {/* Trade */}
            <li className="pr-6">
              <Link
                to="/trade"
                className={`hover:text-blue2 transition flex items-center ${
                  currentPath === "/transaction"
                    ? themeContext.theme === "dark"
                      ? "text-primary"
                      : "text-blue2 font-semibold"
                    : "text-header-items"
                }`}
              >
                معامله
                <span className="pl-2 flex items-center justify-center w-8 h-8">
                  <BitcoinIcon />
                </span>
              </Link>
            </li>

            {/* Home */}
            <li className="pr-6">
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

          {/* Logo */}
          <div className="text-blue-600 font-bold pl-6 flex items-center gap-2 md:gap-4">
            <Link to="/" className="flex items-center">
              <img src={pfIcon} alt="Logo" className="w-6 h-6 lg:w-7 lg:h-7" />
              <img
                src={groupIcon}
                alt="Logo"
                className="w-6 h-6 lg:w-7 lg:h-7"
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
