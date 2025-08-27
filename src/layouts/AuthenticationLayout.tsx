import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";


interface AuthLayoutProps {
  children?: React.ReactNode;
  image?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export default function AuthenticationLayout({
  children,
  image,
  left,
  right,
}: AuthLayoutProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  return (
    <div
      className="w-full bg-white1"
    >

      <div className="w-full lg:container-style my-7 px-4 py-2">
        <BreadcrumbNavigation/>
      </div>

      <div className="w-full lg:container-style flex flex-col lg:gap-10 gap-6  md:flex-row px-4 lg:px-8">
        {/* ستون سمت چپ */}
        <div className="w-full  md:w-2/3 flex flex-col items-center justify-center my-4 ">
          {left ? (
            <div className="w-full flex flex-col items-center justify-center">
              {left}
            </div>
          ) : (
            image && (
              <div className="hidden md:flex w-full h-full flex-col items-center justify-center gap-4 p-0 bg-white4 rounded-e-2xl">
                <img
                  src={image}
                  alt="Authentication Visual"
                  className="object-contain max-h-[500px] w-auto"
                />
                <p
                  className={`text-center text-lg ${
                    theme === "dark" ? "text-black0" : "text-black0"
                  }`}
                >
                  لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید.
                  این مرحله تنها چند دقیقه زمان خواهد برد
                </p>
              </div>
            )
          )}
        </div>

        {/* ستون سمت راست */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          {right || children}
        </div>
      </div>
    </div>
  );
}
