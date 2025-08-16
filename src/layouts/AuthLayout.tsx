import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

import Logo from "/pf.png";
import MoonIcon from "../assets/Icons/HeaderLogin/MoonIcon";
import SupportIcon from "../assets/Icons/HeaderLogin/SupportIcon";

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: string;
}

export default function AuthLayout({ children, image }: AuthLayoutProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { toggleTheme } = context;

  return (
    <div className=" flex lg:flex-row flex-col dark:bg-[var(--extra-dark-background)]">
      {/* image section */}
      <div className="lg:w-1/2 lg:h-screen">
        {image && (
          <div className="flex h-full flex-col items-center justify-between  px-4 dark:bg-[var(--background)] md:bg-secondary light:bg-[var(--background)]  rounded-e-2xl  ">
            {/* logo && button (Icon) */}
            <div className="flex justify-between items-center w-full lg:px-8 px-2 py-6 flex-row-reverse">
              <div>
                <img src={Logo} alt="Logo" className="h-10" />
              </div>
              <div className="flex  flex-row-reverse gap-4 items-center ">
                <button
                  onClick={toggleTheme}
                  className=" rounded-full "
                  aria-label="Toggle theme"
                >
                  <span className="icon-wrapper h-8 w-8 text-primary">
                    <MoonIcon />
                  </span>
                </button>
                <button className="rounded-full" aria-label="Support">
                  <span className="icon-wrapper h-8 w-8 text-primary">
                    <SupportIcon />
                  </span>
                </button>
              </div>
            </div>

            {/* image */}
            <img
              src={image}
              alt="Authentication Visual"
              className="w-full h-full object-contain"
              onError={(e) => console.error("Failed to load image:", image, e)}
            />
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full  flex flex-col items-center justify-center  ">
        {children}
      </div>
    </div>
  );
}
