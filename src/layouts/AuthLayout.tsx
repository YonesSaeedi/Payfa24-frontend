import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import MoonIcon from "../assets/icons/HeaderLogin/MoonIcon";
import SupportIcon from "../assets/icons/HeaderLogin/SupportIcon";
import pfIcon from "../../../images/HeaderIcon/pf.png";
import groupIcon from "../../../images/HeaderIcon/Group 71185 (1).png";

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: string;
}
export default function AuthLayout({ children, image }: AuthLayoutProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { toggleTheme } = context;
  const { theme } = context;

  return (
    <div className="w-full flex flex-col lg:flex-row dark:bg-white4">
      {/* image section */}
      <div className="w-full pt-12 lg:pt-0">
        {image && (
          <div className={`flex h-full flex-col items-center justify-around lg:rounded-e-2xl  ${theme === "dark" ? "lg:bg-gray0" : "lg:bg-gray0 bg-none"} `}>
            {/* logo && button (Icon)*/}
            <div className="flex justify-between items-center w-full lg:px-16 px-4 flex-row-reverse">
              <div className="text-blue2 font-bold flex items-center">
                <img src={pfIcon} alt="Logo" className="w-7 h-7 lg:w-9 lg:h-9" />
                <img src={groupIcon} alt="Logo" className="w-7 h-7 lg:w-9 lg:h-9" />
              </div>
              <div className="flex flex-row-reverse gap-6 items-center">
                <button onClick={toggleTheme} className=" rounded-full " aria-label="Toggle theme">
                  <span className="icon-wrapper h-8 w-8 text-blue2">
                    <MoonIcon />
                  </span>
                </button>
                <button className="rounded-full" aria-label="Support">
                  <span className="icon-wrapper h-8 w-8 text-blue2">
                    <SupportIcon />
                  </span>
                </button>
              </div>
            </div>

            {/* image */}
            <img
              src={image}
              alt="Authentication Visual"
              className="object-fill lg:object-contain hidden lg:block lg:w-[915px] lg:h-[608px] w-[250px] h-[170px] "
              onError={(e) => console.error("Failed to load image:", image, e)}
            />
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="w-full h-screen lg:pt-8 py-10 flex flex-col items-center justify-center ">{children}</div>
    </div>
  );
}
