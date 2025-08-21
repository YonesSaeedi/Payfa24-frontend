import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

export default function AuthenticationLayout({ children, image }: AuthLayoutProps) {
  interface AuthLayoutProps {
    children: React.ReactNode;
    image?: string;
  }

  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { toggleTheme } = context;

  return (
    <div className="flex flex-col gap-20 md:flex-row py-14 container-style  dark:bg-[var(--extra-dark-background)]">
      {/* image section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        {image && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-0 dark:bg-[var(--extra-dark-background)] rounded-e-2xl">
            <img src={image} alt="Authentication Visual" className="object-contain" />
            <p className="text-center text-lg text-[#131C28] dark:text-[#FFFFFF]">
              لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد
            </p>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2  flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}