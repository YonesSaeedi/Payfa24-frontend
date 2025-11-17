import React, { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../context/ThemeContext";
import enticationDark from "../assets/enticationDark.png";
import enticationLight from "../assets/enticationLight.png";

interface AuthenticationLeftProps {
  step?: number;
  text1?: string;
  text2?: string;
  bottomText?: string;
}

const AuthenticationLeft: React.FC<AuthenticationLeftProps> = ({  text1, text2,  }) => {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }
  const { theme } = context;

  return (
    <div  className="hidden lg:flex flex-col items-center justify-center gap-6">
      <img
        src={theme === "dark" ? enticationDark : enticationLight}
        alt="auth"
        className="object-contain"
      />
      <div className="flex gap-4 flex-col">
        <h3 className="text-center text-2xl text-black1 font-bold">{text1}</h3>
        <p dir="rtl" className="text-center text-lg text-black1 font-medium w-full">{text2}</p>
      </div>
    </div>
  );
};

export default AuthenticationLeft;
