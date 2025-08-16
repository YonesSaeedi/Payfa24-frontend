import React, { useState, useContext } from "react";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { ThemeContext } from "../Context/ThemeContext";
import IconEyeOpen from "../assets/Icons/Login/IconEyeOpen";
import IconEyeClosed from "../assets/Icons/Login/IconEyeClosed";
import AuthLayout from "../layouts/AuthLayout";
import imageLoginDark from "../assets/Login ImageDark.png";
import imageLoginLight from "../assets/Login imageLight.png";
import TextField from "../Components/InputField/TextField"; 
import { Link } from "react-router-dom";

export default function LoginPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailIsEmpty = !email.trim();
    const passwordIsEmpty = !password.trim();

    setEmailError(emailIsEmpty);
    setPasswordError(passwordIsEmpty);

    if (!emailIsEmpty && !passwordIsEmpty) {
      console.log("Submitted Email:", email);
      console.log("Submitted Password:", password);
    }
  };

  return (
    <AuthLayout image={theme === "dark" ? imageLoginDark : imageLoginLight}>
      <div className="flex items-center justify-center py-22" dir="rtl">
        <div className="w-full max-w-md px-4">
          <form onSubmit={handleSubmit}>
            <h1 className="text-[28px] font-bold text-primary mb-2 text-center">
              ورود به پی‌فا24
            </h1>
            <p
              className={`font-normal mb-10 text-[18px] ${
                theme === "dark" ? "text-[var(--text)]" : "--primary"
              }`}
            >
              برای ورود ایمیل یا شماره همراه خود را وارد کنید
            </p>

            <TextField
              label="ایمیل یا شماره همراه"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim()) setEmailError(false);
              }}
              error={emailError}
              focused={emailFocused}
              onFocus={() => {
                setEmailFocused(true);
                setEmailError(false);
              }}
              onBlur={() => setEmailFocused(false)}
            />

            <div className="sm:text-sm text-xs text-[var(--text-gray)] font-normal pb-6 flex gap-1 items-end justify-start">
              <span className="icon-wrapper h-4 w-4">
                <IconAlert />
              </span>
              <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            </div>

            {/* Use the new TextField component for Password */}
            <TextField
              label="رمز عبور خود را وارد کنید"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim()) setPasswordError(false);
              }}
              error={passwordError}
              focused={passwordFocused}
              onFocus={() => {
                setPasswordFocused(true);
                setPasswordError(false);
              }}
              onBlur={() => setPasswordFocused(false)}
              icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
              onIconClick={() => setShowPassword((prev) => !prev)}
            />

            <Link to={"/forgot-password"}>
            <div className="flex justify-between items-center mb-10">
              <p className="text-[var(--text-gray)] text-sm font-normal">
                رمز عبور خود را فراموش کرده‌اید؟
              </p>
              <span className="font-normal text-primary cursor-pointer text-[14px]">
                بازیابی رمز عبور
              </span>
            </div>
            </Link>

            <button
              type="submit"
              className="lg:w-full w-[343px] h-[48px] rounded-xl bg-primary text-white font-bold text-lg"
            >
              ادامه
            </button>
            <p className="text-sm font-normal text-[var(--text-gray)] pt-3 pb-10 text-start">
              هنوز ثبت نام نکرده‌اید؟
              <span className="text-primary text-sm px-1 font-normal">
                <a href="#">ساخت حساب کاربری</a>
              </span>
            </p>

            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-[var(--border-primary)]"></div>
              <p className="flex-none px-2 text-xs text-[var(--text-gray)]">
                ورود با
              </p>
              <div className="flex-grow h-px bg-[var(--border-primary)]"></div>
            </div>
            <button className="lg:w-full w-[343px] h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-[#8792AF] border border-[#D1D9F0]">
              <span className="icon-wrapper h-5 w-5">
                <IconGoogle />
              </span>
              اکانت گوگل
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}