import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
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
  const {theme} = context;

  return (
    <div className="w-screen flex flex-col lg:flex-row dark:bg-white4">
      {/* image section */}
      <div className="w-full ">
        {image && (
          <div className={`flex h-full flex-col items-center justify-around  px-4   rounded-e-2xl  ${theme === "dark" ? "bg-gray0" : "lg:bg-gray0 bg-none"} `}>
            {/* logo && button (Icon)*/}
            <div className="flex justify-between items-center w-full lg:px-8 px-2 py-6 flex-row-reverse">
              <div>
                <img src={Logo} alt="Logo" className="h-10" />
              </div>
              <div className="flex flex-row-reverse gap-4 items-center ">
                <button
                  onClick={toggleTheme}
                  className=" rounded-full "
                  aria-label="Toggle theme"
                >
                  <span className="icon-wrapper h-8 w-8 text-blue2">
                    <MoonIcon/>
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
              className=" object-contain"
              onError={(e) => console.error("Failed to load image:", image, e)}
            />
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className=" w-full lg:h-screen lg:pt-8 pt-10  flex flex-col items-center justify-center ">
       {children}
      </div>
    </div>
  );
}
