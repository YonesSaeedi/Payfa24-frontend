// src/components/AuthenticationIntro.tsx
// src/components/AuthenticationIntro.tsx

import React, { useContext } from "react";
import enticationDark from "../../../../assets/enticationDark.png";
import enticationLight from "../../../../assets/enticationLight.png";
import { ThemeContext } from "../../../../context/ThemeContext";

// تعریف اینترفیس برای پراپ‌ها
interface Props {
  onNext: () => void;
}

const AuthenticationIntro: React.FC<Props> = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  return (
    <div className="hidden lg:flex flex-col items-center justify-center gap-6 lg:mb-16">
      <img src={theme === "dark" ? enticationDark : enticationLight} alt="auth" className="object-contain" />
      <p dir="rtl" className="text-center text-lg text-black0 font-medium" >لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید. این مرحله تنها چند دقیقه زمان خواهد برد .</p>
    </div>
  );
};

export default AuthenticationIntro;
