import { useState, useContext } from "react";
import AuthLayout from "../layouts/AuthLayout";
import createPasswordLight from "../assets/CreatePasswordLight.png";
import createPasswordDark from "../assets/CreatePasswordDark.png";
import { ThemeContext } from "../Context/ThemeContext";
import TextField from "../Components/InputField/TextField";
import PasswordConditionItem from "../Components/InputField/PasswordConditionitem/PasswordConditionItem";

export default function TextFieldPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // if 
  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const isValid = hasMinLength && hasLower && hasUpper && hasNumber;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (isValid) {
      console.log("Password is valid!");
    }
  };

  return (
    <AuthLayout
      image={theme === "dark" ? createPasswordDark : createPasswordLight}
    >
      <div className="flex items-center justify-center" dir="rtl">
        <div className="w-full max-w-md py-10">
          <form onSubmit={handleSubmit}>
            <h1 className="lg:text-[28px] text-[22px] font-bold text-primary mb-3 text-center">
              ایجاد رمز عبور
            </h1>
            <p
              className={`font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] text-center text-[var(--text)] 
                // theme === "dark" ? "text-[var(--text)]" : "text-primary"
              `}
            >
              رمز عبور برای حساب کاربری خود وارد کنید.
            </p>

            <TextField
              label="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={submitted && !isValid} // فقط وقتی submit شد و رمز نامعتبر
              focused={password.length > 0 || passwordFocused || submitted} // تایپ یا فوکوس یا submit
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />

            {/* لیست شرط‌ها */}
            <div className="mt-3 space-y-1 text-xs font-normal">
              <PasswordConditionItem
                ok={hasMinLength}
                text="حداقل دارای ۸ کاراکتر"
                password={password}
              />
              <PasswordConditionItem
                ok={hasLower && hasUpper}
                text="حداقل یک حرف کوچک و بزرگ"
                password={password}
              />
              <PasswordConditionItem
                ok={hasNumber}
                text="حداقل یک عدد"
                password={password}
              />
            </div>

            <button
              type="submit"
              className="w-full h-[48px] rounded-xl bg-primary lg:mt-14 mt-12 text-white font-bold text-lg"
            >
              ثبت
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
