
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";

import ServicesBox from "../ServicesBox/ServicesBox";
import pfIcon from "../../assets/images/HeaderIcon/pf.png";
import groupIcon from "../../assets/images/HeaderIcon/Group 71185 (1).png";

import { ThemeContext } from "./../../Context/ThemeContext";

import FrameIcon from "../../assets/icons/header/FrameIcon";
import VectorIcon from "../../assets/icons/header/VectorIcon";
import MessagesIcon from "../../assets/icons/header/MessagesIcon";
import RingIcon from "../../assets/icons/header/RingIcon";
import CategoryIcon from "../../assets/icons/header/CategoryIcon";
import WalletIcon from "../../assets/icons/header/WalletIcon";
import BitcoinIcon from "../../assets/icons/header/BitcoinIcon";
import HomeIcon from "../../assets/icons/header/HomeIcon";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import MoonIcon from "../../assets/icons/header/MoonIcon";
import HomeActiveIcon from "../../assets/icons/header/HomeActiveIcon";
import ChartActiveIcon from "../../assets/icons/header/ChartActiveIcon";
import CategoryActiveIcon from "../../assets/icons/header/CategoryActiveIcon";
import MessagesActiveIcon from "../../assets/icons/header/MessagesActiveIcon";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const [showServices, setShowServices] = useState(false);

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

    <header className="bg-white  dark:bg-gray-900 dark:text-white sticky top-0 z-50">
      <nav className="container-style mx-auto flex items-center justify-between py-4 px-6">
    
        <div className="flex gap-4 text-gray-600">

          {/* <Link
            to="/login"
            className={`hover:text-blue2 transition flex items-center ${
              currentPath === "/login"
                ? themeContext.theme === "dark"
                  ? "text-primary"
                  : "text-blue2 font-semibold"
                : "text-header-items"
            }`}
          >
            <button className="hover:text-blue2 transition" aria-label="Profile">
              <span className="w-9 h-9 icon-wrapper">
                <FrameIcon />
              </span>
            </button>
          </Link> */}
          <ProfileMenu themeContext={themeContext} currentPath={currentPath}/>

          <button className="hover:text-blue2 transition" aria-label="Profile">
            <span className="w-8 h-8 icon-wrapper">
              <VectorIcon />
            </span>
          </button>
          <button
            className="hover:text-blue2 transition hidden lg:block"
            aria-label="Notifications"
            onClick={toggleTheme}
          >
            <span className="w-7 h-7 icon-wrapper">
              <MoonIcon />
            </span>
          </button>
       <Link
  to="/ticket"
  aria-label="Messages"
  className={`hover:text-blue2 transition ${
    currentPath === "/tiket"
      ? themeContext.theme === "dark"
        ? "text-primary"
        : "text-blue2 font-semibold"
      : "text-header-items"
  }`}
>
  <span className="w-7 h-7 icon-wrapper">
    {currentPath === "/tiket" ? <MessagesActiveIcon/> : <MessagesIcon />}
  </span>
</Link>
          <button className="hover:text-blue2 transition" aria-label="Night Mode">
            <span className="w-7 h-7 icon-wrapper">
              <RingIcon />


            </span>
          </button>
        </div>

       
        <div className="flex items-center space-x-6">
          <ul className="hidden lg:flex space-x-8 text-gray1">

            <li className="relative pr-6">
              <button
                onClick={() => setShowServices(!showServices)}
                className="hover:text-blue-600 transition flex items-center"
              >
                خدمات
               <span className="pl-2 w-8 h-8">
                
  {showServices ?   <CategoryActiveIcon /> : <CategoryIcon />   }

                </span>
              </button>

              {showServices && <ServicesBox onClose={() => setShowServices(false)} />}
            </li>


            <li className=" pr-6">
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

                <span className="pl-2 w-8 h-8">
                  <WalletIcon />

                </span>
              </Link>
            </li>

            <li  className=" pr-6">
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
  <span className="pl-2 w-8 h-8">
    {currentPath === "/market" ? (
      <span className="w-6 h-6">
        <ChartActiveIcon /> {/* ✅ وقتی توی /market باشی */}
      </span>
    ) : (
      <span className="w-6 h-6">
        <ChartIcon /> {/* ✅ وقتی جای دیگه باشی */}
      </span>
    )}
  </span>
</Link>


            </li>

            <li  className=" pr-6">
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

                <span className="pl-2 w-8 h-8">
                  <BitcoinIcon />

                </span>
              </Link>
            </li>

            <li  className=" pr-6">
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
                <span className="pl-2 w-8 h-8">

                  {currentPath === "/" ? (
                    <span className="w-6 h-6">
                      <HomeActiveIcon />
                    </span>
                  ) : (
                    <span className="w-6 h-6">
                      <HomeIcon />
                    </span>
                  )}

                </span>
              </Link>
            </li>
          </ul>

       
          <div className="text-blue-600 font-bold pl-6 flex items-center gap-2 md:gap-4">
            <Link to="/" className="flex items-center">
              <img src={pfIcon} alt="Logo" className="w-6 h-6 lg:w-7 lg:h-7" />
              <img src={groupIcon} alt="Logo" className="w-6 h-6 lg:w-7 lg:h-7" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
