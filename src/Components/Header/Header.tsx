import { Link } from "react-router-dom";

import MoonIcon from "../Icons/header/MoonIcon";
import Wallet from "../Icons/header/Wallet";
import Vector from "../Icons/header/vector";
import Home from "../Icons/header/Home";
import Messages from "../Icons/header/Messages";
import Chart from "../Icons/Chart";
import Category from "../Icons/header/Category";
import Frame from "../Icons/header/Frame";
import Ring from "../Icons/header/ring";
import Bitcoin from "../Icons/header/Bitcoin";
import  {ThemeContext}  from "./../../Context/ThemeContext"; 
import  { useContext } from "react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("/");
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext is undefined. Did you forget to wrap in ThemeProvider?");
  }

  const { toggleTheme } = themeContext;

  return (
    <header className="bg-white shadow-md   dark:bg-gray-900 dark:text-white ">
      <nav className="container mx-auto  flex items-center justify-between py-4 px-6">
        <div className="flex gap-4 text-gray-600">
          <button
            className="hover:text-blue-600 transition"
            aria-label="Profile"
          >
            <span>
              <Frame />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition"
            aria-label="Profile"
          >
            <span>
              <Vector />
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
              <Messages />
            </span>
          </button>
          <button
            className="hover:text-blue-600 transition"
            aria-label="Night Mode"
          >
            <span>
              <Ring />
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
         
<ul className="hidden lg:flex space-x-8 text-header-items">
  <li>
    <Link
      to="/services"
      onClick={() => setActiveItem("/services")}
      className={`hover:text-blue-600 transition flex items-center ${
        activeItem === "/services"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue-600 font-semibold"
          : "text-header-items"
      }`}
    >
      خدمات
      <span className="pl-2">
        <Category />
      </span>
    </Link>
  </li>
  <li>
    <Link
      to="/walet"
      onClick={() => setActiveItem("/walet")}
      className={`hover:text-blue-600 transition flex items-center ${
        activeItem === "/walet"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue-600 font-semibold"
          : "text-header-items"
      }`}
    >
      کیف پول
      <span className="pl-2">
        <Wallet />
      </span>
    </Link>
  </li>
  <li>
    <Link
      to="/market"
      onClick={() => setActiveItem("/market")}
      className={`hover:text-blue-600 transition flex items-center ${
        activeItem === "/market"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue-600 font-semibold"
          : "text-header-items"
      }`}
    >
      بازارها
      <span className="pl-2">
        <Chart />
      </span>
    </Link>
  </li>
  <li>
    <Link
      to="/transaction"
      onClick={() => setActiveItem("/transaction")}
      className={`hover:text-blue-600 transition flex items-center ${
        activeItem === "/transaction"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue-600 font-semibold"
          : "text-header-items"
      }`}
    >
      معامله
      <span className="pl-2">
        <Bitcoin />
      </span>
    </Link>
  </li>
  <li>
    <Link
      to="/"
      onClick={() => setActiveItem("/")}
      className={`hover:text-blue-600 transition flex items-center ${
        activeItem === "/"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue-600 font-semibold"
          : "text-header-items"
      }`}
    >
      خانه
      <span className="pl-2">
        <Home />
      </span>
    </Link>
  </li>
</ul>

          <div className="text-blue-600 font-bold pl-6 flex items-center gap-2 lg:gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="./../public/images/pf.png"
                alt="Logo"
                className="w-6 h-6 lg:w-7 lg:h-7"
              />
              <img
                src="./../../../public/images/Group 71185 (1).png"
                alt="Logo"
                className="w-6 h-6 lg:w-7 lg:h-7"
              />
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              id="hamburgerBtn"
              aria-controls="mobileMenu"
              aria-expanded="false"
              className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
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
              className={`fixed inset-0 bg-black/40 transition-opacity duration-300 md:hidden ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />

            <aside
              className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 md:hidden ${
                isOpen ? "translate-x-0" : "translate-x-full"
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
