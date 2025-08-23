import { Link } from "react-router-dom";
import pfIcon from "../../assets/images/HeaderIcon/pf.png";
import groupIcon from "../../assets/images/HeaderIcon/Group 71185 (1).png";



import { ThemeContext } from "./../../Context/ThemeContext";
import { useContext, useState } from "react";
import FrameIcon from "../../assets/icons/header/FrameIcon";
import VectorIcon from "../../assets/icons/header/vectorIcon";
import MoonIcon from "../../assets/icons/header/MoonIcon";
import MessagesIcon from "../../assets/icons/header/MessagesIcon";
import RingIcon from "../../assets/icons/header/ringIcon";
import CategoryIcon from "../../assets/icons/header/CategoryIcon";
import WalletIcon from "../../assets/icons/header/WalletIcon";
import Chart from "../../assets/icons/Chart";
import BitcoinIcon from "../../assets/icons/header/BitcoinIcon";
import HomeIcon from "../../assets/icons/header/HomeIcon";

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("/");
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Did you forget to wrap in ThemeProvider?"
    );
  }

  const { toggleTheme } = themeContext;

  return (

    <header className="bg-white shadow-md dark:bg-gray-900 dark:text-white sticky top-0 z-50">
      <nav className="container-style mx-auto  flex items-center justify-between py-4 px-6">
        <div className="flex gap-4 text-gray-600">
          <button
            className="hover:text-blue-600 transition"
            aria-label="Profile"
          >
            <span>
              <FrameIcon />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition"
            aria-label="Profile"
          >
            <span>
              <VectorIcon />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition hidden lg:block"
            aria-label="Notifications"
            onClick={toggleTheme}
          >
            <span>
              <MoonIcon />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition"
            aria-label="Messages"
          >
            <span>
              <MessagesIcon />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition"
            aria-label="Night Mode"
          >
            <span>
              <RingIcon />
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <ul className="hidden lg:flex space-x-8 text-gray1">
            <li >
              <Link
                to="/services"
                onClick={() => setActiveItem("/services")}

                className={`hover:text-blue-600 transition flex items-center ${activeItem === "/services"
                  ? themeContext.theme === "dark"
                    ? "text-gray1"
                    : "text-blue-600 font-semibold"
                  : "text-gray1"
                  }`}
              >
                خدمات
                <span className="pl-2 w-8 h-8  ">
                  <CategoryIcon />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/walet"
                onClick={() => setActiveItem("/walet")}
                className={`hover:text-blue-600 transition flex items-center ${activeItem === "/walet"
                  ? themeContext.theme === "dark"
                    ? "text-primary"
                    : "text-blue-600 font-semibold"
                  : "text-header-items"
                  }`}
              >
                کیف پول
                <span className="pl-2 w-8 h-8 ">
                  <WalletIcon />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/market"
                onClick={() => setActiveItem("/market")}
                className={`hover:text-blue-600 transition flex items-center ${activeItem === "/market"
                  ? themeContext.theme === "dark"
                    ? "text-primary"
                    : "text-blue-600 font-semibold"
                  : "text-header-items"
                  }`}
              >
                بازارها
                <span className="pl-2 w-8 h-8 ">
                  <Chart />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/transaction"
                onClick={() => setActiveItem("/transaction")}
                className={`hover:text-blue-600 transition flex items-center ${activeItem === "/transaction"
                  ? themeContext.theme === "dark"
                    ? "text-primary"
                    : "text-blue-600 font-semibold"
                  : "text-header-items"
                  }`}
              >
                معامله
                <span className="pl-2  w-8 h-8">
                  <BitcoinIcon />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => setActiveItem("/")}
                className={`hover:text-blue-600 transition flex items-center ${activeItem === "/"
                  ? themeContext.theme === "dark"
                    ? "text-primary"
                    : "text-blue-600 font-semibold"
                  : "text-header-items"
                  }`}
              >
                خانه
                <span className="pl-2 w-8 h-8">
                  <HomeIcon />
                </span>
              </Link>
            </li>
          </ul>

          <div className="text-blue-600 font-bold pl-6 flex items-center gap-2 lg:gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={pfIcon}
                alt="Logo"
                className="w-6 h-6 lg:w-7 lg:h-7"
              />
              <img
                src={groupIcon}
                alt="Logo"
                className="w-6 h-6 lg:w-7 lg:h-7"
              />
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              id="hamburgerBtn"
              aria-controls="mobileMenu"
              aria-expanded="false"
              className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              title="open menu"
            >
              <img
                src="./../../../public/images/menu.png"
                alt="منوی موبایل"
                className="w-6 h-6 object-contain"
              />
            </button>
            <div
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            />

            <aside
              className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}

              role="dialog"
              aria-hidden={!isOpen}
            ></aside>
          </div>
        </div>
      </nav>
    </header>
  );
}
