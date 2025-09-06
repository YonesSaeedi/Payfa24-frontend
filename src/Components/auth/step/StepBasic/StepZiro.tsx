// src/components/AuthenticationIntro.tsx
// src/components/AuthenticationIntro.tsx

import React, { useContext } from "react";
import enticationDark from "../../../../assets/enticationDark.png";
import enticationLight from "../../../../assets/enticationLight.png";
import { ThemeContext } from "../../../../Context/ThemeContext";

// تعریف اینترفیس برای پراپ‌ها
interface Props {
  onNext: () => void;
}

const AuthenticationIntro: React.FC<Props> = ({ onNext }) => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  return (
    <div className="hidden md:flex flex-col items-center justify-center gap-6 lg:mb-16">
      <img
        src={theme === "dark" ? enticationDark : enticationLight}
        alt="auth"
        className="object-contain"
      />
      <p className="text-center text-lg text-black0">
        لطفاً جهت دسترسی به خدمات ابتدایی، احراز هویت سطح پایه را تکمیل نمایید.
      </p>
      {/* دکمه برای فراخوانی onNext */}
      <button onClick={onNext}>شروع</button>
    </div>
  );
};

export default AuthenticationIntro;