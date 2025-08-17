import React, { useContext, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { ThemeContext } from "../Context/ThemeContext";
import InviteLight from "../assets/InviteLight.png";
import InviteDark from "../assets/InviteDark.png";
import TextField from "../Components/InputField/TextField";
import IconAlert from "../assets/Icons/Login/IconAlert";

export default function InviteLogin() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const [email, setEmail] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState("");

  const [checked4, setChecked4] = useState(true);

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const switchClass = (isChecked: boolean) =>
  `w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
   ${isChecked ? "bg-gray-400" : "bg-blue-500"}`;

const knobClass = (isChecked: boolean) =>
  `bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
   ${isChecked ? "translate-x-0" : "translate-x-6"}`; // دایره از راست به چپ حرکت کنه


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout image={theme === "dark" ? InviteDark : InviteLight}>
      <div>
        <div >
          <form onSubmit={handleSubmit} dir="ltr">
            <h1 className="text-[28px] font-bold text-primary text-center">
              ثبت نام در پی فا24
            </h1>
            <p
              className={`font-normal mb-10 mt-3 text-[18px] text-center ${
                theme === "dark" ? "text-[var(--text)]" : "--primary"
              }`}
            >
              برای ثبت نام ایمیل یا شماره همراه خود را وارد کنید
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

            <div className="sm:text-sm flex-row-reverse text-xs text-[var(--text-gray)] font-normal mt-2 pb-6 flex gap-1 items-end justify-start">
              <span className="icon-wrapper h-4 w-4">
                <IconAlert />
              </span>
              <p dir="rtl">توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            </div>

            {/* <div className="text-[--primary] flex justify-between items-center">
              <span>کد دعوت دارید؟</span>
              <div
                className={switchClass(checked4, true)}
                onClick={() => toggle(setChecked4)}
              >
                <div className={knobClass(checked4)}></div>
              </div>
            </div> */}

            <div className="text-[--primary] flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>کد دعوت دارید؟</span>
                <div
                  className={switchClass(checked4)}
                  onClick={() => toggle(setChecked4)}
                >
                  <div className={knobClass(checked4)}></div>
                </div>
              </div>

              {/* ورودی کد دعوت فقط وقتی سوئیچ روشنه نمایش داده میشه */}
              {checked4 && (
                <TextField
                  label="کد دعوت"
                  value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
